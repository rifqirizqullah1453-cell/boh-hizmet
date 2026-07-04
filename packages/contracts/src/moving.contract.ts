import { z } from "zod";

export const movingBreakdownLine = z.object({
  label: z.string(),
  price: z.number(),
  type:  z.enum(["base", "floor", "item", "weekend"]),
});
export type MovingBreakdownLine = z.infer<typeof movingBreakdownLine>;

export const movingConfigOutput = z.object({
  sizes: z.array(z.object({
    slug:        z.string(),
    label:       z.string(),
    description: z.string().nullable(),
    basePrice:   z.number(),
    vehicleType: z.string(),
    helperCount: z.number(),
    sortOrder:   z.number(),
  })),
  heavyItems: z.array(z.object({
    slug:  z.string(),
    label: z.string(),
    emoji: z.string().nullable(),
    price: z.number(),
  })),
  config: z.object({
    floorBaseSurcharge: z.number(),
    floorPerFloorFee:   z.number(),
    weekendMultiplier:  z.number(),
    customItemFee:      z.number(),
  }),
});
export type MovingConfigOutput = z.infer<typeof movingConfigOutput>;

export const movingEstimateInput = z.object({
  sizeSlug:         z.string(),
  pickupFloor:      z.number().int().min(1).max(50),
  destFloor:        z.number().int().min(1).max(50),
  hasLift:          z.boolean(),
  heavyItemSlugs:   z.array(z.string()),
  customHeavyItems: z.array(z.string()),
  isWeekend:        z.boolean(),
});
export type MovingEstimateInput = z.infer<typeof movingEstimateInput>;

export const movingEstimateOutput = z.object({
  vehicleType: z.string(),
  helperCount: z.number(),
  lines:       z.array(movingBreakdownLine),
  total:       z.number(),
});
export type MovingEstimateOutput = z.infer<typeof movingEstimateOutput>;

export const movingCreateOrderInput = movingEstimateInput.extend({
  pickupAddress:      z.string().min(3),
  pickupLat:          z.number(),
  pickupLng:          z.number(),
  destinationAddress: z.string().min(3),
  destinationLat:     z.number(),
  destinationLng:     z.number(),
  scheduledAt:        z.string().optional(),
  notes:              z.string().optional(),
});
export type MovingCreateOrderInput = z.infer<typeof movingCreateOrderInput>;
