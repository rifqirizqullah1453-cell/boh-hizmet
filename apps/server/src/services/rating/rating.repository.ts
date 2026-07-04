import { eq, sql } from "drizzle-orm";
import { ratings, users, type Database, type InsertRating, type Rating } from "@boh/db";

export async function findRatingByOrderId(db: Database, orderId: string): Promise<Rating | undefined> {
  return db.query.ratings.findFirst({ where: eq(ratings.orderId, orderId) });
}

export async function insertRating(db: Database, data: InsertRating): Promise<void> {
  await db.insert(ratings).values(data);
}

/**
 * Recomputes the worker's running average in place: newAvg = (oldAvg *
 * oldCount + stars) / (oldCount + 1). Done as a single UPDATE expression
 * (not read-then-write in JS) so it stays correct even if two ratings for
 * the same worker land back-to-back — the arithmetic happens row-locked in
 * MySQL, not in app memory.
 */
export async function applyRatingToWorker(db: Database, workerId: number, stars: number): Promise<void> {
  await db
    .update(users)
    .set({
      rating: sql`(${users.rating} * ${users.totalRatings} + ${stars}) / (${users.totalRatings} + 1)`,
      totalRatings: sql`${users.totalRatings} + 1`,
      updatedAt: new Date(),
    })
    .where(eq(users.id, workerId));
}
