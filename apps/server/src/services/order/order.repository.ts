import { TRPCError } from "@trpc/server";
import { eq, and, inArray } from "drizzle-orm";
import { orders, type Order, type InsertOrder, type User, type OrderStatus } from "@boh/db";
import type { Database } from "@boh/db";

const ACTIVE_STATUSES: OrderStatus[] = ["ACCEPTED", "IN_PROGRESS"];

export async function insertOrder(db: Database, data: InsertOrder): Promise<string> {
  const orderId = `ORD-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  await db.insert(orders).values({ ...data, id: orderId });
  return orderId;
}

export async function findOrderById(db: Database, orderId: string): Promise<Order | undefined> {
  return db.query.orders.findFirst({ where: eq(orders.id, orderId) });
}

/**
 * Order history for the Client App's "Pesanan" tab and the Worker App's
 * future job log — customers see orders they placed, workers see orders
 * they were assigned, newest first. Cursor is a plain offset (not a keyset
 * on id, since order ids aren't guaranteed lexically monotonic across
 * differing digit lengths) — fine at this scale, revisit if the table grows
 * past a size where offset pagination starts costing real scan time.
 */
export async function listOrdersForUser(
  db: Database,
  user: User,
  opts: { limit: number; cursor?: string; status?: OrderStatus }
): Promise<{ items: Order[]; nextCursor?: string }> {
  const offset = opts.cursor ? Number(opts.cursor) : 0;
  const ownerClause =
    user.role === "worker" ? eq(orders.workerId, user.id) : eq(orders.customerId, user.id);
  const where = opts.status ? and(ownerClause, eq(orders.status, opts.status)) : ownerClause;

  const rows = await db.query.orders.findMany({
    where,
    orderBy: (table, { desc }) => [desc(table.createdAt)],
    limit: opts.limit + 1,
    offset,
  });

  const hasMore = rows.length > opts.limit;
  const items = hasMore ? rows.slice(0, opts.limit) : rows;
  return { items, nextCursor: hasMore ? String(offset + opts.limit) : undefined };
}

/**
 * Returns the worker's current ACCEPTED or IN_PROGRESS orders.
 * Called both for the Worker App's "active job" view and as part of the
 * concurrent-order guard in acceptOrder.
 */
export async function findActiveOrdersForWorker(db: Database, workerId: number): Promise<Order[]> {
  return db.query.orders.findMany({
    where: and(eq(orders.workerId, workerId), inArray(orders.status, ACTIVE_STATUSES)),
    orderBy: (t, { desc }) => [desc(t.updatedAt)],
  });
}

/**
 * Customer who placed it, worker assigned to it, or admin — anyone else
 * gets NOT_FOUND rather than FORBIDDEN, so this can't be used to fingerprint
 * which order ids exist. Shared by order.router.ts (byId) and
 * order.service.ts (progressOrder) so the rule can't drift between the two
 * call sites.
 */
export function assertOrderAccess(order: Order | undefined, user: User): asserts order is Order {
  const isParticipant = order && (order.customerId === user.id || order.workerId === user.id);
  if (!order || !(isParticipant || user.role === "admin")) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Order not found." });
  }
}

/**
 * Atomically transitions an order from PENDING -> ACCEPTED for a given worker.
 *
 * The atomicity does NOT come from wrapping this in `db.transaction()` — a
 * transaction only isolates statements within one connection, it doesn't by
 * itself prevent two concurrent requests from both reading PENDING before
 * either commits. The real guarantee here is the single conditional UPDATE:
 * MySQL only ever applies a row-level UPDATE...WHERE to one winner when two
 * connections race on the same row, so `status = 'PENDING'` in the WHERE
 * clause is the actual race-condition guard, not the transaction wrapper.
 *
 * Returns the updated Order on success, or null if another worker already
 * won the race (status was no longer PENDING when this ran).
 */
export async function acceptOrderAtomic(
  db: Database,
  orderId: string,
  workerId: number
): Promise<Order | null> {
  const result = await db
    .update(orders)
    .set({ workerId, status: "ACCEPTED", acceptedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(orders.id, orderId), eq(orders.status, "PENDING")));

  const affectedRows = (result as unknown as [{ affectedRows: number }])[0]?.affectedRows ?? 0;
  if (affectedRows === 0) {
    return null; // Lost the race, or order doesn't exist.
  }

  return (await findOrderById(db, orderId)) ?? null;
}

/**
 * Conditional UPDATE guarded by the order's *current* status, same pattern
 * as acceptOrderAtomic above (the WHERE clause is the race-condition guard,
 * not a transaction wrapper). This is what makes the state machine actually
 * enforceable server-side: without `status IN fromStatuses` in the WHERE,
 * nothing stops a stale or malicious request from jumping straight from
 * PENDING to COMPLETED.
 *
 * Returns true if the transition applied, false if the order's current
 * status no longer matched `fromStatuses` (either a stale client retried
 * after someone else already moved it, or the transition was never valid).
 */
export async function progressOrderAtomic(
  db: Database,
  orderId: string,
  fromStatuses: OrderStatus[],
  toStatus: "IN_PROGRESS" | "COMPLETED" | "CANCELLED",
  extra: Partial<InsertOrder> = {}
): Promise<boolean> {
  const result = await db
    .update(orders)
    .set({
      status: toStatus,
      ...(toStatus === "COMPLETED" ? { completedAt: new Date() } : {}),
      ...extra,
      updatedAt: new Date(),
    })
    .where(and(eq(orders.id, orderId), inArray(orders.status, fromStatuses)));

  const affectedRows = (result as unknown as [{ affectedRows: number }])[0]?.affectedRows ?? 0;
  return affectedRows > 0;
}

/**
 * Admin-only override: force-reassign or force-cancel regardless of current
 * status. No status precondition in the WHERE clause — the precondition
 * here is the adminProcedure role check upstream, not row state.
 */
export async function adminForceUpdateOrder(
  db: Database,
  orderId: string,
  data: Partial<InsertOrder>
): Promise<void> {
  await db
    .update(orders)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(orders.id, orderId));
}
