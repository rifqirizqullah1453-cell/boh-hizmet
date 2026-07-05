import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, Play, MapPin, User, Phone,
  ClipboardCopy, Check, MessageCircle, Navigation,
} from "lucide-react";
import { ChatPanel } from "../chat/ChatPanel";

const SERVICE_META: Record<string, { label: string; icon: string }> = {
  delivery: { label: "Kurir", icon: "📦" },
  shopping: { label: "Belanja", icon: "🛒" },
  cleaning: { label: "Kebersihan", icon: "🧹" },
  moving: { label: "Angkut Barang", icon: "🚛" },
};

interface ActiveOrderItem {
  id: string;
  serviceType: string;
  status: string;
  pickupAddress: string;
  destinationAddress: string;
  pickupLat?: number | null;
  pickupLng?: number | null;
  destinationLat?: number | null;
  destinationLng?: number | null;
  price: number;
  notes?: string | null;
  customerName?: string | null;
  customerPhone?: string | null;
}

interface ActiveOrderCardProps {
  order: ActiveOrderItem;
  workerName: string;
  onUpdateStatus: (orderId: string, status: "IN_PROGRESS" | "COMPLETED") => void;
  isUpdating: boolean;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
}

function openMaps(lat: number | null | undefined, lng: number | null | undefined, address: string) {
  if (lat != null && lng != null) {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank", "noopener");
  } else {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, "_blank", "noopener");
  }
}

function StepIndicator({ status }: { status: string }) {
  const steps = ["Diterima", "Dikerjakan", "Selesai"];
  const activeIndex = status === "ACCEPTED" ? 0 : status === "IN_PROGRESS" ? 1 : 2;

  return (
    <div className="flex items-center gap-0 mb-4">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all"
              style={
                i <= activeIndex
                  ? { background: "linear-gradient(135deg, #4DD4E0, #2BC5D4)", color: "white", boxShadow: "0 2px 8px rgba(43,197,212,0.4)" }
                  : { background: "var(--border-light)", color: "var(--text-muted)" }
              }
            >
              {i < activeIndex ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span
              className="text-[10px] font-bold mt-1 whitespace-nowrap"
              style={{ color: i <= activeIndex ? "var(--cyan)" : "var(--text-muted)" }}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className="flex-1 h-0.5 mx-1 mb-4 rounded-full transition-all"
              style={{ background: i < activeIndex ? "var(--cyan)" : "var(--border-light)" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export function ActiveOrderCard({ order, workerName, onUpdateStatus, isUpdating }: ActiveOrderCardProps) {
  const [confirmingDone, setConfirmingDone] = useState(false);
  const [copiedField, setCopiedField] = useState<"pickup" | "dest" | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  const meta = SERVICE_META[order.serviceType] ?? { label: order.serviceType, icon: "📋" };
  const isAccepted = order.status === "ACCEPTED";

  const handleCopy = (field: "pickup" | "dest", text: string) => {
    copyToClipboard(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleDoneClick = () => {
    if (!confirmingDone) {
      setConfirmingDone(true);
      return;
    }
    setConfirmingDone(false);
    onUpdateStatus(order.id, "COMPLETED");
  };

  return (
    <>
      <motion.article
        className="rounded-3xl card-bg border border-dark overflow-hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          borderTop: "3px solid var(--cyan)",
          boxShadow: "0 4px 20px rgba(43,197,212,0.12)",
        }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4">
          <StepIndicator status={order.status} />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                style={{ background: "rgba(43,197,212,0.1)" }}
              >
                {meta.icon}
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: "var(--text)" }}>
                  {meta.label}
                </p>
                <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  #{order.id.split("-").slice(-2).join("-").toUpperCase()}
                </p>
              </div>
            </div>
            <p className="text-lg font-black" style={{ color: "var(--cyan)" }}>
              ₺{order.price.toLocaleString("tr-TR")}
            </p>
          </div>

          {/* Customer row */}
          {(order.customerName || order.customerPhone) && (
            <div
              className="flex items-center gap-2 mb-4"
              style={{ borderBottom: "1px solid var(--border-light)", paddingBottom: "1rem" }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(43,197,212,0.12)" }}
              >
                <User className="w-4 h-4" style={{ color: "var(--cyan)" }} />
              </div>
              <div className="flex-1 min-w-0">
                {order.customerName && (
                  <p className="font-bold text-sm" style={{ color: "var(--text)" }}>
                    {order.customerName}
                  </p>
                )}
                {order.customerPhone && (
                  <a
                    href={`tel:${order.customerPhone}`}
                    className="flex items-center gap-1 text-xs font-medium"
                    style={{ color: "var(--cyan)" }}
                  >
                    <Phone className="w-3 h-3" />
                    {order.customerPhone}
                  </a>
                )}
              </div>
              {/* Chat button */}
              <motion.button
                type="button"
                onClick={() => setChatOpen(true)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold text-white flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #4DD4E0, #2BC5D4)", boxShadow: "var(--shadow-cyan)" }}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Chat
              </motion.button>
            </div>
          )}

          {/* Addresses */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--border-light)" }}
          >
            {/* Pickup */}
            <div className="flex items-start gap-2 px-3.5 py-3" style={{ borderBottom: "1px solid var(--border-light)" }}>
              <div className="flex flex-col items-center mt-0.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--cyan)" }} />
                <div className="w-0.5 h-5 mt-0.5" style={{ background: "var(--border)" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "var(--text-muted)" }}>
                  Pickup
                </p>
                <p className="text-xs font-medium line-clamp-2" style={{ color: "var(--text)" }}>
                  {order.pickupAddress}
                </p>
              </div>
              <div className="flex gap-1 flex-shrink-0 ml-1">
                <button
                  type="button"
                  onClick={() => handleCopy("pickup", order.pickupAddress)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(43,197,212,0.1)", color: "var(--cyan)" }}
                >
                  {copiedField === "pickup" ? <Check className="w-3 h-3" /> : <ClipboardCopy className="w-3 h-3" />}
                </button>
                <button
                  type="button"
                  onClick={() => openMaps(order.pickupLat, order.pickupLng, order.pickupAddress)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(43,197,212,0.1)", color: "var(--cyan)" }}
                >
                  <Navigation className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Destination */}
            <div className="flex items-start gap-2 px-3.5 py-3">
              <div className="flex flex-col items-center mt-0.5">
                <div className="w-2.5 h-2.5 rounded" style={{ background: "#8B5CF6" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "var(--text-muted)" }}>
                  Tujuan
                </p>
                <p className="text-xs font-medium line-clamp-2" style={{ color: "var(--text)" }}>
                  {order.destinationAddress}
                </p>
              </div>
              <div className="flex gap-1 flex-shrink-0 ml-1">
                <button
                  type="button"
                  onClick={() => handleCopy("dest", order.destinationAddress)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(139,92,246,0.1)", color: "#8B5CF6" }}
                >
                  {copiedField === "dest" ? <Check className="w-3 h-3" /> : <ClipboardCopy className="w-3 h-3" />}
                </button>
                <button
                  type="button"
                  onClick={() => openMaps(order.destinationLat, order.destinationLng, order.destinationAddress)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(139,92,246,0.1)", color: "#8B5CF6" }}
                >
                  <Navigation className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div
              className="flex items-start gap-2 mt-3 p-3 rounded-2xl"
              style={{ background: "rgba(245,158,11,0.08)" }}
            >
              <span className="text-sm flex-shrink-0">📝</span>
              <p className="text-xs font-medium" style={{ color: "#92400E" }}>
                {order.notes}
              </p>
            </div>
          )}
        </div>

        {/* Action */}
        <div className="px-5 pb-5">
          {isAccepted ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isUpdating}
              onClick={() => onUpdateStatus(order.id, "IN_PROGRESS")}
              className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm text-white"
              style={{ background: "linear-gradient(135deg, #34D399, #10B981)", boxShadow: "0 4px 16px rgba(16,185,129,0.3)" }}
            >
              {isUpdating ? (
                <motion.div
                  className="w-4 h-4 border-[2.5px] border-white/40 rounded-full border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <><Play className="w-4 h-4 fill-white" /> Mulai Pengerjaan</>
              )}
            </motion.button>
          ) : (
            <AnimatePresence mode="wait">
              {confirmingDone ? (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                >
                  <p className="text-sm font-semibold text-center mb-3" style={{ color: "var(--text)" }}>
                    Yakin order sudah selesai?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmingDone(false)}
                      className="flex-1 py-3 rounded-2xl font-bold text-sm"
                      style={{ background: "var(--bg)", color: "var(--text-secondary)", border: "1.5px solid var(--border)" }}
                    >
                      Batal
                    </button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isUpdating}
                      onClick={handleDoneClick}
                      className="flex-1 py-3 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-1.5"
                      style={{ background: "linear-gradient(135deg, #4DD4E0, #2BC5D4)", boxShadow: "var(--shadow-cyan)" }}
                    >
                      {isUpdating ? (
                        <motion.div
                          className="w-4 h-4 border-[2.5px] border-white/40 rounded-full border-t-white"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <><CheckCircle className="w-4 h-4" /> Ya, Selesai</>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="done"
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isUpdating}
                  onClick={handleDoneClick}
                  className="w-full py-3.5 btn-cyan rounded-2xl flex items-center justify-center gap-2"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                >
                  <CheckCircle className="w-4 h-4" />
                  Selesai
                </motion.button>
              )}
            </AnimatePresence>
          )}
        </div>
      </motion.article>

      {/* Chat panel */}
      <AnimatePresence>
        {chatOpen && (
          <ChatPanel
            orderId={order.id}
            workerName={workerName}
            onClose={() => setChatOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
