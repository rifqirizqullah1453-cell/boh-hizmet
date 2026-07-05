import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@boh/api";
import { CheckCircle, XCircle, Package } from "lucide-react";

type HistoryFilter = "all" | "COMPLETED" | "CANCELLED";

const SERVICE_META: Record<string, { label: string; icon: string }> = {
  delivery: { label: "Kurir", icon: "📦" },
  shopping: { label: "Belanja", icon: "🛒" },
  cleaning: { label: "Kebersihan", icon: "🧹" },
  moving: { label: "Angkut Barang", icon: "🚛" },
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

const FILTERS: { id: HistoryFilter; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "COMPLETED", label: "Selesai" },
  { id: "CANCELLED", label: "Dibatalkan" },
];

export function HistoryPage() {
  const [filter, setFilter] = useState<HistoryFilter>("all");

  const { data, isLoading } = trpc.order.listMine.useQuery(
    { limit: 50 },
    { staleTime: 1000 * 60 }
  );

  const terminalItems = (data?.items ?? []).filter(
    (o) => o.status === "COMPLETED" || o.status === "CANCELLED"
  );

  const visibleItems =
    filter === "all" ? terminalItems : terminalItems.filter((o) => o.status === filter);

  const totalEarnings = terminalItems
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + o.price, 0);

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-6 rounded-b-[32px] gradient-hero relative overflow-hidden">
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
            top: "-30%",
            right: "-15%",
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <div className="relative z-10">
          <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>
            BÖH Hizmet
          </p>
          <h1 className="text-2xl font-black text-white tracking-tight">Riwayat Order</h1>
          {!isLoading && (
            <motion.div
              className="flex items-center gap-4 mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="p-3 rounded-2xl glass">
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">Total Order</p>
                <p className="text-lg font-black text-white">{terminalItems.filter(o => o.status === "COMPLETED").length}</p>
              </div>
              <div className="p-3 rounded-2xl glass">
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1">Total Pendapatan</p>
                <p className="text-lg font-black text-white">₺{totalEarnings.toLocaleString("tr-TR")}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="px-5 pt-5 max-w-lg mx-auto">
        {/* Filter chips */}
        <div className="flex gap-2 mb-5">
          {FILTERS.map((f) => (
            <motion.button
              key={f.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f.id)}
              className="flex-1 py-2.5 rounded-full text-sm font-bold transition-all"
              style={
                filter === f.id
                  ? { background: "linear-gradient(135deg, #4DD4E0, #2BC5D4)", color: "white", boxShadow: "var(--shadow-cyan)" }
                  : { background: "var(--bg-card)", color: "var(--text-secondary)", border: "1.5px solid var(--border)" }
              }
            >
              {f.label}
            </motion.button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <motion.div
              className="w-8 h-8 border-[3px] rounded-full border-t-transparent"
              style={{ borderColor: "var(--cyan-lighter)", borderTopColor: "var(--cyan)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}

        {/* Empty */}
        {!isLoading && visibleItems.length === 0 && (
          <motion.div
            className="py-16 flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4"
              style={{ background: "rgba(43,197,212,0.08)" }}
            >
              <Package className="w-9 h-9" style={{ color: "var(--cyan-lighter)" }} />
            </div>
            <p className="font-bold" style={{ color: "var(--text)" }}>Belum ada riwayat</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
              Order yang selesai akan muncul di sini
            </p>
          </motion.div>
        )}

        {/* List */}
        <div className="space-y-3">
          <AnimatePresence>
            {visibleItems.map((order, i) => {
              const meta = SERVICE_META[order.serviceType] ?? { label: order.serviceType, icon: "📋" };
              const isCompleted = order.status === "COMPLETED";

              return (
                <motion.div
                  key={order.id}
                  className="p-4 rounded-3xl card-bg border border-dark flex items-start gap-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, type: "spring", stiffness: 300 }}
                  style={{ boxShadow: "var(--shadow-sm)" }}
                >
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{
                      background: isCompleted
                        ? "linear-gradient(135deg, #34D399, #10B981)"
                        : "rgba(239,68,68,0.08)",
                    }}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <XCircle className="w-5 h-5" style={{ color: "#EF4444" }} />
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-sm" style={{ color: "var(--text)" }}>
                        {meta.icon} {meta.label}
                      </p>
                      <span
                        className="text-[10px] font-black px-2.5 py-0.5 rounded-lg"
                        style={{
                          background: isCompleted ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.08)",
                          color: isCompleted ? "#10B981" : "#EF4444",
                        }}
                      >
                        {isCompleted ? "Selesai" : "Dibatalkan"}
                      </span>
                    </div>
                    <p
                      className="text-xs font-medium line-clamp-1 mb-1.5"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {order.pickupAddress}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                        {formatDate(order.createdAt)}
                      </p>
                      {isCompleted && (
                        <p className="text-sm font-black" style={{ color: "#10B981" }}>
                          +₺{order.price.toLocaleString("tr-TR")}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
