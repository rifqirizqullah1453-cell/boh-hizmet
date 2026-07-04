import { z } from "zod";

// ─── Breakdown line item ───────────────────────────────────────────────────────

export const cleaningBreakdownLine = z.object({
  label: z.string(),
  price: z.number(),
  type:  z.enum(["base", "room", "surcharge", "addon", "equipment", "transport"]),
});
export type CleaningBreakdownLine = z.infer<typeof cleaningBreakdownLine>;

// ─── Config output (loaded once by the wizard, all prices from DB) ─────────────

export const cleaningConfigOutput = z.object({
  serviceTypes: z.array(z.object({
    slug:               z.string(),
    label:              z.string(),
    description:        z.string().nullable(),
    priceMultiplier:    z.number(),
    durationMultiplier: z.number(),
    sortOrder:          z.number(),
  })),
  propertyTypes: z.array(z.object({
    slug:      z.string(),
    label:     z.string(),
    emoji:     z.string().nullable(),
    sortOrder: z.number(),
  })),
  dirtLevels: z.array(z.object({
    slug:               z.string(),
    label:              z.string(),
    priceMultiplier:    z.number(),
    durationMultiplier: z.number(),
    sortOrder:          z.number(),
  })),
  addons: z.array(z.object({
    slug:        z.string(),
    label:       z.string(),
    emoji:       z.string().nullable(),
    price:       z.number(),
    durationMin: z.number(),
  })),
  // Included so the frontend can compute estimates locally (no extra API call per step)
  baseRates: z.array(z.object({
    propertyTypeSlug:  z.string(),
    areaMin:           z.number(),
    areaMax:           z.number().nullable(),
    basePrice:         z.number(),
    baseDurationHours: z.number(),
    baseWorkers:       z.number(),
  })),
  roomFees: z.object({
    bedroom:  z.object({ pricePerUnit: z.number(), durationMinPerUnit: z.number() }),
    bathroom: z.object({ pricePerUnit: z.number(), durationMinPerUnit: z.number() }),
  }),
  config: z.object({
    weekendMultiplier: z.number(),
    equipmentFee:      z.number(),
    transportBaseKm:   z.number(),
    transportPerKm:    z.number(),
    transportMaxFee:   z.number(),
  }),
});
export type CleaningConfigOutput = z.infer<typeof cleaningConfigOutput>;

// ─── Estimate I/O ──────────────────────────────────────────────────────────────

export const cleaningEstimateInput = z.object({
  propertyTypeSlug: z.string(),
  serviceTypeSlug:  z.string(),
  areaM2:           z.number().int().min(1).max(5000),
  bedroomCount:     z.number().int().min(0).max(30),
  bathroomCount:    z.number().int().min(0).max(30),
  dirtLevelSlug:    z.string(),
  bringsEquipment:  z.boolean(),
  addonSlugs:       z.array(z.string()),
  distanceKm:       z.number().min(0),
  isWeekend:        z.boolean(),
});
export type CleaningEstimateInput = z.infer<typeof cleaningEstimateInput>;

export const cleaningEstimateOutput = z.object({
  estimatedHours: z.number(),
  workerCount:    z.number(),
  lines:          z.array(cleaningBreakdownLine),
  total:          z.number(),
});
export type CleaningEstimateOutput = z.infer<typeof cleaningEstimateOutput>;

// ─── Create order ──────────────────────────────────────────────────────────────

export const cleaningCreateOrderInput = cleaningEstimateInput.extend({
  address: z.string().min(1),
  lat:     z.number().min(-90).max(90),
  lng:     z.number().min(-180).max(180),
  notes:   z.string().optional(),
});
export type CleaningCreateOrderInput = z.infer<typeof cleaningCreateOrderInput>;
