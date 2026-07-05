import { useState, useEffect } from "react";
import { useOrders } from "../features/orders/OrderContext";
import { OrderCard } from "../features/orders/OrderCard";
import { ActiveOrderCard } from "../features/orders/ActiveOrderCard";
import { useAuth } from "../features/auth/useAuth";
import { trpc, TRPCClientError } from "@boh/api";
import "./WorkerDashboard.css";

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const CATEGORIES: Array<{ id: "all" | "delivery" | "shopping" | "cleaning" | "moving"; label: string }> = [
  { id: "all", label: "Semua" },
  { id: "delivery", label: "Kurir" },
  { id: "shopping", label: "Belanja" },
  { id: "cleaning", label: "Kebersihan" },
  { id: "moving", label: "Angkut" },
];

export function WorkerDashboard() {
  const { pendingOrders, isAudioUnlocked, unlockAudio, requestNotificationPermission } = useOrders();
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ kind: "error" | "info"; text: string } | null>(null);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]["id"]>("all");

  const acceptOrder = trpc.order.accept.useMutation();
  const updateStatus = trpc.order.updateStatus.useMutation();
  const setOnlineMut = trpc.worker.setOnline.useMutation();

  const { data: workerMe } = trpc.worker.me.useQuery(undefined, {
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const { data: activeOrders = [], refetch: refetchActive } = trpc.order.myActive.useQuery(undefined, {
    refetchInterval: 30_000,
  });

  // Today's earnings — shared cache with ProfilePage so no extra request
  const { data: completedData } = trpc.order.listMine.useQuery(
    { status: "COMPLETED", limit: 50 },
    { staleTime: 1000 * 60 }
  );
  const today = new Date();
  const todayCompleted = (completedData?.items ?? []).filter(
    (o) => isSameDay(new Date(o.createdAt), today)
  );
  const todayEarnings = todayCompleted.reduce((sum, o) => sum + o.price, 0);

  // Restore the server-persisted isOnline state on first load
  useEffect(() => {
    if (workerMe?.isOnline !== undefined) {
      setIsOnline(workerMe.isOnline);
    }
  }, [workerMe?.isOnline]);

  // "Go Online" is the natural user gesture this dashboard already needs —
  // piggybacking the audio unlock on it means the worker never has to take
  // an extra, unexplained tap just to "enable sound".
  const handleToggleOnline = () => {
    unlockAudio();
    void requestNotificationPermission();
    const next = !isOnline;
    setIsOnline(next);
    setOnlineMut.mutate({ isOnline: next }, { onError: () => setIsOnline(!next) });
  };

  const handleAccept = async (orderId: string) => {
    setAcceptingId(orderId);
    setFeedback(null);
    try {
      await acceptOrder.mutateAsync({ orderId });
      void refetchActive();
      setFeedback({ kind: "info", text: "Order diterima! Lihat daftar order aktif di bawah." });
    } catch (err) {
      // CONFLICT means the conditional UPDATE in order.repository.ts found
      // the row already flipped to ACCEPTED — another worker won the race.
      if (err instanceof TRPCClientError && err.data?.code === "CONFLICT") {
        setFeedback({ kind: "error", text: "Terlambat! Order ini sudah diambil pekerja lain." });
      } else {
        setFeedback({ kind: "error", text: "Gagal menerima order. Coba lagi." });
      }
    } finally {
      setAcceptingId(null);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: "IN_PROGRESS" | "COMPLETED") => {
    setUpdatingId(orderId);
    setFeedback(null);
    try {
      await updateStatus.mutateAsync({ orderId, status });
      void refetchActive();
      if (status === "COMPLETED") {
        setFeedback({ kind: "info", text: "Order selesai! Pembayaran akan segera diproses." });
      }
    } catch {
      setFeedback({ kind: "error", text: "Gagal memperbarui status. Coba lagi." });
    } finally {
      setUpdatingId(null);
    }
  };

  const displayName = user?.displayName ?? user?.email?.split("@")[0] ?? "Pekerja";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const rating = workerMe?.rating != null ? Number(workerMe.rating) : null;
  const totalRatings = workerMe?.totalRatings ?? 0;

  const visibleOrders =
    category === "all" ? pendingOrders : pendingOrders.filter((o) => o.serviceType === category);

  return (
    <div className="worker-dashboard">
      <header className="worker-dashboard__header">
        <div className="worker-dashboard__identity">
          <div className="worker-dashboard__avatar">{avatarInitial}</div>
          <div>
            <p className="worker-dashboard__eyebrow">BÖH Hizmet · Pekerja</p>
            <h1 className="worker-dashboard__title">{displayName}</h1>
            {rating != null && (
              <p className="worker-dashboard__rating">
                ⭐ {rating.toFixed(1)} · {totalRatings} ulasan
              </p>
            )}
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

      {/* Daily summary bar */}
      {(todayCompleted.length > 0 || activeOrders.length > 0) && (
        <div className="worker-dashboard__summary">
          <div className="worker-dashboard__summary-stat">
            <p className="worker-dashboard__summary-val">{todayCompleted.length}</p>
            <p className="worker-dashboard__summary-lbl">Selesai Hari Ini</p>
          </div>
          <div className="worker-dashboard__summary-sep" />
          <div className="worker-dashboard__summary-stat">
            <p className="worker-dashboard__summary-val">
              ₺{todayEarnings.toLocaleString("tr-TR")}
            </p>
            <p className="worker-dashboard__summary-lbl">Pendapatan Hari Ini</p>
          </div>
          {activeOrders.length > 0 && (
            <>
              <div className="worker-dashboard__summary-sep" />
              <div className="worker-dashboard__summary-stat">
                <p className="worker-dashboard__summary-val worker-dashboard__summary-val--active">
                  {activeOrders.length}
                </p>
                <p className="worker-dashboard__summary-lbl">Sedang Aktif</p>
              </div>
            </>
          )}
        </div>
      )}

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

      {/* Active orders — always visible, full-width cards */}
      {activeOrders.length > 0 && (
        <>
          <p className="worker-dashboard__section-heading">
            Pesanan Aktif ({activeOrders.length})
          </p>
          <div className="worker-dashboard__active-list">
            {activeOrders.map((order) => (
              <ActiveOrderCard
                key={order.id}
                order={order}
                onUpdateStatus={handleUpdateStatus}
                isUpdating={updatingId === order.id}
              />
            ))}
          </div>
          <div className="worker-dashboard__section-divider" />
        </>
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

      {activeOrders.length > 0 && (
        <p className="worker-dashboard__section-heading">Order Tersedia</p>
      )}

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
