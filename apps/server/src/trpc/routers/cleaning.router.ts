import { cleaningEstimateInput, cleaningCreateOrderInput } from "@boh/contracts";
import { cleaningOrders } from "@boh/db";
import { router, protectedProcedure, publicProcedure } from "../procedures";
import { getCleaningConfig, estimateCleaningPrice } from "../../services/pricing/cleaning.pricing";
import { broadcastNewOrder } from "../../services/firestore/activeOrders.service";
import { insertOrder } from "../../services/order/order.repository";

export const cleaningRouter = router({
  // Wizard loads this once — all prices, multipliers, and options come from DB.
  getConfig: publicProcedure.query(({ ctx }) => getCleaningConfig(ctx.db)),

  // Live price preview as the user moves through the wizard steps.
  estimatePrice: publicProcedure
    .input(cleaningEstimateInput)
    .query(({ ctx, input }) => estimateCleaningPrice(ctx.db, input)),

  // Final order submission — price is always re-computed here, never trusted from client.
  createOrder: protectedProcedure
    .input(cleaningCreateOrderInput)
    .mutation(async ({ ctx, input }) => {
      const { address, lat, lng, notes, ...estimateInput } = input;

      const estimate = await estimateCleaningPrice(ctx.db, estimateInput);

      // For cleaning, pickup = destination = the customer's property address.
      // The worker navigates to the customer; there is no A→B route.
      const orderId = await insertOrder(ctx.db, {
        id:                 "",
        customerId:         ctx.user.id,
        serviceType:        "cleaning",
        pickupAddress:      address,
        pickupLat:          String(lat),
        pickupLng:          String(lng),
        destinationAddress: address,
        destinationLat:     String(lat),
        destinationLng:     String(lng),
        notes:              notes ?? null,
        price:              estimate.total,
        status:             "PENDING",
      });

      await ctx.db.insert(cleaningOrders).values({
        orderId,
        propertyTypeSlug: input.propertyTypeSlug,
        serviceTypeSlug:  input.serviceTypeSlug,
        areaM2:           input.areaM2,
        bedroomCount:     input.bedroomCount,
        bathroomCount:    input.bathroomCount,
        dirtLevelSlug:    input.dirtLevelSlug,
        bringsEquipment:  input.bringsEquipment,
        addonSlugs:       JSON.stringify(input.addonSlugs),
        estimatedHours:   String(estimate.estimatedHours),
        workerCount:      estimate.workerCount,
        priceBreakdown:   JSON.stringify(estimate.lines),
      });

      try {
        await broadcastNewOrder({
          orderId,
          status:         "PENDING",
          serviceType:    "cleaning",
          pickupAddress:  address,
          pickupLat:      lat,
          pickupLng:      lng,
          price:          estimate.total,
          customerName:   ctx.user.name ?? "Customer",
          workerId:       null,
          createdAt:      Date.now(),
        });
      } catch (err) {
        console.error(`[cleaning.router] Firestore broadcast failed for ${orderId}`, err);
      }

      return { orderId, estimate };
    }),
});
