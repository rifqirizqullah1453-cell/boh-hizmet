import { mysqlTable, varchar, bigint, mysqlEnum, decimal, int, boolean, timestamp } from "drizzle-orm/mysql-core";

export const userRoleEnum = ["customer", "worker", "admin"] as const;

export const users = mysqlTable("users", {
  id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
  firebaseUid: varchar("firebaseUid", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  role: mysqlEnum("role", userRoleEnum).default("customer").notNull(),
  rating: decimal("rating", { precision: 3, scale: 1 }).default("5.0"),
  totalRatings: int("totalRatings").default(0),
  isOnline: boolean("isOnline").default(false),
  fcmToken: varchar("fcmToken", { length: 512 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
