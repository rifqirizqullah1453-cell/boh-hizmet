import { trpc } from "@boh/api";
import { motion } from "framer-motion";
import { TrendingUp, CheckCircle2, Clock, XCircle, Users, HardHat } from "lucide-react";

// ── Helpers ─────────────────────────────────────────────────────────────────

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Selamat Pagi";
  if (h < 15) return "Selamat Siang";
  if (h < 18) return "Selamat Sore";
  return "Selamat Malam";
}

// ── Donut Chart ─────────────────────────────────────────────────────────────

interface DonutSegment { label: string; value: number; color: string }

function DonutChart({
  segments,
  size = 132,
  thickness = 22,
  children,
}: {
  segments: DonutSegment[];
  size?: number;
  thickness?: number;
  children?: React.ReactNode;
}) {
  const total = segments.reduce((s, d) => s + d.value, 0);
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const C = 2 * Math.PI * r;
  let cumStart = 0;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--surface-container)" strokeWidth={thickness} />
        {total > 0 && segments.map((seg, i) => {
          if (seg.value === 0) return null;
          const len = (seg.value / total) * C;
          const offset = -cumStart;
          cumStart += len;
          return (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color}
              strokeWidth={thickness} strokeDasharray={`${len} ${C}`} strokeDashoffset={offset} />
          );
        })}
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Horizontal Bar ───────────────────────────────────────────────────────────

function HBar({ data, unit = "" }: { data: { label: string; value: number; color?: string }[]; unit?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  if (data.length === 0) return (
    <p className="text-xs text-center py-4" style={{ color: "var(--on-surface-variant)" }}>Belum ada data</p>
  );
  return (
    <div className="space-y-2.5">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold truncate" style={{ color: "var(--on-surface-variant)", maxWidth: "60%" }}>
              {d.label}
            </span>
            <span className="text-xs font-bold shrink-0 ml-2" style={{ color: d.color ?? "var(--primary)" }}>
              {d.value.toLocaleString("tr-TR")}{unit}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--surface-container)" }}>
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(d.value / max) * 100}%` }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: "easeOut" }}
              style={{ background: d.color ?? "var(--primary)" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Constants ────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  PENDING:     "#d97706",
  ACCEPTED:    "#2563eb",
  IN_PROGRESS: "#7c3aed",
  COMPLETED:   "#059669",
  CANCELLED:   "#dc2626",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING:     "Menunggu",
  ACCEPTED:    "Diterima",
  IN_PROGRESS: "Dikerjakan",
  COMPLETED:   "Selesai",
  CANCELLED:   "Dibatalkan",
};

const SERVICE_COLORS: Record<string, string> = {
  delivery: "#38d1da",
  shopping: "#7c3aed",
  cleaning: "#059669",
  moving:   "#d97706",
};

const SERVICE_LABEL: Record<string, string> = {
  delivery: "Kurir",
  shopping: "Belanja",
  cleaning: "Kebersihan",
  moving:   "Pindahan",
};

const WORKER_COLORS = ["#38d1da", "#7c3aed", "#059669", "#d97706", "#2563eb"];

// ── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, Icon, accent, delay }: {
  label: string; value: number;
  Icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accent: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, ease: "easeOut" }}
      className="glass-card rounded-2xl p-4 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accent}18` }}>
          <Icon className="w-5 h-5" style={{ color: accent }} />
        </div>
        <span className="text-2xl font-extrabold" style={{ color: "var(--on-surface)" }}>
          {value.toLocaleString()}
        </span>
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--on-surface-variant)" }}>
        {label}
      </p>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function DashboardPage() {
  const { data: ordersData }  = trpc.admin.listOrders.useQuery({ limit: 100 });
  const { data: usersData }   = trpc.admin.listUsers.useQuery({ limit: 100 });
  const { data: workersData } = trpc.admin.listUsers.useQuery({ limit: 50, role: "worker" });

  const orders       = ordersData?.items ?? [];
  const totalUsers   = usersData?.items.length ?? 0;
  const workers      = workersData?.items ?? [];
  const totalWorkers = workers.length;

  // ── Derived stats ────────────────────────────────────────────────────────
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

  // ── Per-worker computed from orders ──────────────────────────────────────
  const workerMap = new Map<number, { name: string; orderCount: number; distKm: number }>();
  for (const w of workers) {
    workerMap.set(w.id, { name: w.name ?? `Worker #${w.id}`, orderCount: 0, distKm: 0 });
  }
  for (const o of orders) {
    if (o.workerId == null) continue;
    const entry = workerMap.get(o.workerId);
    if (!entry) continue;
    entry.orderCount++;
    if (o.status === "COMPLETED") {
      entry.distKm += haversineKm(
        Number(o.pickupLat), Number(o.pickupLng),
        Number(o.destinationLat), Number(o.destinationLng),
      );
    }
  }

  const workerList   = Array.from(workerMap.values()).filter((w) => w.orderCount > 0);
  const topByOrders  = [...workerList].sort((a, b) => b.orderCount - a.orderCount).slice(0, 5)
    .map((w, i) => ({ label: w.name, value: w.orderCount, color: WORKER_COLORS[i] }));
  const topByDist    = [...workerList].sort((a, b) => b.distKm - a.distKm).slice(0, 5)
    .map((w, i) => ({ label: w.name, value: Math.round(w.distKm * 10) / 10, color: WORKER_COLORS[i] }));

  // ── Chart data ────────────────────────────────────────────────────────────
  const statusSegments: DonutSegment[] = Object.entries(STATUS_COLORS).map(([s, c]) => ({
    label: STATUS_LABEL[s], value: byStatus[s] ?? 0, color: c,
  }));
  const serviceSegments: DonutSegment[] = Object.entries(SERVICE_COLORS).map(([s, c]) => ({
    label: SERVICE_LABEL[s], value: byService[s] ?? 0, color: c,
  }));

  const stats = [
    { label: "Total Pesanan",  value: orders.length,           Icon: TrendingUp,   accent: "var(--primary)" },
    { label: "Selesai",        value: byStatus.COMPLETED ?? 0,  Icon: CheckCircle2, accent: "#059669" },
    { label: "Menunggu",       value: byStatus.PENDING ?? 0,    Icon: Clock,        accent: "#d97706" },
    { label: "Dibatalkan",     value: byStatus.CANCELLED ?? 0,  Icon: XCircle,      accent: "#dc2626" },
    { label: "Total Pengguna", value: totalUsers,                Icon: Users,        accent: "#7c3aed" },
    { label: "Pekerja",        value: totalWorkers,              Icon: HardHat,      accent: "#2563eb" },
  ];

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="px-4 md:px-8 py-5 md:py-7 max-w-7xl mx-auto space-y-5">

      {/* Greeting — all sizes */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-xl md:text-2xl font-extrabold" style={{ color: "var(--on-surface)" }}>
          {getGreeting()}, Admin 👋
        </h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--on-surface-variant)" }}>
          Berikut ringkasan operasional BÖH Hizmet hari ini.
        </p>
      </motion.div>

      {/* Revenue hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="premium-gradient rounded-3xl p-6 text-white overflow-hidden relative"
        style={{ boxShadow: "0 8px 32px rgba(56,209,218,0.28)" }}
      >
        <p className="text-xs font-semibold opacity-70 uppercase tracking-wide mb-1">
          Total Pendapatan (Order Selesai)
        </p>
        <p className="text-3xl md:text-4xl font-extrabold tracking-tight">
          ₺{totalRevenue.toLocaleString("tr-TR")}
        </p>
        <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full opacity-20 bg-white" />
        <div className="absolute right-10 bottom-10 w-20 h-20 rounded-full opacity-10 bg-white" />
      </motion.div>

      {/* Stats bento grid — 2 cols mobile, 3 cols desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {stats.map((s, i) => (
          <StatCard key={s.label} {...s} delay={0.1 + i * 0.04} />
        ))}
      </div>

      {/* Donut charts — 2 cols */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
        className="grid grid-cols-2 gap-3"
      >
        {/* Status donut */}
        <div className="glass-card rounded-2xl p-4 flex flex-col items-center gap-3">
          <p className="text-xs font-bold self-start" style={{ color: "var(--on-surface)" }}>Status Order</p>
          <DonutChart segments={statusSegments} size={120} thickness={20}>
            <p className="text-lg font-extrabold" style={{ color: "var(--on-surface)" }}>{orders.length}</p>
            <p className="text-[9px] font-semibold" style={{ color: "var(--on-surface-variant)" }}>total</p>
          </DonutChart>
          <div className="w-full space-y-1">
            {statusSegments.filter((s) => s.value > 0).map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="text-[10px] font-semibold" style={{ color: "var(--on-surface-variant)" }}>{s.label}</span>
                </div>
                <span className="text-[10px] font-bold" style={{ color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Service donut */}
        <div className="glass-card rounded-2xl p-4 flex flex-col items-center gap-3">
          <p className="text-xs font-bold self-start" style={{ color: "var(--on-surface)" }}>Tipe Layanan</p>
          <DonutChart segments={serviceSegments} size={120} thickness={20}>
            <p className="text-lg font-extrabold" style={{ color: "var(--on-surface)" }}>
              {Object.values(byService).reduce((a, b) => a + b, 0)}
            </p>
            <p className="text-[9px] font-semibold" style={{ color: "var(--on-surface-variant)" }}>order</p>
          </DonutChart>
          <div className="w-full space-y-1">
            {serviceSegments.filter((s) => s.value > 0).map((s) => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                  <span className="text-[10px] font-semibold" style={{ color: "var(--on-surface-variant)" }}>{s.label}</span>
                </div>
                <span className="text-[10px] font-bold" style={{ color: s.color }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Worker charts — stacked mobile, side by side desktop */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.48 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="glass-card rounded-2xl p-5">
          <p className="text-sm font-bold mb-4" style={{ color: "var(--on-surface)" }}>Pesanan per Pekerja</p>
          <HBar data={topByOrders} unit=" order" />
        </div>
        <div className="glass-card rounded-2xl p-5">
          <p className="text-sm font-bold mb-1" style={{ color: "var(--on-surface)" }}>Jarak Tempuh per Pekerja</p>
          <p className="text-xs mb-4" style={{ color: "var(--on-surface-variant)" }}>
            Hanya order selesai · estimasi garis lurus
          </p>
          <HBar data={topByDist} unit=" km" />
        </div>
      </motion.div>

    </div>
  );
}
