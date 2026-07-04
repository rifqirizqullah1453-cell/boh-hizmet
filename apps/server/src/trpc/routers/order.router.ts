import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createOrderInput,
  acceptOrderInput,
  updateOrderStatusInput,
  listMyOrdersInput,
  estimatePriceInput,
} from "@boh/contracts";
import { router, protectedProcedure, publicProcedure } from "../procedures";
import * as orderService from "../../services/order/order.service";
import {
  findOrderById,
  assertOrderAccess,
  listOrdersForUser,
  findActiveOrdersForWorker,
} from "../../services/order/order.repository";

export const orderRouter = router({
  create: protectedProcedure
    .input(createOrderInput)
    .mutation(({ ctx, input }) => orderService.createOrder(ctx.db, ctx.user, input)),

  // Live quote shown before the customer submits — same formula order.create
  // uses internally, just without persisting anything.
  estimatePrice: publicProcedure
    .input(estimatePriceInput)
    .query(({ input }) => orderService.estimateOrderPrice(input)),

  // Used by the Client App's order-tracking screen as the source-of-truth
  // fallback for whenever the Firestore active_orders mirror can't answer
  // the question — most importantly, once an order reaches a terminal
  // state, order.service.ts deletes that doc entirely (see
  // activeOrders.service.ts#retireActiveOrder), so there's no way to tell
  // COMPLETED apart from CANCELLED from Firestore alone at that point.
  byId: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const order = await findOrderById(ctx.db, input.orderId);
      assertOrderAccess(order, ctx.user);
      return order;
    }),

  // Race-condition-safe accept: see order.repository.ts#acceptOrderAtomic.
  // Throws TRPCError({ code: "CONFLICT" }) if another worker already won.
  accept: protectedProcedure
    .input(acceptOrderInput)
    .mutation(({ ctx, input }) => orderService.acceptOrder(ctx.db, ctx.user, input.orderId)),

  // Order history for the "Pesanan" tab — customer sees what they ordered,
  // worker sees what they were assigned. Offset-paginated, see
  // order.repository.ts#listOrdersForUser for why offset over keyset here.
  listMine: protectedProcedure
    .input(listMyOrdersInput)
    .query(({ ctx, input }) => listOrdersForUser(ctx.db, ctx.user, input)),

  // Worker App's "pesanan aktif saya" view — ACCEPTED + IN_PROGRESS orders
  // only. Lets the worker resume a job after closing and reopening the app
  // without hunting through listMine. Empty array for non-workers.
  myActive: protectedProcedure.query(({ ctx }) => {
    if (ctx.user.role !== "worker") return [];
    return findActiveOrdersForWorker(ctx.db, ctx.user.id);
  }),

  updateStatus: protectedProcedure
    .input(updateOrderStatusInput)
    .mutation(({ ctx, input }) => {
      if (input.status === "PENDING" || input.status === "ACCEPTED") {
        // Workers/customers can only push the state machine forward to
        // IN_PROGRESS/COMPLETED/CANCELLED. Going back to PENDING/ACCEPTED
        // is an admin-only override (see admin.router.ts).
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Cannot transition to ${input.status} via this procedure.`,
        });
      }
      return orderService.progressOrder(ctx.db, ctx.user, input.orderId, input.status, {
        cancelReason: input.cancelReason,
      });
    }),
});
