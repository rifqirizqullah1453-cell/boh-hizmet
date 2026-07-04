import { mysqlTable, varchar, text, bigint, tinyint, timestamp, uniqueIndex } from "drizzle-orm/mysql-core";
import { users } from "./users";
import { orders } from "./orders";

export const ratings = mysqlTable(
  "ratings",
  {
    id: bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey(),
    orderId: varchar("orderId", { length: 36 })
      .notNull()
      .references(() => orders.id),
    customerId: bigint("customerId", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    workerId: bigint("workerId", { mode: "number", unsigned: true })
      .notNull()
      .references(() => users.id),
    stars: tinyint("stars").notNull(),
    comment: text("comment"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    // One rating per order — also what makes submitRating's "already rated"
    // check race-safe: a concurrent double-submit collides on this index
    // instead of silently inserting two rows.
    orderUnique: uniqueIndex("ratings_orderId_unique").on(table.orderId),
  })
);

export type Rating = typeof ratings.$inferSelect;
export type InsertRating = typeof ratings.$inferInsert;
