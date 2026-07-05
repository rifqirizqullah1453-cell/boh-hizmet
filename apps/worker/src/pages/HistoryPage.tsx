import { useState } from "react";
import { trpc } from "@boh/api";
import "./HistoryPage.css";

type HistoryFilter = "all" | "COMPLETED" | "CANCELLED";

const SERVICE_ICONS: Record<string, string> = {
  delivery: "📦",
  shopping: "🛒",
  cleaning: "🧹",
  moving: "🚛",
};

const SERVICE_LABELS: Record<string, string> = {
  delivery: "Kurir",
  shopping: "Belanja",
  cleaning: "Kebersihan",
  moving: "Angkut Barang",
};

function formatDate(d: string | Date): string {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistoryPage() {
  const [filter, setFilter] = useState<HistoryFilter>("all");

  // Fetch up to 50 terminal-state orders; filter client-side by tab.
  // At Hizmet's scale (3 workers, Bartın) this limit won't be hit daily.
  const { data, isLoading } = trpc.order.listMine.useQuery(
    { limit: 50 },
    { staleTime: 1000 * 60 }
  );

  const terminalItems = (data?.items ?? []).filter(
    (o) => o.status === "COMPLETED" || o.status === "CANCELLED"
  );

  const visibleItems =
    filter === "all"
      ? terminalItems
      : terminalItems.filter((o) => o.status === filter);

  return (
    <div className="history-page">
      <header className="history-page__header">
        <h1 className="history-page__title">Riwayat Order</h1>
      </header>

      <div className="history-page__filters">
        {(
          [
            { id: "all" as const, label: "Semua" },
            { id: "COMPLETED" as const, label: "Selesai" },
            { id: "CANCELLED" as const, label: "Dibatalkan" },
          ] as const
        ).map((f) => (
          <button
            key={f.id}
            type="button"
            className={`history-page__chip ${filter === f.id ? "is-active" : ""}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="history-page__loading">Memuat riwayat…</div>
      )}

      {!isLoading && visibleItems.length === 0 && (
        <div className="history-page__empty">
          <p className="history-page__empty-icon">📋</p>
          <p>Belum ada riwayat order.</p>
        </div>
      )}

      <div className="history-page__list">
        {visibleItems.map((order) => (
          <div key={order.id} className="history-card">
            <div className="history-card__icon-wrap">
              <span className="history-card__icon">
                {SERVICE_ICONS[order.serviceType] ?? "📋"}
              </span>
            </div>
            <div className="history-card__body">
              <div className="history-card__top">
                <p className="history-card__service">
                  {SERVICE_LABELS[order.serviceType] ?? order.serviceType}
                </p>
                <span
                  className={`history-card__badge ${
                    order.status === "COMPLETED"
                      ? "history-card__badge--completed"
                      : "history-card__badge--cancelled"
                  }`}
                >
                  {order.status === "COMPLETED" ? "Selesai" : "Dibatalkan"}
                </span>
              </div>
              <p className="history-card__address">{order.pickupAddress}</p>
              <div className="history-card__bottom">
                <p className="history-card__date">{formatDate(order.createdAt)}</p>
                {order.status === "COMPLETED" && (
                  <p className="history-card__price">
                    ₺{order.price.toLocaleString("tr-TR")}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
