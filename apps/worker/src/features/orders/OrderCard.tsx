import { motion } from "framer-motion";
import { MapPin, Hand, Clock } from "lucide-react";
import type { ActiveOrderDoc } from "@boh/contracts";

const SERVICE_META: Record<ActiveOrderDoc["serviceType"], { label: string; icon: string }> = {
  delivery: { label: "Kurir", icon: "📦" },
  shopping: { label: "Belanja", icon: "🛒" },
  cleaning: { label: "Kebersihan", icon: "🧹" },
  moving: { label: "Angkut Barang", icon: "🚛" },
};

function timeAgo(ms: number) {
  const diff = Date.now() - ms;
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "baru saja";
  if (min < 60) return `${min} mnt lalu`;
  const hr = Math.floor(min / 60);
  return `${hr} jam lalu`;
}

interface OrderCardProps {
  order: ActiveOrderDoc;
  onAccept: (orderId: string) => void;
  isAccepting: boolean;
}

export function OrderCard({ order, onAccept, isAccepting }: OrderCardProps) {
  const meta = SERVICE_META[order.serviceType] ?? { label: order.serviceType, icon: "📋" };

  return (
    <motion.article
      className="p-5 rounded-3xl card-bg border border-dark overflow-hidden"
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      style={{ borderLeft: "3px solid var(--cyan)", boxShadow: "var(--shadow-sm)" }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{meta.icon}</span>
          <span className="text-sm font-bold" style={{ color: "var(--text)" }}>
            {meta.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {order.createdAt != null && (
            <div className="flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
              <Clock className="w-3 h-3" />
              <span className="text-[11px] font-semibold">{timeAgo(order.createdAt)}</span>
            </div>
          )}
          <span className="text-base font-black" style={{ color: "var(--cyan)" }}>
            ₺{order.price.toLocaleString("tr-TR")}
          </span>
        </div>
      </div>

      {/* Pickup */}
      <div className="flex items-start gap-2 text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--cyan)" }} />
        <span className="line-clamp-2">{order.pickupAddress}</span>
      </div>

      {/* Destination (if available) */}
      {order.destinationAddress && (
        <div className="flex items-start gap-2 text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#8B5CF6" }} />
          <span className="line-clamp-1">{order.destinationAddress}</span>
        </div>
      )}

      {/* Notes */}
      {order.notes && (
        <p className="text-xs mb-3 font-medium" style={{ color: "var(--text-muted)" }}>
          📝 {order.notes}
        </p>
      )}

      {/* Customer badge */}
      <div className="flex items-center gap-2 mb-4">
        <span
          className="text-[11px] px-3 py-1 rounded-lg font-bold"
          style={{ background: "rgba(43,197,212,0.1)", color: "var(--cyan)" }}
        >
          👤 {order.customerName}
        </span>
      </div>

      <motion.button
        onClick={() => onAccept(order.orderId)}
        disabled={isAccepting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3.5 btn-cyan flex items-center justify-center gap-2 rounded-2xl"
      >
        {isAccepting ? (
          <motion.div
            className="w-4 h-4 border-[2.5px] border-white/40 rounded-full border-t-white"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <>
            <Hand className="w-4 h-4" />
            Terima Order
          </>
        )}
      </motion.button>
    </motion.article>
  );
}
