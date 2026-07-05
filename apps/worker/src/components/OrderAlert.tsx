import { motion, AnimatePresence } from "framer-motion";
import { Bell, MapPin, X } from "lucide-react";
import { useOrders } from "../features/orders/OrderContext";

const SERVICE_META: Record<string, { label: string; icon: string }> = {
  delivery: { label: "Kurir", icon: "📦" },
  shopping: { label: "Belanja", icon: "🛒" },
  cleaning: { label: "Kebersihan", icon: "🧹" },
  moving: { label: "Angkut Barang", icon: "🚛" },
};

export function OrderAlert() {
  const { alertOrder, clearAlert } = useOrders();

  return (
    <AnimatePresence>
      {alertOrder && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={clearAlert}
          />

          {/* Alert card */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[101] max-w-lg mx-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          >
            <div
              className="rounded-t-[32px] overflow-hidden"
              style={{ background: "var(--bg-card)" }}
            >
              {/* Cyan top stripe */}
              <div className="h-1.5 gradient-cyan" />

              {/* Header */}
              <div className="px-6 pt-5 pb-4 gradient-hero relative">
                <motion.div
                  className="absolute w-[300px] h-[300px] rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
                    top: "-50%",
                    right: "-10%",
                  }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                <div className="relative flex items-center gap-3">
                  <motion.div
                    className="w-12 h-12 rounded-2xl glass flex items-center justify-center"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    <Bell className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest">
                      Pesanan Baru!
                    </p>
                    <h2 className="text-xl font-black text-white tracking-tight">
                      {SERVICE_META[alertOrder.serviceType]?.icon}{" "}
                      {SERVICE_META[alertOrder.serviceType]?.label ?? alertOrder.serviceType}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={clearAlert}
                    className="ml-auto w-8 h-8 rounded-full glass flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-3">
                <div
                  className="flex items-start gap-3 p-3.5 rounded-2xl"
                  style={{ background: "var(--bg)" }}
                >
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--cyan)" }} />
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "var(--text-muted)" }}>
                      Pickup
                    </p>
                    <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                      {alertOrder.pickupAddress}
                    </p>
                  </div>
                </div>

                {alertOrder.destinationAddress && (
                  <div
                    className="flex items-start gap-3 p-3.5 rounded-2xl"
                    style={{ background: "var(--bg)" }}
                  >
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "#8B5CF6" }} />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "var(--text-muted)" }}>
                        Tujuan
                      </p>
                      <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                        {alertOrder.destinationAddress}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div
                    className="flex-1 p-3 rounded-2xl text-center"
                    style={{ background: "rgba(43,197,212,0.08)" }}
                  >
                    <p className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>Harga</p>
                    <p className="text-lg font-black" style={{ color: "var(--cyan)" }}>
                      ₺{alertOrder.price.toLocaleString("tr-TR")}
                    </p>
                  </div>
                  <div
                    className="flex-1 p-3 rounded-2xl text-center"
                    style={{ background: "rgba(43,197,212,0.08)" }}
                  >
                    <p className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>Customer</p>
                    <p className="text-sm font-black" style={{ color: "var(--text)" }}>
                      {alertOrder.customerName}
                    </p>
                  </div>
                </div>

                {alertOrder.notes && (
                  <div
                    className="p-3 rounded-2xl text-sm"
                    style={{ background: "rgba(245,158,11,0.08)", color: "#92400E" }}
                  >
                    📝 {alertOrder.notes}
                  </div>
                )}

                <motion.button
                  type="button"
                  onClick={clearAlert}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 btn-cyan rounded-2xl text-sm font-bold"
                >
                  Lihat Order di Dashboard
                </motion.button>

                <button
                  type="button"
                  onClick={clearAlert}
                  className="w-full py-3 text-sm font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
