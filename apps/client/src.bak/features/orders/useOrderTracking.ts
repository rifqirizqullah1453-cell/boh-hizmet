import { useEffect, useRef, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import type { ActiveOrderDoc } from "@boh/contracts";
import { trpc } from "@boh/api";
import { firestore } from "../../lib/firestoreClient";

export interface TrackedOrder {
  orderId: string;
  status: "PENDING" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  workerId: string | null;
  pickupAddress: string;
  price: number;
}

/**
 * Firestore drives live PENDING -> ACCEPTED -> IN_PROGRESS updates with no
 * polling. But once an order reaches a terminal state, order.service.ts
 * deletes the active_orders mirror doc entirely (deliberate cost/perf
 * decision — history lives in SQL only). That means Firestore can tell us
 * the order is *gone*, but not whether it ended COMPLETED or CANCELLED —
 * so the moment the doc disappears, this hook falls back to one tRPC call
 * to order.byId (the real source of truth) to resolve the final status.
 */
export function useOrderTracking(orderId: string | null) {
  const [liveOrder, setLiveOrder] = useState<TrackedOrder | null>(null);
  const [isTerminal, setIsTerminal] = useState(false);
  const hasSeenDocRef = useRef(false);

  const byIdQuery = trpc.order.byId.useQuery(
    { orderId: orderId ?? "" },
    { enabled: !!orderId }
  );

  useEffect(() => {
    if (!orderId) return;
    hasSeenDocRef.current = false;
    setIsTerminal(false);
    setLiveOrder(null);

    const unsubscribe = onSnapshot(
      doc(firestore, "active_orders", orderId),
      (snapshot) => {
        if (snapshot.exists()) {
          hasSeenDocRef.current = true;
          const data = snapshot.data() as ActiveOrderDoc;
          setLiveOrder({
            orderId: data.orderId,
            status: data.status,
            workerId: data.workerId,
            pickupAddress: data.pickupAddress,
            price: data.price,
          });
        } else if (hasSeenDocRef.current) {
          // Doc just got deleted mid-subscription -> the order just hit a
          // terminal state. Firestore can't say which one; ask SQL.
          setIsTerminal(true);
          byIdQuery.refetch();
        }
        // If it doesn't exist AND we've never seen it, that's most likely
        // just "broadcastNewOrder hasn't landed yet" (or already timed out
        // — see activeOrders.service.ts's 3s guard) — the initial byId
        // fetch below covers that gap until a snapshot does arrive.
      },
      (error) => {
        console.error("[useOrderTracking] Firestore subscription failed", error);
      }
    );

    return () => unsubscribe();
    // byIdQuery is intentionally excluded — refetch() is stable per the
    // query key and re-subscribing on every query state change would tear
    // down/reattach the Firestore listener far more than needed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const sqlOrder: TrackedOrder | null = byIdQuery.data
    ? {
        orderId: byIdQuery.data.id,
        status: byIdQuery.data.status,
        workerId: byIdQuery.data.workerId !== null ? String(byIdQuery.data.workerId) : null,
        pickupAddress: byIdQuery.data.pickupAddress,
        price: byIdQuery.data.price,
      }
    : null;

  // Terminal state resolved by SQL wins outright (it's the only source
  // that can distinguish COMPLETED from CANCELLED); otherwise prefer the
  // live Firestore value, falling back to the initial SQL read.
  const order = isTerminal ? sqlOrder : (liveOrder ?? sqlOrder);

  return {
    order,
    isLoading: !order && byIdQuery.isLoading,
    // Exposed so actions this hook doesn't know about (cancel, rating) can
    // force an immediate re-read instead of waiting on the Firestore round
    // trip — the snapshot listener will also catch up, this just removes
    // the visible lag for the action the user just took themselves.
    refetchFromSql: byIdQuery.refetch,
  };
}
