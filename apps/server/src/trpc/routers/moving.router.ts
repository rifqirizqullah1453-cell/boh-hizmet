import { movingEstimateInput, movingCreateOrderInput } from "@boh/contracts";
import { movingOrders } from "@boh/db";
import { router, protectedProcedure, publicProcedure } from "../procedures";
import { getMovingConfig, estimateMovingPrice } from "../../services/pricing/moving.pricing";
import { broadcastNewOrder } from "../../services/firestore/activeOrders.service";
import { insertOrder } from "../../services/order/order.repository";

export const movingRouter = router({
  getConfig: publicProcedure.query(({ ctx }) => getMovingConfig(ctx.db)),

  estimatePrice: publicProcedure
    .input(movingEstimateInput)
    .query(({ ctx, input }) => estimateMovingPrice(ctx.db, input)),

  createOrder: protectedProcedure
    .input(movingCreateOrderInput)
    .mutation(async ({ ctx, input }) => {
      const {
        pickupAddress, pickupLat, pickupLng,
        destinationAddress, destinationLat, destinationLng,
        scheduledAt, notes, ...estimateInput
      } = input;

      const estimate = await estimateMovingPrice(ctx.db, estimateInput);

      const orderId = await insertOrder(ctx.db, {
        id:                 "",
        customerId:         ctx.user.id,
        serviceType:        "moving",
        pickupAddress,
        pickupLat:          String(pickupLat),
        pickupLng:          String(pickupLng),
        destinationAddress,
        destinationLat:     String(destinationLat),
        destinationLng:     String(destinationLng),
        notes:              notes ?? null,
        price:              estimate.total,
        status:             "PENDING",
      });

      await ctx.db.insert(movingOrders).values({
        orderId,
        sizeSlug:         input.sizeSlug,
        pickupFloor:      input.pickupFloor,
        destFloor:        input.destFloor,
        hasLift:          input.hasLift ? 1 : 0,
        heavyItemSlugs:   JSON.stringify(input.heavyItemSlugs),
        customHeavyItems: JSON.stringify(input.customHeavyItems),
        scheduledAt:      scheduledAt ?? null,
        priceBreakdown:   JSON.stringify(estimate.lines),
      });

      try {
        await broadcastNewOrder({
          orderId,
          status:         "PENDING",
          serviceType:    "moving",
          pickupAddress,
          pickupLat,
          pickupLng,
          price:          estimate.total,
          customerName:   ctx.user.name ?? "Customer",
          workerId:       null,
          createdAt:      Date.now(),
        });
      } catch (err) {
        console.error(`[moving.router] Firestore broadcast failed for ${orderId}`, err);
      }

      return { orderId, estimate };
    }),
});
