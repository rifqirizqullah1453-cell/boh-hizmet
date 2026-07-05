import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import type { ActiveOrderDoc } from "@boh/contracts";
import { useActiveOrdersListener } from "./useActiveOrdersListener";
import { useAudioUnlock } from "../notifications/useAudioUnlock";
import { playNewOrderAlert } from "../notifications/audioPlayer";

interface OrderContextValue {
  pendingOrders: ActiveOrderDoc[];
  /** The most recent incoming order to show in the full-screen alert overlay. */
  alertOrder: ActiveOrderDoc | null;
  /** Dismiss the full-screen alert. */
  clearAlert: () => void;
  /** False until a user gesture has unlocked the AudioContext — see useAudioUnlock.ts. */
  isAudioUnlocked: boolean;
  /** Call from any existing tap/click target (e.g. the "Go Online" toggle) to unlock audio explicitly. */
  unlockAudio: () => void;
  /** Request browser notification permission. Call from a user gesture. */
  requestNotificationPermission: () => Promise<void>;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrders must be used within OrderProvider");
  return ctx;
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const { unlocked, unlock } = useAudioUnlock();
  const [alertOrder, setAlertOrder] = useState<ActiveOrderDoc | null>(null);
  const shownOrderIds = useRef<Set<string>>(new Set());

  const onNewOrder = useCallback((order: ActiveOrderDoc) => {
    void playNewOrderAlert();
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([150, 75, 150]);
    }
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification("🛵 Pesanan Baru!", {
        body: `${order.serviceType.charAt(0).toUpperCase() + order.serviceType.slice(1)} · ${order.pickupAddress}`,
        tag: order.orderId,
      });
    }
    // Only show the alert overlay once per order ID
    if (!shownOrderIds.current.has(order.orderId)) {
      shownOrderIds.current.add(order.orderId);
      setAlertOrder(order);
    }
    console.info(`[OrderProvider] New order broadcast: ${order.orderId}`);
  }, []);

  const clearAlert = useCallback(() => setAlertOrder(null), []);

  const requestNotificationPermission = useCallback(async () => {
    if (typeof Notification === "undefined") return;
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }, []);

  const { pendingOrders } = useActiveOrdersListener(onNewOrder);

  const value = useMemo<OrderContextValue>(
    () => ({
      pendingOrders,
      alertOrder,
      clearAlert,
      isAudioUnlocked: unlocked,
      unlockAudio: unlock,
      requestNotificationPermission,
    }),
    [pendingOrders, alertOrder, clearAlert, unlocked, unlock, requestNotificationPermission]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}
