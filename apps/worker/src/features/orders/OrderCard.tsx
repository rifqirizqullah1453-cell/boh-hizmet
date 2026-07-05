import { motion } from "framer-motion";
import { MapPin, Hand } from "lucide-react";
import type { ActiveOrderDoc } from "@boh/contracts";

const SERVICE_META: Record<ActiveOrderDoc["serviceType"], { label: string; icon: string }> = {
  delivery: { label: "Kurir", icon: "📦" },
  shopping: { label: "Belanja", icon: "🛒" },
  cleaning: { label: "Kebersihan", icon: "🧹" },
  moving: { label: "Angkut Barang", icon: "🚛" },
};

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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{meta.icon}</span>
          <span className="text-sm font-bold" style={{ color: "var(--text)" }}>
            {meta.label}
          </span>
        </div>
        <span className="text-base font-black" style={{ color: "var(--cyan)" }}>
          ₺{order.price.toLocaleString("tr-TR")}
        </span>
      </div>

      <div
        className="flex items-start gap-2 text-sm font-medium mb-3"
        style={{ color: "var(--text-secondary)" }}
      >
        <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--cyan)" }} />
        <span className="line-clamp-2">{order.pickupAddress}</span>
      </div>

      {order.notes && (
        <p className="text-xs mb-3 font-medium" style={{ color: "var(--text-muted)" }}>
          📝 {order.notes}
        </p>
      )}

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
