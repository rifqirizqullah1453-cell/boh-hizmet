import { useState } from "react";
import { useOrders } from "../features/orders/OrderContext";
import { OrderCard } from "../features/orders/OrderCard";
import { trpc, TRPCClientError } from "@boh/api";
import "./WorkerDashboard.css";

const CATEGORIES: Array<{ id: "all" | "delivery" | "shopping" | "cleaning" | "moving"; label: string }> = [
  { id: "all", label: "Semua" },
  { id: "delivery", label: "Kurir" },
  { id: "shopping", label: "Belanja" },
  { id: "cleaning", label: "Kebersihan" },
  { id: "moving", label: "Angkut" },
];

export function WorkerDashboard() {
  const { pendingOrders, isAudioUnlocked, unlockAudio, requestNotificationPermission } = useOrders();
  const [isOnline, setIsOnline] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ kind: "error" | "info"; text: string } | null>(null);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]["id"]>("all");

  const acceptOrder = trpc.order.accept.useMutation();
  const setOnline = trpc.worker.setOnline.useMutation();

  // "Go Online" is the natural user gesture this dashboard already needs —
  // piggybacking the audio unlock on it means the worker never has to take
  // an extra, unexplained tap just to "enable sound".
  const handleToggleOnline = () => {
    unlockAudio();
    void requestNotificationPermission();
    const next = !isOnline;
    setIsOnline(next);
    setOnline.mutate({ isOnline: next }, { onError: () => setIsOnline(!next) });
  };

  const handleAccept = async (orderId: string) => {
    setAcceptingId(orderId);
    setFeedback(null);
    try {
      await acceptOrder.mutateAsync({ orderId });
      setFeedback({ kind: "info", text: "Order diterima! Cek daftar order aktif Anda." });
    } catch (err) {
      // CONFLICT means the conditional UPDATE in order.repository.ts found
      // the row already flipped to ACCEPTED — another worker won the race.
      // That's expected, correct behavior, not a bug, so it gets its own
      // message instead of the generic failure copy.
      if (err instanceof TRPCClientError && err.data?.code === "CONFLICT") {
        setFeedback({ kind: "error", text: "Terlambat! Order ini sudah diambil pekerja lain." });
      } else {
        setFeedback({ kind: "error", text: "Gagal menerima order. Coba lagi." });
      }
    } finally {
      setAcceptingId(null);
    }
  };

  const visibleOrders =
    category === "all" ? pendingOrders : pendingOrders.filter((o) => o.serviceType === category);

  return (
    <div className="worker-dashboard">
      <header className="worker-dashboard__header">
        <div className="worker-dashboard__identity">
          <div className="worker-dashboard__avatar">W</div>
          <div>
            <p className="worker-dashboard__eyebrow">BÖH Hizmet</p>
            <h1 className="worker-dashboard__title">Order Tersedia</h1>
          </div>
        </div>
        <button
          type="button"
          className={`worker-dashboard__online-toggle ${isOnline ? "is-online" : ""}`}
          onClick={handleToggleOnline}
        >
          <span className="worker-dashboard__online-dot" />
          {isOnline ? "Online" : "Offline"}
        </button>
      </header>

      {feedback && (
        <p className={`worker-dashboard__feedback worker-dashboard__feedback--${feedback.kind}`}>
          {feedback.text}
        </p>
      )}

      {!isAudioUnlocked && (
        <p className="worker-dashboard__audio-hint">
          🔔 Notifikasi suara belum aktif — tekan tombol Online di atas untuk mengaktifkannya.
        </p>
      )}

      <div className="worker-dashboard__categories">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`worker-dashboard__chip ${category === c.id ? "is-active" : ""}`}
            onClick={() => setCategory(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {!isOnline ? (
        <div className="worker-dashboard__empty">
          <p className="worker-dashboard__empty-icon">📴</p>
          <p>Anda sedang offline. Aktifkan status Online untuk mulai menerima order.</p>
          {pendingOrders.length > 0 && (
            <p className="worker-dashboard__pending-hint">
              🔔 Ada <strong>{pendingOrders.length}</strong> pesanan menunggu sekarang!
            </p>
          )}
        </div>
      ) : visibleOrders.length === 0 ? (
        <div className="worker-dashboard__empty">
          <p className="worker-dashboard__empty-icon">⏳</p>
          <p>Belum ada order masuk. Menunggu pesanan baru…</p>
        </div>
      ) : (
        <div className="worker-dashboard__grid">
          {visibleOrders.map((order) => (
            <OrderCard
              key={order.orderId}
              order={order}
              onAccept={handleAccept}
              isAccepting={acceptingId === order.orderId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
