import { useMemo } from "react";
import { motion } from "framer-motion";
import { trpc } from "@boh/api";
import { Wallet, TrendingUp, CheckCircle } from "lucide-react";

const SERVICE_META: Record<string, { label: string; icon: string; color: string }> = {
  delivery: { label: "Kurir", icon: "📦", color: "#3B82F6" },
  shopping: { label: "Belanja", icon: "🛒", color: "#10B981" },
  cleaning: { label: "Kebersihan", icon: "🧹", color: "#F59E0B" },
  moving: { label: "Angkut Barang", icon: "🚛", color: "#8B5CF6" },
};

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfWeek(d: Date) {
  const day = new Date(d);
  day.setDate(d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1));
  day.setHours(0, 0, 0, 0);
  return day;
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export function EarningsPage() {
  const { data, isLoading } = trpc.order.listMine.useQuery(
    { status: "COMPLETED", limit: 50 },
    { staleTime: 1000 * 60 }
  );

  const items = data?.items ?? [];
  const now = new Date();
  const weekStart = startOfWeek(now);
  const monthStart = startOfMonth(now);

  const todayItems = useMemo(() => items.filter((o) => isSameDay(new Date(o.createdAt), now)), [items]);
  const weekItems = useMemo(() => items.filter((o) => new Date(o.createdAt) >= weekStart), [items]);
  const monthItems = useMemo(() => items.filter((o) => new Date(o.createdAt) >= monthStart), [items]);

  const todayEarnings = todayItems.reduce((s, o) => s + o.price, 0);
  const weekEarnings = weekItems.reduce((s, o) => s + o.price, 0);
  const monthEarnings = monthItems.reduce((s, o) => s + o.price, 0);
  const totalEarnings = items.reduce((s, o) => s + o.price, 0);

  // Group by service type
  const byService = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    for (const o of items) {
      if (!map[o.serviceType]) map[o.serviceType] = { count: 0, total: 0 };
      map[o.serviceType].count++;
      map[o.serviceType].total += o.price;
    }
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, [items]);

  // Group by date (last 14 days)
  const byDate = useMemo(() => {
    const map: Record<string, { items: typeof items; total: number }> = {};
    for (const o of items) {
      const key = new Date(o.createdAt).toDateString();
      if (!map[key]) map[key] = { items: [], total: 0 };
      map[key].items.push(o);
      map[key].total += o.price;
    }
    return Object.entries(map)
      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
      .slice(0, 14);
  }, [items]);

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-8 rounded-b-[36px] gradient-hero relative overflow-hidden">
        <motion.div
          className="absolute w-[350px] h-[350px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)", top: "-35%", right: "-15%" }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <div className="relative z-10">
          <p className="text-[11px] font-bold text-white/55 uppercase tracking-widest mb-1">BÖH Hizmet</p>
          <h1 className="text-2xl font-black text-white tracking-tight">Pendapatan</h1>

          <motion.div className="grid grid-cols-3 gap-2 mt-5" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            {[
              { label: "Hari Ini", value: todayEarnings, count: todayItems.length },
              { label: "Minggu Ini", value: weekEarnings, count: weekItems.length },
              { label: "Bulan Ini", value: monthEarnings, count: monthItems.length },
            ].map((stat) => (
              <div key={stat.label} className="p-3 rounded-2xl glass text-center">
                <p className="text-[9px] font-bold text-white/55 uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-base font-black text-white">₺{stat.value.toLocaleString("tr-TR")}</p>
                <p className="text-[10px] font-medium text-white/60">{stat.count} order</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-5 max-w-lg mx-auto">
        {isLoading && (
          <div className="flex justify-center py-10">
            <motion.div
              className="w-8 h-8 border-[3px] rounded-full"
              style={{ borderColor: "var(--cyan-lighter)", borderTopColor: "var(--cyan)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}

        {/* Total */}
        <motion.div
          className="card-bg border border-dark rounded-3xl p-5"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "rgba(43,197,212,0.1)" }}>
              <Wallet className="w-5 h-5" style={{ color: "var(--cyan)" }} />
            </div>
            <p className="font-bold text-sm" style={{ color: "var(--text-muted)" }}>Total Pendapatan</p>
          </div>
          <p className="text-3xl font-black tracking-tight" style={{ color: "var(--text)" }}>
            ₺{totalEarnings.toLocaleString("tr-TR")}
          </p>
          <p className="text-sm font-medium mt-1" style={{ color: "var(--text-muted)" }}>
            dari {items.length} order selesai
          </p>
        </motion.div>

        {/* Per service type */}
        {byService.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4" style={{ color: "var(--cyan)" }} />
              <h2 className="section-title text-base">Per Layanan</h2>
            </div>
            <div className="space-y-2">
              {byService.map(([type, stat], i) => {
                const meta = SERVICE_META[type] ?? { label: type, icon: "📋", color: "#6B7280" };
                const pct = totalEarnings > 0 ? (stat.total / totalEarnings) * 100 : 0;
                return (
                  <motion.div
                    key={type}
                    className="card-bg border border-dark rounded-2xl p-4"
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    style={{ boxShadow: "var(--shadow-sm)" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{meta.icon}</span>
                        <div>
                          <p className="font-bold text-sm" style={{ color: "var(--text)" }}>{meta.label}</p>
                          <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>{stat.count} order</p>
                        </div>
                      </div>
                      <p className="font-black" style={{ color: meta.color }}>
                        ₺{stat.total.toLocaleString("tr-TR")}
                      </p>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: "var(--border-light)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: meta.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.3 + i * 0.06, duration: 0.6 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Timeline by date */}
        {byDate.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4" style={{ color: "var(--cyan)" }} />
              <h2 className="section-title text-base">Riwayat Harian</h2>
            </div>
            <div className="space-y-2">
              {byDate.map(([dateStr, group], i) => (
                <motion.div
                  key={dateStr}
                  className="card-bg border border-dark rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ boxShadow: "var(--shadow-sm)" }}
                >
                  <div
                    className="px-4 py-3 flex items-center justify-between"
                    style={{ borderBottom: "1px solid var(--border-light)" }}
                  >
                    <p className="font-bold text-sm" style={{ color: "var(--text)" }}>
                      {formatDate(dateStr)}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-black px-2 py-0.5 rounded-lg"
                        style={{ background: "rgba(43,197,212,0.1)", color: "var(--cyan)" }}
                      >
                        {group.items.length} order
                      </span>
                      <p className="font-black text-sm" style={{ color: "#10B981" }}>
                        ₺{group.total.toLocaleString("tr-TR")}
                      </p>
                    </div>
                  </div>
                  {group.items.map((o) => {
                    const meta = SERVICE_META[o.serviceType] ?? { label: o.serviceType, icon: "📋" };
                    return (
                      <div key={o.id} className="px-4 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{meta.icon}</span>
                          <div>
                            <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>{meta.label}</p>
                            <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                              {new Date(o.createdAt).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs font-black" style={{ color: "#10B981" }}>
                          +₺{o.price.toLocaleString("tr-TR")}
                        </p>
                      </div>
                    );
                  })}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="py-16 flex flex-col items-center text-center">
            <p className="text-4xl mb-3">💰</p>
            <p className="font-bold" style={{ color: "var(--text)" }}>Belum ada pendapatan</p>
            <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Selesaikan order untuk mulai mengumpulkan pendapatan</p>
          </div>
        )}
      </div>
    </div>
  );
}
