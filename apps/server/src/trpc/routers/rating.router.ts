import { z } from "zod";
import { submitRatingInput } from "@boh/contracts";
import { router, protectedProcedure } from "../procedures";
import { submitRating } from "../../services/rating/rating.service";
import { findRatingByOrderId } from "../../services/rating/rating.repository";
import { findOrderById, assertOrderAccess } from "../../services/order/order.repository";

export const ratingRouter = router({
  submit: protectedProcedure
    .input(submitRatingInput)
    .mutation(({ ctx, input }) => submitRating(ctx.db, ctx.user, input)),

  // Lets the Client App know whether to show "rate this order" or "already
  // rated" — gated through the same order-access check as everything else
  // that reads a single order, so it can't be used to probe other people's
  // ratings by orderId.
  forOrder: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const order = await findOrderById(ctx.db, input.orderId);
      assertOrderAccess(order, ctx.user);
      return (await findRatingByOrderId(ctx.db, input.orderId)) ?? null;
    }),
});
