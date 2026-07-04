import { useState } from "react";
import { trpc, TRPCClientError } from "@boh/api";
import { useOrderTracking } from "../features/orders/useOrderTracking";
import { RatingCard } from "../features/orders/RatingCard";
import "./TrackOrder.css";

const CANCELLABLE_STATUSES = new Set(["PENDING", "ACCEPTED", "IN_PROGRESS"]);

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Mencari pekerja...",
  ACCEPTED: "Pekerja ditemukan",
  IN_PROGRESS: "Sedang dikerjakan",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const STATUS_ICON: Record<string, string> = {
  PENDING: "🔍",
  ACCEPTED: "🤝",
  IN_PROGRESS: "🚴",
  COMPLETED: "✅",
  CANCELLED: "✕",
};

const STATUS_STEPS: Array<{ key: string; label: string }> = [
  { key: "PENDING", label: "Dipesan" },
  { key: "ACCEPTED", label: "Diterima" },
  { key: "IN_PROGRESS", label: "Diproses" },
  { key: "COMPLETED", label: "Selesai" },
];

interface TrackOrderProps {
  orderId: string;
  onBack: () => void;
}

export function TrackOrder({ orderId, onBack }: TrackOrderProps) {
  const { order, isLoading, refetchFromSql } = useOrderTracking(orderId);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState<string | null>(null);
  const updateStatus = trpc.order.updateStatus.useMutation();

  const handleConfirmCancel = async () => {
    setCancelError(null);
    try {
      await updateStatus.mutateAsync({
        orderId,
        status: "CANCELLED",
        cancelReason: cancelReason.trim() || undefined,
      });
      setIsCancelling(false);
      refetchFromSql();
    } catch (err) {
      // CONFLICT here means the order's status moved (e.g. a worker just
      // completed it) between opening this screen and confirming cancel —
      // not a bug, just stale state, so it gets its own message.
      if (err instanceof TRPCClientError && err.data?.code === "CONFLICT") {
        setCancelError("Status pesanan sudah berubah. Memuat ulang...");
        refetchFromSql();
      } else {
        setCancelError("Gagal membatalkan pesanan. Coba lagi.");
      }
    }
  };

  return (
    <div className="track-page">
      <header className="track-page__header">
        <button type="button" className="track-page__back" onClick={onBack} aria-label="Kembali">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="#0F172A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1>Status Pesanan</h1>
        <span className="track-page__header-spacer" />
      </header>

      {isLoading || !order ? (
        <div className="track-page__loading">Memuat status order...</div>
      ) : (
        <>
          <div className={`track-page__status-card track-page__status-card--${order.status.toLowerCase()}`}>
            <div className="track-page__status-icon">
              <span className={order.status === "PENDING" ? "is-pulsing" : ""}>
                {STATUS_ICON[order.status] ?? "📦"}
              </span>
            </div>
            <h2>{STATUS_LABEL[order.status] ?? order.status}</h2>
            <p className="track-page__order-id">#{order.orderId}</p>
          </div>

          {order.status !== "CANCELLED" && (
            <div className="track-page__stepper">
              {STATUS_STEPS.map((step, i) => {
                const currentIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);
                const isDone = currentIndex >= i;
                const isLast = i === STATUS_STEPS.length - 1;
                return (
                  <div key={step.key} className={`track-page__step ${isDone ? "is-done" : ""}`}>
                    <div className="track-page__step-marker">
                      <span className="track-page__step-dot">{isDone && "✓"}</span>
                      {!isLast && <span className="track-page__step-line" />}
                    </div>
                    <p className="track-page__step-label">{step.label}</p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="track-page__details-card">
            <h3>Detail Pesanan</h3>
            <div className="track-page__detail-row">
              <span className="track-page__detail-label">Alamat Jemput</span>
              <span className="track-page__detail-value">{order.pickupAddress}</span>
            </div>
            <div className="track-page__detail-row">
              <span className="track-page__detail-label">Harga</span>
              <span className="track-page__detail-value track-page__detail-value--price">
                ₺{order.price.toLocaleString("tr-TR")}
              </span>
            </div>
            {order.workerId && (
              <div className="track-page__detail-row">
                <span className="track-page__detail-label">Pekerja</span>
                <span className="track-page__detail-value">#{order.workerId}</span>
              </div>
            )}
          </div>

          {order.status === "COMPLETED" && <RatingCard orderId={order.orderId} />}

          {CANCELLABLE_STATUSES.has(order.status) && (
            <div className="track-page__cancel-card">
              {!isCancelling ? (
                <button
                  type="button"
                  className="track-page__cancel-trigger"
                  onClick={() => setIsCancelling(true)}
                >
                  Batalkan Pesanan
                </button>
              ) : (
                <>
                  <p className="track-page__cancel-title">Yakin batalkan pesanan ini?</p>
                  <textarea
                    className="track-page__cancel-reason"
                    placeholder="Alasan pembatalan (opsional)"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    maxLength={300}
                    rows={2}
                  />
                  {cancelError && <p className="track-page__cancel-error">{cancelError}</p>}
                  <div className="track-page__cancel-actions">
                    <button
                      type="button"
                      className="track-page__cancel-back"
                      onClick={() => setIsCancelling(false)}
                      disabled={updateStatus.isPending}
                    >
                      Tutup
                    </button>
                    <button
                      type="button"
                      className="track-page__cancel-confirm"
                      onClick={handleConfirmCancel}
                      disabled={updateStatus.isPending}
                    >
                      {updateStatus.isPending ? "Membatalkan..." : "Ya, Batalkan"}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
