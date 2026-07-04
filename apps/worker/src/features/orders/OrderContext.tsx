import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import type { ActiveOrderDoc } from "@boh/contracts";
import { useActiveOrdersListener } from "./useActiveOrdersListener";
import { useAudioUnlock } from "../notifications/useAudioUnlock";
import { playNewOrderAlert } from "../notifications/audioPlayer";

interface OrderContextValue {
  pendingOrders: ActiveOrderDoc[];
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

  const onNewOrder = useCallback((order: ActiveOrderDoc) => {
    void playNewOrderAlert();
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([150, 75, 150]);
    }
    // Browser notification — visible even when the tab is in the background
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification("🛵 Pesanan Baru!", {
        body: `${order.serviceType.charAt(0).toUpperCase() + order.serviceType.slice(1)} · ${order.pickupAddress}`,
        tag: order.orderId,   // prevents duplicate if snapshot fires twice
      });
    }
    console.info(`[OrderProvider] New order broadcast: ${order.orderId}`);
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if (typeof Notification === "undefined") return;
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }, []);

  const { pendingOrders } = useActiveOrdersListener(onNewOrder);

  const value = useMemo<OrderContextValue>(
    () => ({ pendingOrders, isAudioUnlocked: unlocked, unlockAudio: unlock, requestNotificationPermission }),
    [pendingOrders, unlocked, unlock, requestNotificationPermission]
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}
