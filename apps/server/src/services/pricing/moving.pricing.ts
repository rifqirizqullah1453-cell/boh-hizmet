import { eq } from "drizzle-orm";
import type { Database } from "@boh/db";
import { movingSizes, movingHeavyItems, movingConfig } from "@boh/db";
import type {
  MovingEstimateInput,
  MovingEstimateOutput,
  MovingConfigOutput,
  MovingBreakdownLine,
} from "@boh/contracts";

// ─── Config loader ─────────────────────────────────────────────────────────────

export async function getMovingConfig(db: Database): Promise<MovingConfigOutput> {
  const [sizes, heavyItems, configRows] = await Promise.all([
    db.select().from(movingSizes).orderBy(movingSizes.sortOrder),
    db.select()
      .from(movingHeavyItems)
      .where(eq(movingHeavyItems.active, 1))
      .orderBy(movingHeavyItems.sortOrder),
    db.select().from(movingConfig),
  ]);

  const cfgMap = Object.fromEntries(configRows.map(r => [r.key, r.value]));

  return {
    sizes: sizes.map(s => ({
      slug:        s.slug,
      label:       s.label,
      description: s.description ?? null,
      basePrice:   s.basePrice,
      vehicleType: s.vehicleType,
      helperCount: s.helperCount,
      sortOrder:   s.sortOrder,
    })),
    heavyItems: heavyItems.map(i => ({
      slug:  i.slug,
      label: i.label,
      emoji: i.emoji ?? null,
      price: i.price,
    })),
    config: {
      floorBaseSurcharge: parseInt(cfgMap["floor_base_surcharge"] ?? "200"),
      floorPerFloorFee:   parseInt(cfgMap["floor_per_floor_fee"]  ?? "75"),
      weekendMultiplier:  parseFloat(cfgMap["weekend_multiplier"] ?? "1.20"),
      customItemFee:      parseInt(cfgMap["custom_item_fee"]      ?? "125"),
    },
  };
}

// ─── Pricing engine ────────────────────────────────────────────────────────────

export async function estimateMovingPrice(
  db: Database,
  input: MovingEstimateInput
): Promise<MovingEstimateOutput> {
  const cfg = await getMovingConfig(db);

  const size = cfg.sizes.find(s => s.slug === input.sizeSlug);
  if (!size) throw new Error(`Unknown moving size: ${input.sizeSlug}`);

  const lines: MovingBreakdownLine[] = [];

  // 1. Base price from size
  lines.push({ label: size.label, price: size.basePrice, type: "base" });

  // 2. Floor surcharge — only when no lift and at least one floor > 1
  let floorSurcharge = 0;
  if (!input.hasLift && (input.pickupFloor > 1 || input.destFloor > 1)) {
    const extraFloors = (input.pickupFloor - 1) + (input.destFloor - 1);
    floorSurcharge = cfg.config.floorBaseSurcharge + extraFloors * cfg.config.floorPerFloorFee;
    lines.push({ label: "Surcharge Lantai (tanpa lift)", price: floorSurcharge, type: "floor" });
  }

  // 3. Heavy items
  const selectedItems = cfg.heavyItems.filter(i => input.heavyItemSlugs.includes(i.slug));
  for (const item of selectedItems) {
    const label = [item.emoji, item.label].filter(Boolean).join(" ");
    lines.push({ label, price: item.price, type: "item" });
  }

  // 4. Custom items
  const customCount = input.customHeavyItems.filter(s => s.trim().length > 0).length;
  if (customCount > 0) {
    const customTotal = customCount * cfg.config.customItemFee;
    lines.push({
      label: `Barang Lain (${customCount} item)`,
      price: customTotal,
      type:  "item",
    });
  }

  // 5. Weekend multiplier applied to subtotal
  const subtotal = lines.reduce((s, l) => s + l.price, 0);
  if (input.isWeekend) {
    const weekendSurcharge = Math.round(subtotal * (cfg.config.weekendMultiplier - 1));
    if (weekendSurcharge > 0) {
      lines.push({ label: "Akhir Pekan", price: weekendSurcharge, type: "weekend" });
    }
  }

  const total = lines.reduce((s, l) => s + l.price, 0);

  return { vehicleType: size.vehicleType, helperCount: size.helperCount, lines, total };
}
