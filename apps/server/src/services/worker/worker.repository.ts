import { eq } from "drizzle-orm";
import { users, type Database, type User } from "@boh/db";

export async function setOnlineStatus(db: Database, workerId: number, isOnline: boolean): Promise<void> {
  await db.update(users).set({ isOnline, updatedAt: new Date() }).where(eq(users.id, workerId));
}

export async function findUserById(db: Database, userId: number): Promise<User | undefined> {
  return db.query.users.findFirst({ where: eq(users.id, userId) });
}
