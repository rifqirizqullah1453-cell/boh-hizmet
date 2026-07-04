import { mysqlTable, varchar, int, tinyint, text } from "drizzle-orm/mysql-core";

export const movingSizes = mysqlTable("moving_sizes", {
  slug:        varchar("slug",        { length: 50  }).primaryKey(),
  label:       varchar("label",       { length: 100 }).notNull(),
  description: text("description"),
  basePrice:   int("basePrice").notNull(),
  vehicleType: varchar("vehicleType", { length: 100 }).notNull(),
  helperCount: int("helperCount").notNull().default(1),
  sortOrder:   int("sortOrder").notNull().default(0),
});

export const movingHeavyItems = mysqlTable("moving_heavy_items", {
  slug:      varchar("slug",  { length: 50  }).primaryKey(),
  label:     varchar("label", { length: 100 }).notNull(),
  emoji:     varchar("emoji", { length: 10  }),
  price:     int("price").notNull(),
  active:    tinyint("active").notNull().default(1),
  sortOrder: int("sortOrder").notNull().default(0),
});

export const movingConfig = mysqlTable("moving_config", {
  key:         varchar("key",         { length: 100 }).primaryKey(),
  value:       varchar("value",       { length: 500 }).notNull(),
  description: varchar("description", { length: 300 }),
});

export const movingOrders = mysqlTable("moving_orders", {
  orderId:          varchar("orderId",          { length: 36 }).primaryKey(),
  sizeSlug:         varchar("sizeSlug",         { length: 50 }).notNull(),
  pickupFloor:      int("pickupFloor").notNull().default(1),
  destFloor:        int("destFloor").notNull().default(1),
  hasLift:          tinyint("hasLift").notNull().default(0),
  heavyItemSlugs:   text("heavyItemSlugs").notNull(),    // JSON string[]
  customHeavyItems: text("customHeavyItems").notNull(),  // JSON string[]
  scheduledAt:      varchar("scheduledAt", { length: 30 }),
  priceBreakdown:   text("priceBreakdown").notNull(),    // JSON
});
