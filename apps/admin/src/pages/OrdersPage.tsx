import { useState } from "react";
import { trpc } from "@boh/api";
import { Search, XCircle, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Order } from "@boh/db";

type OrderStatus = Order["status"];

const statusColors: Record<string, { bg: string; text: string; accent: string }> = {
  PENDING:     { bg: "#fef3c7", text: "#d97706", accent: "#d97706" },
  ACCEPTED:    { bg: "#dbeafe", text: "#2563eb", accent: "#2563eb" },
  IN_PROGRESS: { bg: "#ede9fe", text: "#7c3aed", accent: "#7c3aed" },
  COMPLETED:   { bg: "#d1fae5", text: "#059669", accent: "#059669" },
  CANCELLED:   { bg: "#fee2e2", text: "#dc2626", accent: "#dc2626" },
};

const statusLabel: Record<string, string> = {
  PENDING:     "Menunggu",
  ACCEPTED:    "Diterima",
  IN_PROGRESS: "Dikerjakan",
  COMPLETED:   "Selesai",
  CANCELLED:   "Dibatalkan",
};

const serviceLabel: Record<string, string> = {
  delivery: "Kurir",
  shopping: "Belanja",
  cleaning: "Kebersihan",
  moving:   "Pindahan",
};

const statuses: (OrderStatus | "")[] = ["", "PENDING", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
const filterLabel: Record<string, string> = {
  "":          "Semua",
  PENDING:     "Menunggu",
  ACCEPTED:    "Diterima",
  IN_PROGRESS: "Berjalan",
  COMPLETED:   "Selesai",
  CANCELLED:   "Dibatalkan",
};

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

  const orders = (data?.items ?? []).filter(
    (o) =>
      search === "" ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.serviceType?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="px-4 py-5 max-w-2xl mx-auto">

      {/* Search + refresh */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-2xl"
          style={{ background: "var(--surface-container-lowest)", border: "1px solid var(--outline-variant)" }}
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: "var(--on-surface-variant)" }} />
          <input
            placeholder="Cari ID / tipe layanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm font-medium outline-none bg-transparent"
            style={{ color: "var(--on-surface)" }}
          />
        </div>
        <button
          onClick={() => void refetch()}
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all active:scale-95"
          style={{ background: "var(--surface-container-lowest)", border: "1px solid var(--outline-variant)" }}
        >
          <RefreshCw className="w-4 h-4" style={{ color: "var(--on-surface-variant)" }} />
        </button>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-5">
        {statuses.map((s) => {
          const active = (s || undefined) === statusFilter;
          return (
            <button
              key={s || "all"}
              onClick={() => { setStatusFilter(s || undefined); setCursor(undefined); }}
              className="shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
              style={
                active
                  ? { background: "var(--primary)", color: "var(--on-primary)" }
                  : {
                      background: "var(--surface-container-lowest)",
                      border: "1px solid var(--outline-variant)",
                      color: "var(--on-surface-variant)",
                    }
              }
            >
              {filterLabel[s]}
            </button>
          );
        })}
      </div>

      {/* Order cards */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div
            className="w-8 h-8 rounded-full border-[3px]"
            style={{
              borderColor: "var(--outline-variant)",
              borderTopColor: "var(--primary)",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      ) : orders.length === 0 ? (
        <div className="py-16 text-center text-sm" style={{ color: "var(--on-surface-variant)" }}>
          Tidak ada order
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, i) => {
            const sc = statusColors[order.status] ?? { bg: "#f3f4f6", text: "#6b7280", accent: "#6b7280" };
            const canAct = order.status !== "COMPLETED" && order.status !== "CANCELLED";
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "var(--surface-container-lowest)",
                  border: "1px solid var(--outline-variant)",
                  borderLeft: `4px solid ${sc.accent}`,
                }}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <p
                        className="text-sm font-bold capitalize"
                        style={{ color: "var(--on-surface)" }}
                      >
                        {serviceLabel[order.serviceType ?? ""] ?? order.serviceType ?? "—"}
                      </p>
                      <p
                        className="text-xs font-mono mt-0.5"
                        style={{ color: "var(--on-surface-variant)" }}
                      >
                        #{order.id.slice(0, 10)}…
                      </p>
                    </div>
                    <span
                      className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold"
                      style={{ background: sc.bg, color: sc.text }}
                    >
                      {statusLabel[order.status] ?? order.status}
                    </span>
                  </div>

                  <div
                    className="flex items-center justify-between text-xs"
                    style={{ color: "var(--on-surface-variant)" }}
                  >
                    <span className="truncate max-w-[55%]">
                      Customer: <span className="font-medium" style={{ color: "var(--on-surface)" }}>{order.customerId}</span>
                    </span>
                    <span className="font-bold text-sm" style={{ color: "var(--on-surface)" }}>
                      ₺{order.price.toLocaleString("tr-TR")}
                    </span>
                  </div>

                  {order.workerId && (
                    <p className="text-xs mt-1" style={{ color: "var(--on-surface-variant)" }}>
                      Worker: <span className="font-medium">{order.workerId}</span>
                    </p>
                  )}

                  <p className="text-xs mt-1" style={{ color: "var(--outline)" }}>
                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>

                  {canAct && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setModal({ type: "reassign", orderId: order.id })}
                        className="flex-1 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                        style={{ background: "#dbeafe", color: "#2563eb" }}
                      >
                        Ganti Worker
                      </button>
                      <button
                        onClick={() => setModal({ type: "cancel", orderId: order.id })}
                        className="flex-1 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                        style={{ background: "#fee2e2", color: "#dc2626" }}
                      >
                        Batalkan
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {(cursor || data?.nextCursor) && (
        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={() => setCursor(undefined)}
            disabled={!cursor}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl text-xs font-bold disabled:opacity-40 transition-all active:scale-95"
            style={{ background: "var(--surface-container-lowest)", border: "1px solid var(--outline-variant)", color: "var(--on-surface-variant)" }}
          >
            <ChevronLeft className="w-4 h-4" /> Pertama
          </button>
          <button
            onClick={() => setCursor(data?.nextCursor)}
            disabled={!data?.nextCursor}
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl text-xs font-bold disabled:opacity-40 transition-all active:scale-95"
            style={{ background: "var(--surface-container-lowest)", border: "1px solid var(--outline-variant)", color: "var(--on-surface-variant)" }}
          >
            Selanjutnya <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-4 pb-6 sm:items-center"
            style={{ background: "rgba(0,0,0,0.4)" }}
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ y: 48, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 48, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl p-6"
              style={{ background: "var(--surface-container-lowest)" }}
            >
              {modal.type === "cancel" ? (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "#fee2e2" }}>
                      <XCircle className="w-5 h-5" style={{ color: "#dc2626" }} />
                    </div>
                    <div>
                      <h3 className="font-bold" style={{ color: "var(--on-surface)" }}>Batalkan Order</h3>
                      <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
                        #{modal.orderId.slice(0, 10)}…
                      </p>
                    </div>
                  </div>
                  <input
                    placeholder="Alasan pembatalan..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl text-sm outline-none mb-4"
                    style={{
                      background: "var(--surface-container-low)",
                      border: "1px solid var(--outline-variant)",
                      color: "var(--on-surface)",
                    }}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setModal(null)}
                      className="flex-1 py-3 rounded-2xl text-sm font-semibold"
                      style={{ background: "var(--surface-container)", color: "var(--on-surface-variant)" }}
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => forceCancelMutation.mutate({ orderId: modal.orderId, reason: cancelReason })}
                      disabled={!cancelReason || forceCancelMutation.isPending}
                      className="flex-1 py-3 rounded-2xl text-sm font-bold text-white disabled:opacity-50"
                      style={{ background: "#dc2626" }}
                    >
                      {forceCancelMutation.isPending ? "…" : "Ya, Batalkan"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "#dbeafe" }}>
                      <RefreshCw className="w-5 h-5" style={{ color: "#2563eb" }} />
                    </div>
                    <div>
                      <h3 className="font-bold" style={{ color: "var(--on-surface)" }}>Ganti Worker</h3>
                      <p className="text-xs" style={{ color: "var(--on-surface-variant)" }}>
                        #{modal.orderId.slice(0, 10)}…
                      </p>
                    </div>
                  </div>
                  <input
                    type="number"
                    placeholder="ID Worker baru..."
                    value={reassignWorkerId}
                    onChange={(e) => setReassignWorkerId(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl text-sm outline-none mb-4"
                    style={{
                      background: "var(--surface-container-low)",
                      border: "1px solid var(--outline-variant)",
                      color: "var(--on-surface)",
                    }}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setModal(null)}
                      className="flex-1 py-3 rounded-2xl text-sm font-semibold"
                      style={{ background: "var(--surface-container)", color: "var(--on-surface-variant)" }}
                    >
                      Batal
                    </button>
                    <button
                      onClick={() =>
                        forceReassignMutation.mutate({
                          orderId: modal.orderId,
                          newWorkerId: Number(reassignWorkerId),
                        })
                      }
                      disabled={!reassignWorkerId || forceReassignMutation.isPending}
                      className="flex-1 py-3 rounded-2xl text-sm font-bold text-white disabled:opacity-50"
                      style={{ background: "#2563eb" }}
                    >
                      {forceReassignMutation.isPending ? "…" : "Reassign"}
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
