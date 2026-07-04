import { z } from "zod";
import { orderStatusSchema } from "@boh/contracts";
import { router, adminProcedure } from "../procedures";
import * as orderService from "../../services/order/order.service";
import {
  listAllOrders,
  listAllUsers,
  updateUserRole,
} from "../../services/admin/admin.repository";

const paginationInput = {
  limit: z.number().int().min(1).max(100).default(50),
  cursor: z.string().optional(),
};

export const adminRouter = router({
  // ── Order visibility ──────────────────────────────────────────────────────

  listOrders: adminProcedure
    .input(
      z.object({
        ...paginationInput,
        status: orderStatusSchema.optional(),
        workerId: z.number().int().optional(),
        customerId: z.number().int().optional(),
      })
    )
    .query(({ ctx, input }) => listAllOrders(ctx.db, input)),

  // ── User visibility & role management ────────────────────────────────────

  listUsers: adminProcedure
    .input(
      z.object({
        ...paginationInput,
        role: z.enum(["customer", "worker", "admin"]).optional(),
      })
    )
    .query(({ ctx, input }) => listAllUsers(ctx.db, input)),

  // Assigns any role to any user. The primary use case is:
  //   1. Promoting a newly registered worker (who defaulted to "customer")
  //   2. Assigning the "admin" role to a trusted operator
  // Deliberately admin-only — the self-upgrade path via auth.register is for
  // first-time onboarding only and can't assign the "admin" role at all.
  setUserRole: adminProcedure
    .input(
      z.object({
        userId: z.number().int(),
        role: z.enum(["customer", "worker", "admin"]),
      })
    )
    .mutation(({ ctx, input }) => updateUserRole(ctx.db, input.userId, input.role)),

  // ── Order overrides ───────────────────────────────────────────────────────

  forceReassignOrder: adminProcedure
    .input(z.object({ orderId: z.string(), newWorkerId: z.number() }))
    .mutation(({ ctx, input }) =>
      orderService.adminForceReassign(ctx.db, input.orderId, input.newWorkerId)
    ),

  forceCancelOrder: adminProcedure
    .input(z.object({ orderId: z.string(), reason: z.string().min(1) }))
    .mutation(({ ctx, input }) =>
      orderService.adminForceCancel(ctx.db, input.orderId, input.reason)
    ),
});
