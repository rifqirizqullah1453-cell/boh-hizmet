import { eq, and, isNotNull } from "drizzle-orm";
import { users, type Database, type User } from "@boh/db";

export async function setOnlineStatus(db: Database, workerId: number, isOnline: boolean): Promise<void> {
  await db.update(users).set({ isOnline, updatedAt: new Date() }).where(eq(users.id, workerId));
}

export async function findUserById(db: Database, userId: number): Promise<User | undefined> {
  return db.query.users.findFirst({ where: eq(users.id, userId) });
}

export async function getOnlineWorkerFcmTokens(db: Database): Promise<string[]> {
  const rows = await db
    .select({ fcmToken: users.fcmToken })
    .from(users)
    .where(and(eq(users.role, "worker"), eq(users.isOnline, true), isNotNull(users.fcmToken)));
  return rows.map((r) => r.fcmToken!);
}

export async function getUserFcmToken(db: Database, userId: number): Promise<string | null> {
  const row = await db
    .select({ fcmToken: users.fcmToken })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return row[0]?.fcmToken ?? null;
}
