import {
  mysqlTable, varchar, text, int, decimal, boolean, mysqlEnum,
} from "drizzle-orm/mysql-core";

export const cleaningServiceTypes = mysqlTable("cleaning_service_types", {
  slug:               varchar("slug", { length: 50 }).primaryKey(),
  label:              varchar("label", { length: 100 }).notNull(),
  description:        text("description"),
  priceMultiplier:    decimal("priceMultiplier",    { precision: 4, scale: 2 }).notNull().default("1.00"),
  durationMultiplier: decimal("durationMultiplier", { precision: 4, scale: 2 }).notNull().default("1.00"),
  sortOrder:          int("sortOrder").notNull().default(0),
});

export const cleaningPropertyTypes = mysqlTable("cleaning_property_types", {
  slug:      varchar("slug",  { length: 50  }).primaryKey(),
  label:     varchar("label", { length: 100 }).notNull(),
  emoji:     varchar("emoji", { length: 10  }),
  sortOrder: int("sortOrder").notNull().default(0),
});

// Base rate matrix: one row per (property_type × area_range)
export const cleaningBaseRates = mysqlTable("cleaning_base_rates", {
  id:                varchar("id",                { length: 36 }).primaryKey(),
  propertyTypeSlug:  varchar("propertyTypeSlug",  { length: 50 }).notNull(),
  areaMin:           int("areaMin").notNull(),
  areaMax:           int("areaMax"),                              // NULL = unlimited
  basePrice:         int("basePrice").notNull(),                  // TL
  baseDurationHours: decimal("baseDurationHours", { precision: 4, scale: 2 }).notNull(),
  baseWorkers:       int("baseWorkers").notNull().default(1),
});

export const cleaningRoomFees = mysqlTable("cleaning_room_fees", {
  roomType:           mysqlEnum("roomType", ["bedroom", "bathroom"]).primaryKey(),
  pricePerUnit:       int("pricePerUnit").notNull(),
  durationMinPerUnit: int("durationMinPerUnit").notNull(),
});

export const cleaningDirtLevels = mysqlTable("cleaning_dirt_levels", {
  slug:               varchar("slug",  { length: 20 }).primaryKey(),
  label:              varchar("label", { length: 50 }).notNull(),
  priceMultiplier:    decimal("priceMultiplier",    { precision: 4, scale: 2 }).notNull(),
  durationMultiplier: decimal("durationMultiplier", { precision: 4, scale: 2 }).notNull(),
  sortOrder:          int("sortOrder").notNull().default(0),
});

export const cleaningAddons = mysqlTable("cleaning_addons", {
  slug:        varchar("slug",  { length: 50  }).primaryKey(),
  label:       varchar("label", { length: 100 }).notNull(),
  emoji:       varchar("emoji", { length: 10  }),
  price:       int("price").notNull(),
  durationMin: int("durationMin").notNull().default(0),
  active:      boolean("active").notNull().default(true),
  sortOrder:   int("sortOrder").notNull().default(0),
});

// Key-value store for all scalar pricing parameters
export const cleaningConfig = mysqlTable("cleaning_config", {
  key:         varchar("key",         { length: 100 }).primaryKey(),
  value:       varchar("value",       { length: 500 }).notNull(),
  description: varchar("description", { length: 300 }),
});

// Extended cleaning-specific order details (joins to orders.id)
export const cleaningOrders = mysqlTable("cleaning_orders", {
  orderId:          varchar("orderId",          { length: 36 }).primaryKey(),
  propertyTypeSlug: varchar("propertyTypeSlug", { length: 50 }).notNull(),
  serviceTypeSlug:  varchar("serviceTypeSlug",  { length: 50 }).notNull(),
  areaM2:           int("areaM2").notNull(),
  bedroomCount:     int("bedroomCount").notNull().default(0),
  bathroomCount:    int("bathroomCount").notNull().default(0),
  dirtLevelSlug:    varchar("dirtLevelSlug",    { length: 20 }).notNull(),
  bringsEquipment:  boolean("bringsEquipment").notNull().default(false),
  addonSlugs:       text("addonSlugs").notNull().default("[]"),   // JSON string[]
  estimatedHours:   decimal("estimatedHours", { precision: 4, scale: 2 }).notNull(),
  workerCount:      int("workerCount").notNull(),
  priceBreakdown:   text("priceBreakdown").notNull(),             // JSON CleaningBreakdownLine[]
});
