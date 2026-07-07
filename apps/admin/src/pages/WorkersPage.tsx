import { useEffect, useRef, useState } from "react";
import { trpc } from "@boh/api";
import { MapPin, ArrowLeft, RefreshCw, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWorkerLocations } from "../hooks/useWorkerLocations";
import type { User, Order } from "@boh/db";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

const statusLabel: Record<string, string> = {
  PENDING:     "Pending",
  ACCEPTED:    "Diterima",
  IN_PROGRESS: "Dikerjakan",
  COMPLETED:   "Selesai",
  CANCELLED:   "Dibatalkan",
};

const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING:     { bg: "#FEF3C7", text: "#D97706" },
  ACCEPTED:    { bg: "#DBEAFE", text: "#2563EB" },
  IN_PROGRESS: { bg: "#EDE9FE", text: "#7C3AED" },
  COMPLETED:   { bg: "#D1FAE5", text: "#059669" },
  CANCELLED:   { bg: "#FEE2E2", text: "#DC2626" },
};

function workerIcon(online: boolean) {
  const color = online ? "#10B981" : "#9CA3AF";
  return L.divIcon({
    className: "",
    html: `<div style="width:32px;height:32px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);display:flex;align-items:center;justify-content:center;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

function WorkerMap({
  workers,
  locations,
  selectedId,
  onSelectWorker,
}: {
  workers: User[];
  locations: Map<string, { lat: number; lng: number }>;
  selectedId: number | null;
  onSelectWorker: (id: number) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    mapInstanceRef.current = L.map(mapRef.current, { zoomControl: true }).setView([41.18, 32.34], 12);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstanceRef.current);
    return () => { mapInstanceRef.current?.remove(); mapInstanceRef.current = null; };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const workersByUid = new Map(workers.map((w) => [w.firebaseUid, w]));
    const seen = new Set<string>();
    for (const [uid, loc] of locations) {
      seen.add(uid);
      const worker = workersByUid.get(uid);
      const online = worker?.isOnline ?? false;
      const existing = markersRef.current.get(uid);
      if (existing) {
        existing.setLatLng([loc.lat, loc.lng]);
        existing.setIcon(workerIcon(online));
      } else {
        const marker = L.marker([loc.lat, loc.lng], { icon: workerIcon(online) })
          .addTo(map)
          .bindTooltip(worker?.name ?? uid, { permanent: false, direction: "top" });
        if (worker) marker.on("click", () => onSelectWorker(worker.id));
        markersRef.current.set(uid, marker);
      }
    }
    for (const [uid, marker] of markersRef.current) {
      if (!seen.has(uid)) { marker.remove(); markersRef.current.delete(uid); }
    }
  }, [locations, workers, onSelectWorker]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedId) return;
    const worker = workers.find((w) => w.id === selectedId);
    if (!worker) return;
    const loc = locations.get(worker.firebaseUid);
    if (loc) map.flyTo([loc.lat, loc.lng], 15, { duration: 0.8 });
  }, [selectedId, workers, locations]);

  return <div ref={mapRef} style={{ width: "100%", height: "100%" }} />;
}

function WorkerDetail({ worker, onBack }: { worker: User; onBack: () => void }) {
  const { data: stats, isLoading } = trpc.admin.workerStats.useQuery({ workerId: worker.id });

  return (
    <motion.div
      initial={{ x: 32, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 32, opacity: 0 }}
      className="flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-4 flex items-center gap-3" style={{ borderBottom: "1px solid var(--outline-variant)" }}>
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-95"
          style={{ background: "var(--surface-container-low)", border: "1px solid var(--outline-variant)" }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: "var(--on-surface-variant)" }} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-black text-sm truncate" style={{ color: "var(--on-surface)" }}>{worker.name ?? `Worker #${worker.id}`}</p>
          <p className="text-xs" style={{ color: "var(--outline)" }}>{worker.phone ?? "No phone"}</p>
        </div>
        <span
          className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg"
          style={worker.isOnline
            ? { background: "#D1FAE5", color: "#059669" }
            : { background: "var(--surface-container)", color: "var(--on-surface-variant)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: worker.isOnline ? "#10B981" : "#9CA3AF" }} />
          {worker.isOnline ? "Online" : "Offline"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="py-8 flex justify-center">
            <div
              className="w-6 h-6 rounded-full border-[2px]"
              style={{ borderColor: "var(--outline-variant)", borderTopColor: "var(--primary-container)", animation: "spin 1s linear infinite" }}
            />
          </div>
        ) : stats && (
          <>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Total Order", value: stats.totalOrders, icon: <Clock className="w-3.5 h-3.5" />, color: "#3B82F6" },
                { label: "Selesai", value: stats.completedOrders, icon: <CheckCircle className="w-3.5 h-3.5" />, color: "#10B981" },
                { label: "Rating", value: `${Number(worker.rating ?? 5).toFixed(1)}⭐`, icon: <TrendingUp className="w-3.5 h-3.5" />, color: "#F59E0B" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: "var(--surface-container-low)", border: "1px solid var(--outline-variant)" }}>
                  <div className="flex justify-center mb-1.5" style={{ color: s.color }}>{s.icon}</div>
                  <p className="text-lg font-black" style={{ color: "var(--on-surface)" }}>{s.value}</p>
                  <p className="text-xs font-medium" style={{ color: "var(--outline)" }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Earnings */}
            <div className="rounded-xl p-4 premium-gradient text-white">
              <p className="text-xs font-semibold opacity-75">Total Penghasilan</p>
              <p className="text-2xl font-black mt-1">₺{stats.totalEarnings.toLocaleString("tr-TR")}</p>
            </div>

            {/* Active order */}
            {stats.activeOrder && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "var(--outline)" }}>Order Aktif</p>
                <OrderRow order={stats.activeOrder} />
              </div>
            )}

            {/* Recent orders */}
            {stats.recentOrders.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: "var(--outline)" }}>Riwayat Order</p>
                <div className="space-y-2">
                  {stats.recentOrders.map((o) => <OrderRow key={o.id} order={o} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

function OrderRow({ order }: { order: Order }) {
  const sc = statusColors[order.status] ?? { bg: "#F3F4F6", text: "#6B7280" };
  return (
    <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: "var(--surface-container-low)", border: "1px solid var(--outline-variant)" }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-xs font-semibold capitalize truncate" style={{ color: "var(--on-surface)" }}>{order.serviceType}</p>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0" style={{ background: sc.bg, color: sc.text }}>{statusLabel[order.status]}</span>
        </div>
        <p className="text-xs truncate" style={{ color: "var(--outline)" }}>{order.pickupAddress}</p>
      </div>
      <p className="text-xs font-bold shrink-0" style={{ color: "var(--on-surface)" }}>₺{order.price.toLocaleString("tr-TR")}</p>
    </div>
  );
}

export function WorkersPage() {
  const locations = useWorkerLocations();
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null);
  const [cursor, setCursor] = useState<string | undefined>();

  const { data: workersData, refetch } = trpc.admin.listUsers.useQuery({ limit: 50, cursor, role: "worker" });
  const workers = workersData?.items ?? [];
  const selectedWorker = workers.find((w) => w.id === selectedWorkerId) ?? null;
  const onlineCount = workers.filter((w) => w.isOnline).length;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Map */}
      <div className="flex-1 relative">
        <WorkerMap
          workers={workers}
          locations={locations}
          selectedId={selectedWorkerId}
          onSelectWorker={setSelectedWorkerId}
        />
        {/* Map overlay badge */}
        <div
          className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3 py-2 rounded-2xl"
          style={{ background: "var(--surface-container-lowest)", boxShadow: "var(--shadow-md)", border: "1px solid var(--outline-variant)" }}
        >
          <MapPin className="w-4 h-4" style={{ color: "var(--primary)" }} />
          <span className="text-sm font-bold" style={{ color: "var(--on-surface)" }}>
            {locations.size} lokasi aktif
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#d1fae5", color: "#059669" }}>
            {onlineCount} online
          </span>
        </div>
      </div>

      {/* Right panel */}
      <div
        className="w-80 flex flex-col"
        style={{ background: "var(--surface-container-lowest)", borderLeft: "1px solid var(--outline-variant)" }}
      >
        <AnimatePresence mode="wait">
          {selectedWorker ? (
            <WorkerDetail key={selectedWorker.id} worker={selectedWorker} onBack={() => setSelectedWorkerId(null)} />
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full">
              {/* Header */}
              <div className="p-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--outline-variant)" }}>
                <div>
                  <h1 className="font-extrabold text-sm" style={{ color: "var(--on-surface)" }}>Pekerja</h1>
                  <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
                    {workers.length} terdaftar · {onlineCount} online
                  </p>
                </div>
                <button
                  onClick={() => void refetch()}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-95"
                  style={{ background: "var(--surface-container-low)", border: "1px solid var(--outline-variant)" }}
                >
                  <RefreshCw className="w-3.5 h-3.5" style={{ color: "var(--on-surface-variant)" }} />
                </button>
              </div>

              {/* Worker list */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {workers.map((worker) => {
                  const hasLoc = locations.has(worker.firebaseUid);
                  return (
                    <button
                      key={worker.id}
                      onClick={() => setSelectedWorkerId(worker.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all active:scale-[0.98]"
                      style={{ background: "var(--surface-container-low)", border: "1px solid var(--outline-variant)" }}
                    >
                      <div className="w-10 h-10 rounded-full premium-gradient flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-sm">
                          {(worker.name ?? "?")[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate" style={{ color: "var(--on-surface)" }}>
                          {worker.name ?? `Worker #${worker.id}`}
                        </p>
                        <p className="text-xs truncate" style={{ color: "var(--on-surface-variant)" }}>
                          {worker.phone ?? "—"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                          style={
                            worker.isOnline
                              ? { background: "#d1fae5", color: "#059669" }
                              : { background: "var(--surface-container)", color: "var(--on-surface-variant)" }
                          }
                        >
                          {worker.isOnline ? "Online" : "Offline"}
                        </span>
                        {hasLoc && (
                          <span className="text-[10px] font-semibold" style={{ color: "var(--primary)" }}>
                            📍 GPS
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* Pagination */}
                {(workersData?.nextCursor || cursor) && (
                  <div className="flex gap-2 pt-2">
                    {cursor && (
                      <button
                        onClick={() => setCursor(undefined)}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold"
                        style={{ background: "var(--surface-container)", border: "1px solid var(--outline-variant)", color: "var(--on-surface-variant)" }}
                      >
                        ← Pertama
                      </button>
                    )}
                    {workersData?.nextCursor && (
                      <button
                        onClick={() => setCursor(workersData.nextCursor)}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold"
                        style={{ background: "var(--surface-container)", border: "1px solid var(--outline-variant)", color: "var(--on-surface-variant)" }}
                      >
                        Selanjutnya →
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
