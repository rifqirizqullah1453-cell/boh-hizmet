import { eq, and, desc, type SQL } from "drizzle-orm";
import { orders, users, type Database, type Order, type User } from "@boh/db";

type OrderStatus = Order["status"];
type UserRole = User["role"];

// ── Orders ────────────────────────────────────────────────────────────────────

export async function listAllOrders(
  db: Database,
  opts: {
    limit: number;
    cursor?: string;
    status?: OrderStatus;
    workerId?: number;
    customerId?: number;
  }
): Promise<{ items: Order[]; nextCursor?: string }> {
  const offset = opts.cursor ? Number(opts.cursor) : 0;

  const conditions: SQL[] = [];
  if (opts.status) conditions.push(eq(orders.status, opts.status));
  if (opts.workerId != null) conditions.push(eq(orders.workerId, opts.workerId));
  if (opts.customerId != null) conditions.push(eq(orders.customerId, opts.customerId));

  const where = conditions.length > 0 ? and(...(conditions as [SQL, ...SQL[]])) : undefined;

  const rows = await db.query.orders.findMany({
    where,
    orderBy: (t, { desc }) => [desc(t.createdAt)],
    limit: opts.limit + 1,
    offset,
  });

  const hasMore = rows.length > opts.limit;
  return {
    items: hasMore ? rows.slice(0, opts.limit) : rows,
    nextCursor: hasMore ? String(offset + opts.limit) : undefined,
  };
}

// ── Users ─────────────────────────────────────────────────────────────────────

export async function listAllUsers(
  db: Database,
  opts: { limit: number; cursor?: string; role?: UserRole }
): Promise<{ items: User[]; nextCursor?: string }> {
  const offset = opts.cursor ? Number(opts.cursor) : 0;

  const rows = await db.query.users.findMany({
    where: opts.role ? eq(users.role, opts.role) : undefined,
    orderBy: (t, { desc }) => [desc(t.createdAt)],
    limit: opts.limit + 1,
    offset,
  });

  const hasMore = rows.length > opts.limit;
  return {
    items: hasMore ? rows.slice(0, opts.limit) : rows,
    nextCursor: hasMore ? String(offset + opts.limit) : undefined,
  };
}

export async function updateUserRole(
  db: Database,
  userId: number,
  role: UserRole
): Promise<void> {
  await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, userId));
}

export async function getWorkerStats(
  db: Database,
  workerId: number
): Promise<{
  totalOrders: number;
  completedOrders: number;
  totalEarnings: number;
  activeOrder: Order | null;
  recentOrders: Order[];
}> {
  const allOrders = await db.query.orders.findMany({
    where: eq(orders.workerId, workerId),
    orderBy: [desc(orders.createdAt)],
  });

  const completed = allOrders.filter((o) => o.status === "COMPLETED");
  const totalEarnings = completed.reduce((sum, o) => sum + (o.price ?? 0), 0);
  const activeOrder =
    allOrders.find((o) => o.status === "ACCEPTED" || o.status === "IN_PROGRESS") ?? null;

  return {
    totalOrders: allOrders.length,
    completedOrders: completed.length,
    totalEarnings,
    activeOrder,
    recentOrders: allOrders.slice(0, 15),
  };
}
