import { mysqlTable, varchar, text, bigint, mysqlEnum, decimal, int, timestamp } from "drizzle-orm/mysql-core";
import { users } from "./users";

export const orderStatusEnum = ["PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;
export type OrderStatus = (typeof orderStatusEnum)[number];

export const serviceTypeEnum = ["delivery", "shopping", "cleaning", "moving"] as const;

export const orders = mysqlTable("orders", {
  id: varchar("id", { length: 36 }).primaryKey(),
  customerId: bigint("customerId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id),
  workerId: bigint("workerId", { mode: "number", unsigned: true }).references(() => users.id),
  serviceType: mysqlEnum("serviceType", serviceTypeEnum).notNull(),
  status: mysqlEnum("status", orderStatusEnum).default("PENDING").notNull(),

  pickupAddress: text("pickupAddress").notNull(),
  pickupLat: decimal("pickupLat", { precision: 10, scale: 7 }).notNull(),
  pickupLng: decimal("pickupLng", { precision: 10, scale: 7 }).notNull(),
  destinationAddress: text("destinationAddress").notNull(),
  destinationLat: decimal("destinationLat", { precision: 10, scale: 7 }).notNull(),
  destinationLng: decimal("destinationLng", { precision: 10, scale: 7 }).notNull(),

  price: int("price").notNull(),
  notes: text("notes"),

  cancelReason: text("cancelReason"),
  cancelledBy: varchar("cancelledBy", { length: 20 }),

  acceptedAt: timestamp("acceptedAt"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;
