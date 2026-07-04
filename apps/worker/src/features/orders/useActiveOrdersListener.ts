import { useEffect, useRef, useState } from "react";
import { collection, onSnapshot, query, where, type Unsubscribe } from "firebase/firestore";
import type { ActiveOrderDoc } from "@boh/contracts";
import { firestore } from "../../lib/firestoreClient";

const COLLECTION = "active_orders";

/**
 * Subscribes to `active_orders` and keeps a live list of PENDING jobs this
 * worker can accept. Fires `onNewOrder` exactly once per order id the first
 * time it's observed — that's the hook the audio/notification trigger in
 * OrderContext attaches to, so a re-render from an unrelated field change
 * doesn't re-trigger the alert sound.
 */
export function useActiveOrdersListener(onNewOrder: (order: ActiveOrderDoc) => void) {
  const [pendingOrders, setPendingOrders] = useState<ActiveOrderDoc[]>([]);
  const seenIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const q = query(collection(firestore, COLLECTION), where("status", "==", "PENDING"));

    const unsubscribe: Unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const orders = snapshot.docs.map((d) => d.data() as ActiveOrderDoc);
        setPendingOrders(orders);

        for (const change of snapshot.docChanges()) {
          if (change.type === "added") {
            const order = change.doc.data() as ActiveOrderDoc;
            if (!seenIds.current.has(order.orderId)) {
              seenIds.current.add(order.orderId);
              onNewOrder(order);
            }
          }
          if (change.type === "removed") {
            seenIds.current.delete(change.doc.id);
          }
        }
      },
      (error) => {
        console.error("[useActiveOrdersListener] Firestore subscription failed", error);
      }
    );

    return () => unsubscribe();
  }, [onNewOrder]);

  return { pendingOrders };
}
