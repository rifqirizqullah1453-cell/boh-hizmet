import { activeOrderDoc, type ActiveOrderDoc } from "@boh/contracts";
import { getFirestoreClient } from "./client";

const COLLECTION = "active_orders";

// "Best-effort" only means anything if it's also bounded. A Firestore SDK
// call that's unreachable (wrong host, network partition, emulator down)
// doesn't necessarily fail fast — gRPC's default retry/backoff can leave an
// awaited call pending far longer than any request should block on a
// side-channel. Every exported function in this file races against this so
// a Firestore outage degrades to "no real-time update", not "the mutation
// hangs and the worker's tap on Accept never resolves."
const FIRESTORE_CALL_TIMEOUT_MS = 3000;

async function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error(`Firestore call timed out after ${FIRESTORE_CALL_TIMEOUT_MS}ms: ${label}`)),
      FIRESTORE_CALL_TIMEOUT_MS
    );
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timeoutId!);
  }
}

/**
 * Broadcasts a freshly created PENDING order so nearby Worker Apps' onSnapshot
 * listeners pick it up. Called only after the SQL insert has committed —
 * SQL stays the source of truth, this is a best-effort mirror for real-time UX.
 */
export async function broadcastNewOrder(doc: ActiveOrderDoc): Promise<void> {
  const parsed = activeOrderDoc.parse(doc);
  await withTimeout(
    getFirestoreClient().collection(COLLECTION).doc(parsed.orderId).set(parsed),
    `broadcastNewOrder(${parsed.orderId})`
  );
}

/**
 * Mirrors a status/worker change (e.g. ACCEPTED, IN_PROGRESS) so all
 * listening clients update without polling.
 */
export async function syncOrderState(
  orderId: string,
  patch: Partial<ActiveOrderDoc>
): Promise<void> {
  await withTimeout(
    getFirestoreClient().collection(COLLECTION).doc(orderId).set(patch, { merge: true }),
    `syncOrderState(${orderId})`
  );
}

/**
 * Removes the live document once an order reaches a terminal state
 * (COMPLETED/CANCELLED). Keeps the `active_orders` collection small —
 * history lives in SQL, not Firestore, so there's nothing to "lose" here.
 */
export async function retireActiveOrder(orderId: string): Promise<void> {
  await withTimeout(
    getFirestoreClient().collection(COLLECTION).doc(orderId).delete(),
    `retireActiveOrder(${orderId})`
  );
}
