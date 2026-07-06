import { trpc } from "@boh/api";
import { motion } from "framer-motion";
import { TrendingUp, CheckCircle2, Clock, XCircle, Users, HardHat } from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING:     "#d97706",
  ACCEPTED:    "#2563eb",
  IN_PROGRESS: "#7c3aed",
  COMPLETED:   "#059669",
  CANCELLED:   "#dc2626",
};

const statusLabel: Record<string, string> = {
  PENDING:     "Menunggu",
  ACCEPTED:    "Diterima",
  IN_PROGRESS: "Dikerjakan",
  COMPLETED:   "Selesai",
  CANCELLED:   "Dibatalkan",
};

const serviceLabel: Record<string, string> = {
  delivery:  "Kurir & Antar",
  shopping:  "Titip Belanja",
  cleaning:  "Kebersihan",
  moving:    "Pindahan",
};

export function DashboardPage() {
  const { data: ordersData }  = trpc.admin.listOrders.useQuery({ limit: 100 });
  const { data: usersData }   = trpc.admin.listUsers.useQuery({ limit: 100 });
  const { data: workersData } = trpc.admin.listUsers.useQuery({ limit: 100, role: "worker" });

  const orders = ordersData?.items ?? [];
  const totalUsers   = usersData?.items.length ?? 0;
  const totalWorkers = workersData?.items.length ?? 0;

  const byStatus = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  const totalRevenue = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + (o.price ?? 0), 0);

  const byService = orders.reduce<Record<string, number>>((acc, o) => {
    if (o.serviceType) acc[o.serviceType] = (acc[o.serviceType] ?? 0) + 1;
    return acc;
  }, {});
  const serviceEntries = Object.entries(byService).sort((a, b) => b[1] - a[1]);

  const recentOrders = orders.slice(0, 5);

  const stats = [
    { label: "Total Pesanan",  value: orders.length,          Icon: TrendingUp,  accent: "var(--primary)" },
    { label: "Selesai",        value: byStatus.COMPLETED ?? 0, Icon: CheckCircle2, accent: "#059669" },
    { label: "Menunggu",       value: byStatus.PENDING ?? 0,   Icon: Clock,        accent: "#d97706" },
    { label: "Dibatalkan",     value: byStatus.CANCELLED ?? 0, Icon: XCircle,      accent: "var(--error)" },
    { label: "Total Pengguna", value: totalUsers,               Icon: Users,        accent: "#7c3aed" },
    { label: "Pekerja",        value: totalWorkers,             Icon: HardHat,      accent: "#2563eb" },
  ];

  return (
    <div className="px-4 py-5 max-w-2xl mx-auto space-y-5">

      {/* Revenue hero card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-cyan rounded-3xl p-6 text-white overflow-hidden relative"
        style={{ boxShadow: "0 8px 32px rgba(56,209,218,0.3)" }}
      >
        <div className="relative z-10">
          <p className="text-xs font-semibold opacity-70 uppercase tracking-wide mb-1">
            Total Pendapatan (Order Selesai)
          </p>
          <p className="text-3xl font-extrabold tracking-tight">
            ₺{totalRevenue.toLocaleString("tr-TR")}
          </p>
        </div>
        {/* decorative circle */}
        <div
          className="absolute -right-10 -bottom-10 w-36 h-36 rounded-full opacity-20"
          style={{ background: "white" }}
        />
        <div
          className="absolute right-8 bottom-8 w-16 h-16 rounded-full opacity-10"
          style={{ background: "white" }}
        />
      </motion.div>

      {/* Stats list */}
      <div className="space-y-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 + i * 0.04 }}
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{
              background: "var(--surface-container-lowest)",
              border: "1px solid var(--outline-variant)",
              borderLeft: `4px solid ${s.accent}`,
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${s.accent}18` }}
            >
              <s.Icon className="w-5 h-5" style={{ color: s.accent }} />
            </div>
            <div className="flex-1">
              <p
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--on-surface-variant)" }}
              >
                {s.label}
              </p>
              <p
                className="text-2xl font-extrabold leading-tight"
                style={{ color: "var(--on-surface)" }}
              >
                {s.value.toLocaleString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Status distribution */}
      {orders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl p-5"
          style={{ background: "var(--surface-container-lowest)", border: "1px solid var(--outline-variant)" }}
        >
          <p className="text-sm font-bold mb-4" style={{ color: "var(--on-surface)" }}>
            Distribusi Status Order
          </p>
          <div className="space-y-3">
            {Object.entries(statusColors).map(([status, color]) => {
              const count = byStatus[status] ?? 0;
              const pct = orders.length > 0 ? (count / orders.length) * 100 : 0;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "var(--on-surface-variant)" }}
                    >
                      {statusLabel[status]}
                    </span>
                    <span className="text-xs font-bold" style={{ color }}>
                      {count}
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "var(--surface-container)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Service distribution */}
      {serviceEntries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-5"
          style={{ background: "var(--surface-container-lowest)", border: "1px solid var(--outline-variant)" }}
        >
          <p className="text-sm font-bold mb-4" style={{ color: "var(--on-surface)" }}>
            Distribusi Tipe Layanan
          </p>
          <div className="space-y-3">
            {serviceEntries.map(([svc, count]) => {
              const pct = orders.length > 0 ? (count / orders.length) * 100 : 0;
              return (
                <div key={svc}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className="text-xs font-semibold capitalize"
                      style={{ color: "var(--on-surface-variant)" }}
                    >
                      {serviceLabel[svc] ?? svc}
                    </span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: "var(--primary)" }}
                    >
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "var(--surface-container)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: "var(--primary)" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Recent orders */}
      {recentOrders.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--surface-container-lowest)", border: "1px solid var(--outline-variant)" }}
        >
          <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--outline-variant)" }}>
            <p className="text-sm font-bold" style={{ color: "var(--on-surface)" }}>
              Order Terbaru
            </p>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--outline-variant)" }}>
            {recentOrders.map((order) => {
              const color = statusColors[order.status] ?? "#6f797a";
              return (
                <div key={order.id} className="flex items-center gap-3 px-5 py-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs"
                    style={{ background: color }}
                  >
                    {(serviceLabel[order.serviceType ?? ""] ?? order.serviceType ?? "?")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold capitalize truncate"
                      style={{ color: "var(--on-surface)" }}
                    >
                      {serviceLabel[order.serviceType ?? ""] ?? order.serviceType}
                    </p>
                    <p
                      className="text-xs truncate"
                      style={{ color: "var(--on-surface-variant)" }}
                    >
                      {order.customerId}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold" style={{ color: "var(--on-surface)" }}>
                      ₺{order.price.toLocaleString("tr-TR")}
                    </p>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${color}18`, color }}
                    >
                      {statusLabel[order.status] ?? order.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
