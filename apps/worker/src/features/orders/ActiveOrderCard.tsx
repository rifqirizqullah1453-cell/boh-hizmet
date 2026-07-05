import { useState } from "react";
import "./ActiveOrderCard.css";

const SERVICE_META: Record<string, { label: string; icon: string }> = {
  delivery: { label: "Kurir", icon: "📦" },
  shopping: { label: "Belanja", icon: "🛒" },
  cleaning: { label: "Kebersihan", icon: "🧹" },
  moving: { label: "Angkut Barang", icon: "🚛" },
};

// Local interface — compatible with the tRPC-inferred join result from
// order.myActive (Order + customerName + customerPhone from users JOIN).
interface ActiveOrderItem {
  id: string;
  serviceType: string;
  status: string;
  pickupAddress: string;
  destinationAddress: string;
  price: number;
  notes?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
}

interface ActiveOrderCardProps {
  order: ActiveOrderItem;
  onUpdateStatus: (orderId: string, status: "IN_PROGRESS" | "COMPLETED") => void;
  isUpdating: boolean;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => { /* silently fail */ });
}

function StepIndicator({ status }: { status: string }) {
  const steps = ["Diterima", "Dikerjakan", "Selesai"];
  const activeIndex = status === "ACCEPTED" ? 0 : status === "IN_PROGRESS" ? 1 : 2;

  return (
    <div className="active-order-card__steps">
      {steps.map((label, i) => (
        <div key={label} className="active-order-card__step-item">
          <div
            className={[
              "active-order-card__step-dot",
              i <= activeIndex ? "is-done" : "",
              i === activeIndex ? "is-current" : "",
            ].join(" ")}
          />
          <span className={`active-order-card__step-label${i === activeIndex ? " is-current" : ""}`}>
            {label}
          </span>
          {i < steps.length - 1 && (
            <div className={`active-order-card__step-line${i < activeIndex ? " is-done" : ""}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export function ActiveOrderCard({ order, onUpdateStatus, isUpdating }: ActiveOrderCardProps) {
  const [confirmingDone, setConfirmingDone] = useState(false);
  const [copiedField, setCopiedField] = useState<"pickup" | "dest" | null>(null);

  const meta = SERVICE_META[order.serviceType] ?? { label: order.serviceType, icon: "📋" };
  const isAccepted = order.status === "ACCEPTED";

  const handleCopy = (field: "pickup" | "dest", text: string) => {
    copyToClipboard(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleDoneClick = () => {
    if (!confirmingDone) {
      setConfirmingDone(true);
      return;
    }
    setConfirmingDone(false);
    onUpdateStatus(order.id, "COMPLETED");
  };

  return (
    <article className="active-order-card">
      {/* Step indicator */}
      <StepIndicator status={order.status} />

      {/* Service header */}
      <div className="active-order-card__header">
        <div className="active-order-card__service-info">
          <span className="active-order-card__service-icon">{meta.icon}</span>
          <div>
            <p className="active-order-card__service-label">{meta.label}</p>
            <p className="active-order-card__id">#{order.id.split("-").slice(-2).join("-").toUpperCase()}</p>
          </div>
        </div>
        <p className="active-order-card__price">₺{order.price.toLocaleString("tr-TR")}</p>
      </div>

      {/* Customer info + phone */}
      {(order.customerName || order.customerPhone) && (
        <div className="active-order-card__customer">
          <span className="active-order-card__customer-icon">👤</span>
          <div className="active-order-card__customer-body">
            {order.customerName && (
              <p className="active-order-card__customer-name">{order.customerName}</p>
            )}
            {order.customerPhone && (
              <a
                href={`tel:${order.customerPhone}`}
                className="active-order-card__phone"
              >
                📞 {order.customerPhone}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Addresses */}
      <div className="active-order-card__addresses">
        <div className="active-order-card__addr-row">
          <span className="active-order-card__addr-dot active-order-card__addr-dot--pickup">●</span>
          <p className="active-order-card__addr-text">{order.pickupAddress}</p>
          <button
            type="button"
            className="active-order-card__copy-btn"
            onClick={() => handleCopy("pickup", order.pickupAddress)}
            title="Salin alamat pickup"
          >
            {copiedField === "pickup" ? "✓" : "⎘"}
          </button>
        </div>
        <div className="active-order-card__addr-connector" />
        <div className="active-order-card__addr-row">
          <span className="active-order-card__addr-dot active-order-card__addr-dot--dest">■</span>
          <p className="active-order-card__addr-text">{order.destinationAddress}</p>
          <button
            type="button"
            className="active-order-card__copy-btn"
            onClick={() => handleCopy("dest", order.destinationAddress)}
            title="Salin alamat tujuan"
          >
            {copiedField === "dest" ? "✓" : "⎘"}
          </button>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="active-order-card__notes">
          <span className="active-order-card__notes-icon">📝</span>
          <p className="active-order-card__notes-text">{order.notes}</p>
        </div>
      )}

      {/* Action */}
      {isAccepted ? (
        <button
          type="button"
          className="active-order-card__btn active-order-card__btn--start"
          disabled={isUpdating}
          onClick={() => onUpdateStatus(order.id, "IN_PROGRESS")}
        >
          {isUpdating ? "Memulai…" : "▶ Mulai Pengerjaan"}
        </button>
      ) : confirmingDone ? (
        <div className="active-order-card__confirm">
          <p className="active-order-card__confirm-text">Yakin order sudah selesai?</p>
          <div className="active-order-card__confirm-btns">
            <button
              type="button"
              className="active-order-card__confirm-cancel"
              onClick={() => setConfirmingDone(false)}
            >
              Batal
            </button>
            <button
              type="button"
              className="active-order-card__confirm-ok"
              disabled={isUpdating}
              onClick={handleDoneClick}
            >
              {isUpdating ? "Menyelesaikan…" : "Ya, Selesai"}
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="active-order-card__btn active-order-card__btn--done"
          disabled={isUpdating}
          onClick={handleDoneClick}
        >
          ✓ Selesai
        </button>
      )}
    </article>
  );
}
