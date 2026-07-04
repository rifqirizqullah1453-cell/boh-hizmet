import type { ActiveOrderDoc } from "@boh/contracts";
import "./OrderCard.css";

const SERVICE_META: Record<ActiveOrderDoc["serviceType"], { label: string; icon: string; bg: string }> = {
  delivery: { label: "Kurir", icon: "📦", bg: "linear-gradient(150deg, #dbeafe, #eff6ff)" },
  shopping: { label: "Belanja", icon: "🛒", bg: "linear-gradient(150deg, #dcfce7, #f0fdf4)" },
  cleaning: { label: "Kebersihan", icon: "🧹", bg: "linear-gradient(150deg, #fef3c7, #fffbeb)" },
  moving: { label: "Angkut Barang", icon: "🚛", bg: "linear-gradient(150deg, #f3e8ff, #fdf4ff)" },
};

interface OrderCardProps {
  order: ActiveOrderDoc;
  onAccept: (orderId: string) => void;
  isAccepting: boolean;
}

export function OrderCard({ order, onAccept, isAccepting }: OrderCardProps) {
  const meta = SERVICE_META[order.serviceType];

  return (
    <article className="order-card">
      <div className="order-card__image-area" style={{ background: meta.bg }}>
        <span className="order-card__service-badge">{meta.label}</span>
        <span className="order-card__icon">{meta.icon}</span>
        <span className="order-card__price-badge">₺{order.price.toLocaleString("tr-TR")}</span>
      </div>

      <div className="order-card__content">
        <p className="order-card__customer">{order.customerName}</p>
        <p className="order-card__address">📍 {order.pickupAddress}</p>

        <button
          type="button"
          className="order-card__accept"
          disabled={isAccepting}
          onClick={() => onAccept(order.orderId)}
        >
          {isAccepting ? "Menerima…" : "Terima Order"}
        </button>
      </div>
    </article>
  );
}
