import { eq, and, lte, gte, or, isNull } from "drizzle-orm";
import type { Database } from "@boh/db";
import {
  cleaningServiceTypes,
  cleaningPropertyTypes,
  cleaningBaseRates,
  cleaningRoomFees,
  cleaningDirtLevels,
  cleaningAddons,
  cleaningConfig,
} from "@boh/db";
import type {
  CleaningEstimateInput,
  CleaningEstimateOutput,
  CleaningConfigOutput,
  CleaningBreakdownLine,
} from "@boh/contracts";

// ─── Config loader ─────────────────────────────────────────────────────────────

export async function getCleaningConfig(db: Database): Promise<CleaningConfigOutput> {
  const [serviceTypes, propertyTypes, dirtLevels, addons, roomFeeRows, baseRateRows, configRows] =
    await Promise.all([
      db.select().from(cleaningServiceTypes).orderBy(cleaningServiceTypes.sortOrder),
      db.select().from(cleaningPropertyTypes).orderBy(cleaningPropertyTypes.sortOrder),
      db.select().from(cleaningDirtLevels).orderBy(cleaningDirtLevels.sortOrder),
      db.select().from(cleaningAddons)
        .where(eq(cleaningAddons.active, true))
        .orderBy(cleaningAddons.sortOrder),
      db.select().from(cleaningRoomFees),
      db.select().from(cleaningBaseRates),
      db.select().from(cleaningConfig),
    ]);

  const cfgMap = Object.fromEntries(configRows.map(r => [r.key, r.value]));

  const bedroomRow  = roomFeeRows.find(r => r.roomType === "bedroom")!;
  const bathroomRow = roomFeeRows.find(r => r.roomType === "bathroom")!;

  return {
    serviceTypes: serviceTypes.map(s => ({
      slug:               s.slug,
      label:              s.label,
      description:        s.description ?? null,
      priceMultiplier:    parseFloat(s.priceMultiplier),
      durationMultiplier: parseFloat(s.durationMultiplier),
      sortOrder:          s.sortOrder,
    })),
    propertyTypes: propertyTypes.map(p => ({
      slug:      p.slug,
      label:     p.label,
      emoji:     p.emoji ?? null,
      sortOrder: p.sortOrder,
    })),
    dirtLevels: dirtLevels.map(d => ({
      slug:               d.slug,
      label:              d.label,
      priceMultiplier:    parseFloat(d.priceMultiplier),
      durationMultiplier: parseFloat(d.durationMultiplier),
      sortOrder:          d.sortOrder,
    })),
    addons: addons.map(a => ({
      slug:        a.slug,
      label:       a.label,
      emoji:       a.emoji ?? null,
      price:       a.price,
      durationMin: a.durationMin,
    })),
    baseRates: baseRateRows.map(r => ({
      propertyTypeSlug:  r.propertyTypeSlug,
      areaMin:           r.areaMin,
      areaMax:           r.areaMax ?? null,
      basePrice:         r.basePrice,
      baseDurationHours: parseFloat(r.baseDurationHours),
      baseWorkers:       r.baseWorkers,
    })),
    roomFees: {
      bedroom:  { pricePerUnit: bedroomRow.pricePerUnit,  durationMinPerUnit: bedroomRow.durationMinPerUnit  },
      bathroom: { pricePerUnit: bathroomRow.pricePerUnit, durationMinPerUnit: bathroomRow.durationMinPerUnit },
    },
    config: {
      weekendMultiplier: parseFloat(cfgMap["weekend_multiplier"] ?? "1.25"),
      equipmentFee:      parseInt(cfgMap["equipment_fee"]      ?? "100"),
      transportBaseKm:   parseFloat(cfgMap["transport_base_km"]   ?? "3"),
      transportPerKm:    parseInt(cfgMap["transport_per_km"]    ?? "20"),
      transportMaxFee:   parseInt(cfgMap["transport_max_fee"]   ?? "150"),
    },
  };
}

// ─── Pricing engine ────────────────────────────────────────────────────────────
// Single source of truth for price computation.
// Called both by the estimatePrice procedure (no side effects) and by
// createOrder (price is always re-computed server-side, never trusted from client).

export async function estimateCleaningPrice(
  db: Database,
  input: CleaningEstimateInput
): Promise<CleaningEstimateOutput> {
  const cfg = await getCleaningConfig(db);

  // 1. Base rate lookup
  const [baseRate] = await db
    .select()
    .from(cleaningBaseRates)
    .where(
      and(
        eq(cleaningBaseRates.propertyTypeSlug, input.propertyTypeSlug),
        lte(cleaningBaseRates.areaMin, input.areaM2),
        or(isNull(cleaningBaseRates.areaMax), gte(cleaningBaseRates.areaMax, input.areaM2))
      )
    )
    .limit(1);

  if (!baseRate) {
    throw new Error(
      `No base rate configured for property="${input.propertyTypeSlug}" at ${input.areaM2} m²`
    );
  }

  // 2. Config lookups
  const serviceType = cfg.serviceTypes.find(s => s.slug === input.serviceTypeSlug);
  if (!serviceType) throw new Error(`Unknown service type: ${input.serviceTypeSlug}`);

  const dirtLevel = cfg.dirtLevels.find(d => d.slug === input.dirtLevelSlug);
  if (!dirtLevel) throw new Error(`Unknown dirt level: ${input.dirtLevelSlug}`);

  const propertyType = cfg.propertyTypes.find(p => p.slug === input.propertyTypeSlug);
  const selectedAddons = cfg.addons.filter(a => input.addonSlugs.includes(a.slug));

  // 3. Build line items
  const lines: CleaningBreakdownLine[] = [];

  const basePrice = baseRate.basePrice;
  lines.push({
    label: `${propertyType?.label ?? input.propertyTypeSlug} ${input.areaM2} m²`,
    price: basePrice,
    type:  "base",
  });

  const bedroomPrice  = input.bedroomCount  * cfg.roomFees.bedroom.pricePerUnit;
  const bathroomPrice = input.bathroomCount * cfg.roomFees.bathroom.pricePerUnit;

  if (bedroomPrice > 0) {
    lines.push({ label: `${input.bedroomCount} Kamar Tidur`,  price: bedroomPrice,  type: "room" });
  }
  if (bathroomPrice > 0) {
    lines.push({ label: `${input.bathroomCount} Kamar Mandi`, price: bathroomPrice, type: "room" });
  }

  const subtotalBase = basePrice + bedroomPrice + bathroomPrice;

  // Service type surcharge (General Cleaning = ×1.0 → no surcharge)
  const afterService    = Math.round(subtotalBase * serviceType.priceMultiplier);
  const serviceSurcharge = afterService - subtotalBase;
  if (serviceSurcharge > 0) {
    lines.push({ label: serviceType.label, price: serviceSurcharge, type: "surcharge" });
  }

  // Dirt level surcharge (Ringan = ×1.0 → no surcharge)
  const afterDirt    = Math.round(afterService * dirtLevel.priceMultiplier);
  const dirtSurcharge = afterDirt - afterService;
  if (dirtSurcharge > 0) {
    lines.push({ label: `Kekotoran ${dirtLevel.label}`, price: dirtSurcharge, type: "surcharge" });
  }

  // Weekend surcharge
  let weekendSurcharge = 0;
  if (input.isWeekend) {
    const afterWeekend = Math.round(afterDirt * cfg.config.weekendMultiplier);
    weekendSurcharge   = afterWeekend - afterDirt;
    if (weekendSurcharge > 0) {
      lines.push({ label: "Akhir Pekan", price: weekendSurcharge, type: "surcharge" });
    }
  }

  // Addons
  for (const addon of selectedAddons) {
    lines.push({
      label: [addon.emoji, addon.label].filter(Boolean).join(" "),
      price: addon.price,
      type:  "addon",
    });
  }

  // Equipment fee (worker brings their own tools)
  if (input.bringsEquipment) {
    lines.push({ label: "Peralatan Kebersihan", price: cfg.config.equipmentFee, type: "equipment" });
  }

  // Transport fee (distance beyond the free-km threshold)
  const overKm       = Math.max(0, input.distanceKm - cfg.config.transportBaseKm);
  const transportFee = Math.min(
    Math.round(overKm * cfg.config.transportPerKm),
    cfg.config.transportMaxFee
  );
  if (transportFee > 0) {
    lines.push({
      label: `Transport (${input.distanceKm.toFixed(1)} km)`,
      price: transportFee,
      type:  "transport",
    });
  }

  const total = lines.reduce((s, l) => s + l.price, 0);

  // 4. Duration estimate
  const baseDurMin    = parseFloat(String(baseRate.baseDurationHours)) * 60;
  const roomDurMin    =
    input.bedroomCount  * cfg.roomFees.bedroom.durationMinPerUnit +
    input.bathroomCount * cfg.roomFees.bathroom.durationMinPerUnit;

  const afterServiceDur = Math.round((baseDurMin + roomDurMin) * serviceType.durationMultiplier);
  const afterDirtDur    = Math.round(afterServiceDur * dirtLevel.durationMultiplier);
  const addonDurMin     = selectedAddons.reduce((s, a) => s + a.durationMin, 0);
  const totalDurMin     = afterDirtDur + addonDurMin;

  const estimatedHours = Math.round((totalDurMin / 60) * 10) / 10;

  return {
    estimatedHours,
    workerCount: baseRate.baseWorkers,
    lines,
    total,
  };
}
