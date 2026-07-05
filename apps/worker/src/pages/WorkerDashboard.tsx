import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Power, Bell, CheckCircle, Wallet, Package, Star } from "lucide-react";
import { useOrders } from "../features/orders/OrderContext";
import { useAuth } from "../features/auth/useAuth";
import { trpc, TRPCClientError } from "@boh/api";
import { OrderCard } from "../features/orders/OrderCard";
import { ActiveOrderCard } from "../features/orders/ActiveOrderCard";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../lib/firestoreClient";

const easeOut = [0.16, 1, 0.3, 1] as const;

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const CATEGORIES = [
  { id: "all" as const, label: "Semua" },
  { id: "delivery" as const, label: "Kurir" },
  { id: "shopping" as const, label: "Belanja" },
  { id: "cleaning" as const, label: "Kebersihan" },
  { id: "moving" as const, label: "Angkut" },
];

export function WorkerDashboard() {
  const { pendingOrders, isAudioUnlocked, unlockAudio, requestNotificationPermission } =
    useOrders();
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(false);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ kind: "error" | "info"; text: string } | null>(null);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]["id"]>("all");

  const gpsWatchRef = useRef<number | null>(null);

  const acceptOrder = trpc.order.accept.useMutation();
  const updateStatus = trpc.order.updateStatus.useMutation();
  const setOnlineMut = trpc.worker.setOnline.useMutation();

  const { data: workerMe } = trpc.worker.me.useQuery(undefined, {
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const { data: activeOrders = [], refetch: refetchActive } = trpc.order.myActive.useQuery(
    undefined,
    { refetchInterval: 30_000 }
  );

  const { data: completedData } = trpc.order.listMine.useQuery(
    { status: "COMPLETED", limit: 50 },
    { staleTime: 1000 * 60 }
  );

  const today = new Date();
  const todayCompleted = (completedData?.items ?? []).filter((o) =>
    isSameDay(new Date(o.createdAt), today)
  );
  const todayEarnings = todayCompleted.reduce((sum, o) => sum + o.price, 0);

  useEffect(() => {
    if (workerMe?.isOnline !== undefined) setIsOnline(workerMe.isOnline);
  }, [workerMe?.isOnline]);

  // GPS tracking: watch position while online, stop when offline/unmounted
  useEffect(() => {
    if (!isOnline || !user?.uid) {
      if (gpsWatchRef.current != null) {
        navigator.geolocation.clearWatch(gpsWatchRef.current);
        gpsWatchRef.current = null;
      }
      return;
    }
    if (!("geolocation" in navigator)) return;

    gpsWatchRef.current = navigator.geolocation.watchPosition(
      ({ coords }) => {
        void setDoc(
          doc(firestore, "worker_locations", user.uid),
          { lat: coords.latitude, lng: coords.longitude, updatedAt: Date.now() },
          { merge: true }
        );
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 15_000 }
    );

    return () => {
      if (gpsWatchRef.current != null) {
        navigator.geolocation.clearWatch(gpsWatchRef.current);
        gpsWatchRef.current = null;
      }
    };
  }, [isOnline, user?.uid]);

  const handleToggleOnline = () => {
    unlockAudio();
    void requestNotificationPermission();
    const next = !isOnline;
    setIsOnline(next);
    setOnlineMut.mutate({ isOnline: next }, { onError: () => setIsOnline(!next) });
  };

  const handleAccept = async (orderId: string) => {
    setAcceptingId(orderId);
    setFeedback(null);
    try {
      await acceptOrder.mutateAsync({ orderId });
      void refetchActive();
      setFeedback({ kind: "info", text: "Order diterima! Lihat daftar order aktif." });
    } catch (err) {
      if (err instanceof TRPCClientError && err.data?.code === "CONFLICT") {
        setFeedback({ kind: "error", text: "Terlambat! Order ini sudah diambil pekerja lain." });
      } else {
        setFeedback({ kind: "error", text: "Gagal menerima order. Coba lagi." });
      }
    } finally {
      setAcceptingId(null);
    }
  };

  const handleUpdateStatus = async (
    orderId: string,
    status: "IN_PROGRESS" | "COMPLETED"
  ) => {
    setUpdatingId(orderId);
    setFeedback(null);
    try {
      await updateStatus.mutateAsync({ orderId, status });
      void refetchActive();
      if (status === "COMPLETED") {
        setFeedback({ kind: "info", text: "Order selesai! Pembayaran akan segera diproses." });
      }
    } catch {
      setFeedback({ kind: "error", text: "Gagal memperbarui status. Coba lagi." });
    } finally {
      setUpdatingId(null);
    }
  };

  const displayName = user?.displayName ?? user?.email?.split("@")[0] ?? "Pekerja";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const rating = workerMe?.rating != null ? Number(workerMe.rating) : null;
  const totalRatings = workerMe?.totalRatings ?? 0;

  const visibleOrders =
    category === "all"
      ? pendingOrders
      : pendingOrders.filter((o) => o.serviceType === category);

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg)" }}>
      {/* Hero Header */}
      <div className="px-5 pt-12 pb-6 rounded-b-[36px] gradient-hero relative overflow-hidden">
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
            top: "-40%",
            right: "-20%",
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        {/* Top row: identity + bell */}
        <div className="relative z-10 flex items-center justify-between mb-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: easeOut }}
          >
            <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.55)" }}>
              BÖH Hizmet · Pekerja
            </p>
            <h1 className="text-2xl font-black mt-0.5 text-white tracking-tight">
              {displayName.split(" ")[0]}
            </h1>
            {rating != null && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                <span className="text-xs font-bold text-white/80">
                  {rating.toFixed(1)} · {totalRatings} ulasan
                </span>
              </div>
            )}
          </motion.div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 flex items-center justify-center rounded-full glass relative"
            >
              <Bell className="w-5 h-5 text-white" />
              {pendingOrders.length > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-[10px] font-black text-white border border-white/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  {pendingOrders.length}
                </motion.span>
              )}
            </motion.button>
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center border-[2.5px] border-white/30 ring-2 ring-white/10 shadow-lg text-base font-black text-white"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              {avatarInitial}
            </div>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          className="flex gap-3 mb-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, ease: easeOut }}
        >
          <div className="flex-1 p-3.5 rounded-2xl glass">
            <div className="flex items-center gap-1.5 mb-1">
              <Wallet className="w-3.5 h-3.5 text-white/60" />
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Hari Ini</p>
            </div>
            <p className="text-lg font-black text-white">₺{todayEarnings.toLocaleString("tr-TR")}</p>
          </div>
          <div className="flex-1 p-3.5 rounded-2xl glass">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle className="w-3.5 h-3.5 text-white/60" />
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Selesai</p>
            </div>
            <p className="text-lg font-black text-white">{todayCompleted.length}</p>
          </div>
          {activeOrders.length > 0 && (
            <div className="flex-1 p-3.5 rounded-2xl glass">
              <div className="flex items-center gap-1.5 mb-1">
                <Package className="w-3.5 h-3.5 text-white/60" />
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Aktif</p>
              </div>
              <p className="text-lg font-black text-white">{activeOrders.length}</p>
            </div>
          )}
        </motion.div>

        {/* Online Toggle */}
        <motion.button
          onClick={handleToggleOnline}
          whileTap={{ scale: 0.97 }}
          className="w-full p-4 rounded-[20px] flex items-center gap-4 card-bg border border-dark shadow-xl"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors flex-shrink-0"
            style={{ background: isOnline ? "linear-gradient(135deg, #4DD4E0, #2BC5D4)" : "#F0F7FF" }}
          >
            <Power className="w-6 h-6" style={{ color: isOnline ? "white" : "#B8D4E8" }} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-bold text-sm" style={{ color: "var(--text)" }}>
              {isOnline ? "Online!" : "Offline"}
            </p>
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              {isOnline ? "Menerima pesanan sekarang" : "Aktifkan untuk mulai"}
            </p>
          </div>
          <div
            className="w-12 h-6 rounded-full relative flex-shrink-0"
            style={{ background: isOnline ? "linear-gradient(135deg, #4DD4E0, #2BC5D4)" : "#CBD5E1" }}
          >
            <motion.div
              className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
              animate={{ left: isOnline ? 26 : 2 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </div>
        </motion.button>
      </div>

      {/* Body */}
      <div className="px-5 pt-5 space-y-5 max-w-lg mx-auto">
        {/* Feedback toast */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="p-3.5 rounded-2xl text-sm font-semibold"
              style={{
                background:
                  feedback.kind === "error"
                    ? "rgba(239,68,68,0.08)"
                    : "rgba(43,197,212,0.1)",
                color: feedback.kind === "error" ? "#DC2626" : "#0C6B78",
              }}
              onClick={() => setFeedback(null)}
            >
              {feedback.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Audio hint */}
        {!isAudioUnlocked && (
          <div
            className="p-3 rounded-xl text-xs font-medium text-center"
            style={{ background: "rgba(245,158,11,0.1)", color: "#92400E" }}
          >
            🔔 Tekan tombol Online untuk mengaktifkan notifikasi suara
          </div>
        )}

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <div>
            <div className="section-header mb-3">
              <div>
                <h2 className="section-title">Pesanan Aktif</h2>
                <p className="section-subtitle">{activeOrders.length} sedang dikerjakan</p>
              </div>
              <motion.span
                className="text-[10px] font-black px-2.5 py-1 rounded-lg text-white"
                style={{ background: "linear-gradient(135deg, #4DD4E0, #2BC5D4)" }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                {activeOrders.length}
              </motion.span>
            </div>
            <div className="space-y-3">
              {activeOrders.map((order) => (
                <ActiveOrderCard
                  key={order.id}
                  order={order}
                  workerName={displayName}
                  onUpdateStatus={handleUpdateStatus}
                  isUpdating={updatingId === order.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 hide-scrollbar">
          {CATEGORIES.map((c) => (
            <motion.button
              key={c.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCategory(c.id)}
              className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all"
              style={
                category === c.id
                  ? { background: "linear-gradient(135deg, #4DD4E0, #2BC5D4)", color: "white", boxShadow: "var(--shadow-cyan)" }
                  : { background: "var(--bg-card)", color: "var(--text-secondary)", border: "1.5px solid var(--border)" }
              }
            >
              {c.label}
            </motion.button>
          ))}
        </div>

        {/* Available Orders */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div>
              <h2 className="section-title">Order Tersedia</h2>
              {visibleOrders.length > 0 && (
                <p className="section-subtitle">{visibleOrders.length} menunggu</p>
              )}
            </div>
            {visibleOrders.length > 0 && (
              <motion.span
                className="ml-auto text-[10px] font-black px-2.5 py-1 rounded-lg text-white"
                style={{ background: "linear-gradient(135deg, #4DD4E0, #2BC5D4)" }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
              >
                {visibleOrders.length}
              </motion.span>
            )}
          </div>

          {!isOnline ? (
            <motion.div
              className="p-8 rounded-3xl text-center card-bg border border-dark"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.p
                className="text-4xl mb-3"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                📴
              </motion.p>
              <p className="font-bold text-sm" style={{ color: "var(--text)" }}>
                Sedang Offline
              </p>
              <p className="text-xs font-medium mt-1" style={{ color: "var(--text-muted)" }}>
                Aktifkan Online untuk menerima pesanan
              </p>
              {pendingOrders.length > 0 && (
                <div
                  className="mt-3 px-3 py-2 rounded-xl text-xs font-bold"
                  style={{ background: "rgba(43,197,212,0.1)", color: "var(--cyan)" }}
                >
                  🔔 Ada {pendingOrders.length} pesanan menunggu!
                </div>
              )}
            </motion.div>
          ) : visibleOrders.length === 0 ? (
            <motion.div
              className="p-8 rounded-3xl text-center card-bg border border-dark"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.p
                className="text-4xl mb-3"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ⏳
              </motion.p>
              <p className="font-bold text-sm" style={{ color: "var(--text)" }}>
                Belum ada order
              </p>
              <p className="text-xs font-medium mt-1" style={{ color: "var(--text-muted)" }}>
                Menunggu pesanan baru…
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {visibleOrders.map((order) => (
                  <OrderCard
                    key={order.orderId}
                    order={order}
                    onAccept={handleAccept}
                    isAccepting={acceptingId === order.orderId}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
