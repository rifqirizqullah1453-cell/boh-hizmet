import { TRPCError } from "@trpc/server";
import type { CreateOrderInput, EstimatePriceInput } from "@boh/contracts";
import type { Database, User, OrderStatus } from "@boh/db";
import {
  insertOrder,
  acceptOrderAtomic,
  findOrderById,
  findActiveOrdersForWorker,
  progressOrderAtomic,
  adminForceUpdateOrder,
  assertOrderAccess,
} from "./order.repository";
import { calculateDistanceKm, estimatePrice } from "../pricing/pricing.service";

// Which current status a transition is valid from, and who's allowed to
// trigger it. Anything not listed here (e.g. PENDING -> COMPLETED,
// PENDING -> IN_PROGRESS) is simply not reachable through this path —
// admin.router.ts's force-* procedures are the only way to bypass it.
const TRANSITIONS: Record<
  "IN_PROGRESS" | "COMPLETED" | "CANCELLED",
  { from: OrderStatus[]; allow: (order: { customerId: number; workerId: number | null }, caller: User) => boolean }
> = {
  IN_PROGRESS: {
    from: ["ACCEPTED"],
    allow: (order, caller) => order.workerId === caller.id,
  },
  COMPLETED: {
    from: ["IN_PROGRESS"],
    allow: (order, caller) => order.workerId === caller.id,
  },
  CANCELLED: {
    // Once a worker is en route (IN_PROGRESS) cancellation still goes
    // through this path, not just admin override — the worker may not show,
    // and a customer that's already on the phone with them needs an exit
    // that doesn't require an admin to be online.
    from: ["PENDING", "ACCEPTED", "IN_PROGRESS"],
    allow: (order, caller) => order.customerId === caller.id || order.workerId === caller.id,
  },
};
import {
  broadcastNewOrder,
  syncOrderState,
  retireActiveOrder,
} from "../firestore/activeOrders.service";

export function estimateOrderPrice(input: EstimatePriceInput) {
  const distanceKm = calculateDistanceKm(
    input.pickupLat,
    input.pickupLng,
    input.destinationLat,
    input.destinationLng
  );
  return estimatePrice(input.serviceType, distanceKm, input.stopCount ?? 0);
}

export async function createOrder(db: Database, customer: User, input: CreateOrderInput) {
  // Price is never taken from the client — it's recomputed here from the
  // same coordinates that get stored, so a tampered request can't place a
  // ₺1 "moving" order.
  const price = estimateOrderPrice(input);

  const orderId = await insertOrder(db, {
    id: "", // overwritten by insertOrder
    customerId: customer.id,
    serviceType: input.serviceType,
    pickupAddress: input.pickupAddress,
    pickupLat: String(input.pickupLat),
    pickupLng: String(input.pickupLng),
    destinationAddress: input.destinationAddress,
    destinationLat: String(input.destinationLat),
    destinationLng: String(input.destinationLng),
    notes: input.notes ?? null,
    price,
    status: "PENDING",
  });

  // SQL insert already committed at this point — Firestore is best-effort.
  // If this throws, the order still exists and is safely creatable to retry
  // a broadcast for (e.g. a reconciliation job), it's just invisible to
  // real-time listeners until that happens.
  try {
    await broadcastNewOrder({
      orderId,
      status: "PENDING",
      serviceType: input.serviceType,
      pickupAddress: input.pickupAddress,
      pickupLat: input.pickupLat,
      pickupLng: input.pickupLng,
      price,
      customerName: customer.name ?? "Customer",
      workerId: null,
      createdAt: Date.now(),
      notes: input.notes ?? null,
    });
  } catch (err) {
    console.error(`[order.service] Failed to broadcast order ${orderId} to Firestore`, err);
  }

  return orderId;
}

export async function acceptOrder(db: Database, worker: User, orderId: string) {
  // Guard: a worker can only hold one active job at a time. This check runs
  // before the atomic UPDATE so it isn't fully race-proof against two
  // simultaneous tabs, but in practice that scenario is so unlikely at
  // staging scale that the extra SQL round-trip of a true NOT EXISTS subquery
  // isn't warranted yet. Document clearly if it needs hardening for prod.
  const activeOrders = await findActiveOrdersForWorker(db, worker.id);
  if (activeOrders.length > 0) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Selesaikan pesanan aktif Anda sebelum menerima yang baru.",
    });
  }

  const updated = await acceptOrderAtomic(db, orderId, worker.id);

  if (!updated) {
    // Either the order never existed, or another worker already won the
    // race — both are CONFLICT from the caller's point of view, since the
    // order is simply no longer acceptable.
    throw new TRPCError({
      code: "CONFLICT",
      message: "This order has already been accepted by another worker.",
    });
  }

  try {
    await syncOrderState(orderId, { status: "ACCEPTED", workerId: String(worker.id) });
  } catch (err) {
    console.error(`[order.service] Failed to sync ACCEPTED state for ${orderId} to Firestore`, err);
  }

  return updated;
}

export async function progressOrder(
  db: Database,
  caller: User,
  orderId: string,
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED",
  extra?: { cancelReason?: string }
) {
  const order = await findOrderById(db, orderId);
  assertOrderAccess(order, caller);

  const transition = TRANSITIONS[status];
  if (!transition.allow(order, caller)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `You're not allowed to mark this order as ${status}.`,
    });
  }

  const applied = await progressOrderAtomic(db, orderId, transition.from, status, {
    cancelReason: status === "CANCELLED" ? extra?.cancelReason ?? null : null,
    cancelledBy: status === "CANCELLED" ? (order.customerId === caller.id ? "customer" : "worker") : null,
  });

  if (!applied) {
    // Someone else moved the order between our read above and this write
    // (e.g. the worker just completed it while the customer was tapping
    // Cancel) — the order's current status no longer matches what this
    // transition requires.
    throw new TRPCError({
      code: "CONFLICT",
      message: "Order status changed before this update could be applied. Refresh and try again.",
    });
  }

  try {
    if (status === "COMPLETED" || status === "CANCELLED") {
      // Terminal state — drop the live doc. History stays in SQL only.
      await retireActiveOrder(orderId);
    } else {
      await syncOrderState(orderId, { status });
    }
  } catch (err) {
    console.error(`[order.service] Failed to sync ${status} state for ${orderId} to Firestore`, err);
  }
}

export async function adminForceReassign(db: Database, orderId: string, newWorkerId: number) {
  await adminForceUpdateOrder(db, orderId, {
    workerId: newWorkerId,
    status: "ACCEPTED",
    acceptedAt: new Date(),
  });
  try {
    await syncOrderState(orderId, { status: "ACCEPTED", workerId: String(newWorkerId) });
  } catch (err) {
    console.error(`[order.service] Failed to sync admin reassign for ${orderId} to Firestore`, err);
  }
}

export async function adminForceCancel(db: Database, orderId: string, reason: string) {
  await adminForceUpdateOrder(db, orderId, {
    status: "CANCELLED",
    cancelReason: reason,
    cancelledBy: "admin",
  });
  try {
    await retireActiveOrder(orderId);
  } catch (err) {
    console.error(`[order.service] Failed to retire admin-cancelled order ${orderId} from Firestore`, err);
  }
}
