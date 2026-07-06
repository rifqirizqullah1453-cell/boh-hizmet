import { useState } from "react";
import { trpc } from "@boh/api";
import { Search, ChevronRight, ChevronLeft, XCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Order } from "@boh/db";

type OrderStatus = Order["status"];

const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING:     { bg: "#FEF3C7", text: "#D97706" },
  ACCEPTED:    { bg: "#DBEAFE", text: "#2563EB" },
  IN_PROGRESS: { bg: "#EDE9FE", text: "#7C3AED" },
  COMPLETED:   { bg: "#D1FAE5", text: "#059669" },
  CANCELLED:   { bg: "#FEE2E2", text: "#DC2626" },
};

const statusLabel: Record<string, string> = {
  PENDING:     "Pending",
  ACCEPTED:    "Diterima",
  IN_PROGRESS: "Dikerjakan",
  COMPLETED:   "Selesai",
  CANCELLED:   "Dibatalkan",
};

const statuses: (OrderStatus | "")[] = ["", "PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];

type ModalState =
  | { type: "cancel"; orderId: string }
  | { type: "reassign"; orderId: string }
  | null;

export function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>();
  const [cursor, setCursor] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<ModalState>(null);
  const [reassignWorkerId, setReassignWorkerId] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  const { data, isLoading, refetch } = trpc.admin.listOrders.useQuery({
    limit: 20,
    cursor,
    status: statusFilter,
  });

  const forceCancelMutation = trpc.admin.forceCancelOrder.useMutation({
    onSuccess: () => { setModal(null); setCancelReason(""); void refetch(); },
  });

  const forceReassignMutation = trpc.admin.forceReassignOrder.useMutation({
    onSuccess: () => { setModal(null); setReassignWorkerId(""); void refetch(); },
  });

  const orders = (data?.items ?? []).filter((o) =>
    search === "" ||
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.serviceType?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "var(--text)" }}>Orders</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Semua order yang masuk</p>
        </div>
        <button onClick={() => void refetch()} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--text-muted)" }} />
          <input
            placeholder="Cari ID / tipe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl text-sm font-medium outline-none"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)", width: 220 }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s || "all"}
              onClick={() => { setStatusFilter(s || undefined); setCursor(undefined); }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={
                (s || undefined) === statusFilter
                  ? { background: "var(--cyan)", color: "white" }
                  : { background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-secondary)" }
              }
            >
              {s ? statusLabel[s] : "Semua"}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
                {["Order ID", "Tipe", "Customer", "Worker", "Harga", "Status", "Waktu", "Aksi"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="py-12 text-center text-sm" style={{ color: "var(--text-muted)" }}>Memuat...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="py-12 text-center text-sm" style={{ color: "var(--text-muted)" }}>Tidak ada order</td></tr>
              ) : (
                orders.map((order) => {
                  const sc = statusColors[order.status] ?? { bg: "#F3F4F6", text: "#6B7280" };
                  return (
                    <tr key={order.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-secondary)" }}>{order.id.slice(0, 8)}…</td>
                      <td className="px-4 py-3 font-semibold capitalize" style={{ color: "var(--text)" }}>{order.serviceType}</td>
                      <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{order.customerId}</td>
                      <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{order.workerId ?? "—"}</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: "var(--text)" }}>₺{order.price.toLocaleString("tr-TR")}</td>
                      <td className="px-4 py-3">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: sc.bg, color: sc.text }}>
                          {statusLabel[order.status] ?? order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: "var(--text-muted)" }}>
                        {new Date(order.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td className="px-4 py-3">
                        {order.status !== "COMPLETED" && order.status !== "CANCELLED" && (
                          <div className="flex items-center gap-2">
                            <button onClick={() => setModal({ type: "reassign", orderId: order.id })} className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: "#DBEAFE", color: "#2563EB" }}>
                              Ganti Worker
                            </button>
                            <button onClick={() => setModal({ type: "cancel", orderId: order.id })} className="px-2.5 py-1 rounded-lg text-xs font-bold" style={{ background: "#FEE2E2", color: "#DC2626" }}>
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: "1px solid var(--border)" }}>
          <button onClick={() => setCursor(undefined)} disabled={!cursor} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
            <ChevronLeft className="w-3.5 h-3.5" /> Pertama
          </button>
          <button onClick={() => setCursor(data?.nextCursor)} disabled={!data?.nextCursor} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-40" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
            Selanjutnya <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setModal(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl p-6" style={{ background: "var(--bg-card)" }}>
              {modal.type === "cancel" ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#FEE2E2" }}><XCircle className="w-5 h-5" style={{ color: "#DC2626" }} /></div>
                    <div><h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>Force Cancel Order</h3><p className="text-xs" style={{ color: "var(--text-muted)" }}>{modal.orderId.slice(0, 8)}…</p></div>
                  </div>
                  <input placeholder="Alasan pembatalan..." value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-4" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }} />
                  <div className="flex gap-3">
                    <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>Batal</button>
                    <button onClick={() => forceCancelMutation.mutate({ orderId: modal.orderId, reason: cancelReason })} disabled={!cancelReason || forceCancelMutation.isPending} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50" style={{ background: "#DC2626" }}>
                      {forceCancelMutation.isPending ? "..." : "Cancel Order"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#DBEAFE" }}><RefreshCw className="w-5 h-5" style={{ color: "#2563EB" }} /></div>
                    <div><h3 className="font-bold text-sm" style={{ color: "var(--text)" }}>Ganti Worker</h3><p className="text-xs" style={{ color: "var(--text-muted)" }}>{modal.orderId.slice(0, 8)}…</p></div>
                  </div>
                  <input type="number" placeholder="ID Worker baru..." value={reassignWorkerId} onChange={(e) => setReassignWorkerId(e.target.value)} className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-4" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }} />
                  <div className="flex gap-3">
                    <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text-secondary)" }}>Batal</button>
                    <button onClick={() => forceReassignMutation.mutate({ orderId: modal.orderId, newWorkerId: Number(reassignWorkerId) })} disabled={!reassignWorkerId || forceReassignMutation.isPending} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-50" style={{ background: "#2563EB" }}>
                      {forceReassignMutation.isPending ? "..." : "Reassign"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
