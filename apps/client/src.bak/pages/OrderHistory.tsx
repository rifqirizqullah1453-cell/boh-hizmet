import { trpc } from "@boh/api";
import "./OrderHistory.css";

const SERVICE_ICON: Record<string, string> = {
  delivery: "📦",
  shopping: "🛒",
  cleaning: "🧹",
  moving: "🚛",
};

const SERVICE_LABEL: Record<string, string> = {
  delivery: "Layanan Kurir",
  shopping: "Jasa Belanja",
  cleaning: "Jasa Kebersihan",
  moving: "Angkut Barang",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Mencari pekerja",
  ACCEPTED: "Diterima",
  IN_PROGRESS: "Diproses",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

interface OrderHistoryProps {
  onSelectOrder: (orderId: string) => void;
}

export function OrderHistory({ onSelectOrder }: OrderHistoryProps) {
  const { data, isLoading, isError } = trpc.order.listMine.useQuery({ limit: 20 });
  const items = data?.items ?? [];

  return (
    <div className="order-history">
      <header className="order-history__header">
        <h1>Pesanan Saya</h1>
      </header>

      {isLoading ? (
        <div className="order-history__empty">
          <p className="order-history__empty-icon">⏳</p>
          <p>Memuat riwayat pesanan...</p>
        </div>
      ) : isError ? (
        <div className="order-history__empty">
          <p className="order-history__empty-icon">⚠️</p>
          <p>Gagal memuat riwayat pesanan.</p>
        </div>
      ) : items.length === 0 ? (
        <div className="order-history__empty">
          <p className="order-history__empty-icon">📋</p>
          <p>Belum ada pesanan. Yuk pesan layanan pertamamu!</p>
        </div>
      ) : (
        <div className="order-history__list">
          {items.map((order) => (
            <article
              key={order.id}
              className="order-history__card"
              onClick={() => onSelectOrder(order.id)}
            >
              <div className="order-history__icon">{SERVICE_ICON[order.serviceType] ?? "📦"}</div>
              <div className="order-history__body">
                <p className="order-history__service">{SERVICE_LABEL[order.serviceType] ?? order.serviceType}</p>
                <p className="order-history__address">📍 {order.pickupAddress}</p>
              </div>
              <div className="order-history__meta">
                <span className={`order-history__status order-history__status--${order.status.toLowerCase()}`}>
                  {STATUS_LABEL[order.status] ?? order.status}
                </span>
                <span className="order-history__price">₺{order.price.toLocaleString("tr-TR")}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
