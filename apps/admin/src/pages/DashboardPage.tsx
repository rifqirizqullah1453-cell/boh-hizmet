import { trpc } from "@boh/api";
import { ShoppingBag, Users, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  PENDING:     "#F59E0B",
  ACCEPTED:    "#3B82F6",
  IN_PROGRESS: "#8B5CF6",
  COMPLETED:   "#10B981",
  CANCELLED:   "#EF4444",
};

const statusLabel: Record<string, string> = {
  PENDING:     "Pending",
  ACCEPTED:    "Diterima",
  IN_PROGRESS: "Dikerjakan",
  COMPLETED:   "Selesai",
  CANCELLED:   "Dibatalkan",
};

export function DashboardPage() {
  const { data: ordersData }  = trpc.admin.listOrders.useQuery({ limit: 100 });
  const { data: usersData }   = trpc.admin.listUsers.useQuery({ limit: 100 });
  const { data: workersData } = trpc.admin.listUsers.useQuery({ limit: 100, role: "worker" });

  const orders      = ordersData?.items ?? [];
  const totalUsers   = usersData?.items.length ?? 0;
  const totalWorkers = workersData?.items.length ?? 0;

  const byStatus = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  const totalRevenue = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + (o.price ?? 0), 0);

  const stats = [
    { label: "Total Orders",  value: orders.length,             icon: <ShoppingBag className="w-5 h-5" />, color: "#3B82F6" },
    { label: "Selesai",       value: byStatus.COMPLETED ?? 0,   icon: <CheckCircle className="w-5 h-5" />, color: "#10B981" },
    { label: "Pending",       value: byStatus.PENDING ?? 0,     icon: <Clock className="w-5 h-5" />,       color: "#F59E0B" },
    { label: "Dibatalkan",    value: byStatus.CANCELLED ?? 0,   icon: <XCircle className="w-5 h-5" />,     color: "#EF4444" },
    { label: "Total Users",   value: totalUsers,                 icon: <Users className="w-5 h-5" />,       color: "#8B5CF6" },
    { label: "Workers",       value: totalWorkers,               icon: <TrendingUp className="w-5 h-5" />,  color: "#2BC5D4" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Ringkasan data BÖH Hizmet</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl p-5"
            style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>{s.label}</span>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18`, color: s.color }}>
                {s.icon}
              </div>
            </div>
            <p className="text-3xl font-black" style={{ color: "var(--text)" }}>{s.value.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl p-6 gradient-cyan text-white"
        style={{ boxShadow: "0 8px 32px rgba(43,197,212,0.3)" }}
      >
        <p className="text-sm font-semibold opacity-75">Total Revenue (order selesai)</p>
        <p className="text-4xl font-black mt-2">₺{totalRevenue.toLocaleString("tr-TR")}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 rounded-2xl p-6"
        style={{ background: "var(--bg-card)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)" }}
      >
        <h2 className="text-sm font-bold mb-4" style={{ color: "var(--text)" }}>Breakdown Status Order</h2>
        <div className="space-y-3">
          {Object.entries(statusColors).map(([status, color]) => {
            const count = byStatus[status] ?? 0;
            const pct = orders.length > 0 ? (count / orders.length) * 100 : 0;
            return (
              <div key={status}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>{statusLabel[status]}</span>
                  <span className="text-xs font-bold" style={{ color }}>{count}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: "var(--border)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
