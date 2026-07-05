import { useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@boh/api";
import { useAuth } from "../features/auth/useAuth";
import { Star, LogOut, CheckCircle, Wallet, TrendingUp, Edit2, X, Save } from "lucide-react";

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function ProfilePage() {
  const { user } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { data: workerMe, refetch: refetchMe } = trpc.worker.me.useQuery(undefined, {
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  const { data: completedData } = trpc.order.listMine.useQuery(
    { status: "COMPLETED", limit: 50 },
    { staleTime: 1000 * 60 }
  );

  const updateProfile = trpc.auth.updateProfile.useMutation();

  const today = new Date();
  const todayOrders = (completedData?.items ?? []).filter((o) =>
    isSameDay(new Date(o.createdAt), today)
  );
  const todayEarnings = todayOrders.reduce((sum, o) => sum + o.price, 0);
  const totalCompletedCount = completedData?.items.length ?? 0;
  const totalEarnings = (completedData?.items ?? []).reduce((sum, o) => sum + o.price, 0);

  const displayName = user?.displayName ?? user?.email?.split("@")[0] ?? "Pekerja";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const rating = workerMe?.rating != null ? Number(workerMe.rating) : null;
  const totalRatings = workerMe?.totalRatings ?? 0;
  const isOnline = workerMe?.isOnline ?? false;

  const handleLogout = () => signOut(getAuth());

  const openEdit = () => {
    setEditName(workerMe?.name ?? displayName);
    setEditPhone("");
    setSaveError(null);
    setSaveSuccess(false);
    setEditOpen(true);
  };

  const handleSave = async () => {
    setSaveError(null);
    try {
      await updateProfile.mutateAsync({
        ...(editName.trim() ? { name: editName.trim() } : {}),
        ...(editPhone.trim() ? { phone: editPhone.trim() } : {}),
      });
      setSaveSuccess(true);
      void refetchMe();
      setTimeout(() => {
        setEditOpen(false);
        setSaveSuccess(false);
      }, 900);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan";
      setSaveError(msg);
    }
  };

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-10 rounded-b-[36px] gradient-hero relative overflow-hidden">
        <motion.div
          className="absolute w-[350px] h-[350px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
            top: "-35%",
            right: "-15%",
          }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Avatar */}
          <div className="relative mb-3">
            <motion.div
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-black text-white border-[2.5px] border-white/30"
              style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)" }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {avatarInitial}
            </motion.div>
            <button
              type="button"
              onClick={openEdit}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-white/30"
              style={{ background: "rgba(255,255,255,0.25)", backdropFilter: "blur(8px)" }}
            >
              <Edit2 className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          <motion.h1
            className="text-2xl font-black text-white tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {workerMe?.name ?? displayName}
          </motion.h1>

          {user?.email && (
            <p className="text-xs font-medium mt-1" style={{ color: "rgba(255,255,255,0.65)" }}>
              {user.email}
            </p>
          )}

          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs font-bold">
              <span className="w-2 h-2 rounded-full" style={{ background: isOnline ? "#34D399" : "#9CA3AF" }} />
              <span className="text-white">{isOnline ? "Online" : "Offline"}</span>
            </div>
            {rating != null && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs font-bold text-white">
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>{rating.toFixed(1)}</span>
                <span style={{ color: "rgba(255,255,255,0.6)" }}>({totalRatings})</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 max-w-lg mx-auto space-y-4">
        {/* Today stats */}
        <motion.div
          className="card-bg border border-dark rounded-3xl p-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
            Statistik Hari Ini
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1 text-center">
              <p className="text-2xl font-black" style={{ color: "var(--cyan)" }}>
                ₺{todayEarnings.toLocaleString("tr-TR")}
              </p>
              <p className="text-xs font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>
                Pendapatan
              </p>
            </div>
            <div className="w-px h-12" style={{ background: "var(--border-light)" }} />
            <div className="flex-1 text-center">
              <p className="text-2xl font-black" style={{ color: "var(--text)" }}>
                {todayOrders.length}
              </p>
              <p className="text-xs font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>
                Order Selesai
              </p>
            </div>
          </div>
        </motion.div>

        {/* All-time stats */}
        <motion.div
          className="grid grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {[
            { icon: <CheckCircle className="w-5 h-5" />, value: totalCompletedCount, label: "Total Order", color: "#10B981", bg: "rgba(16,185,129,0.08)" },
            { icon: <Wallet className="w-5 h-5" />, value: `₺${Math.round(totalEarnings / 1000)}K`, label: "Total Earning", color: "var(--cyan)", bg: "rgba(43,197,212,0.08)" },
            { icon: <TrendingUp className="w-5 h-5" />, value: rating ? rating.toFixed(1) : "-", label: "Rating", color: "#F59E0B", bg: "rgba(245,158,11,0.08)" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="card-bg border border-dark rounded-2xl p-3.5 text-center"
              style={{ boxShadow: "var(--shadow-sm)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2"
                style={{ background: stat.bg, color: stat.color }}
              >
                {stat.icon}
              </div>
              <p className="text-base font-black" style={{ color: "var(--text)" }}>{stat.value}</p>
              <p className="text-[10px] font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Edit profile button */}
        <motion.button
          type="button"
          onClick={openEdit}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm"
          style={{ background: "rgba(43,197,212,0.08)", color: "var(--cyan)", border: "1.5px solid rgba(43,197,212,0.2)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Edit2 className="w-4 h-4" />
          Edit Profil
        </motion.button>

        {/* App info */}
        <motion.div
          className="card-bg border border-dark rounded-3xl p-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          style={{ boxShadow: "var(--shadow-sm)" }}
        >
          <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            Aplikasi
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-sm" style={{ color: "var(--text)" }}>BÖH Hizmet Worker</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>v1.0.0 · Bartın, Türkiye</p>
            </div>
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
              style={{ background: "rgba(43,197,212,0.1)" }}
            >
              🛵
            </div>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.button
          type="button"
          onClick={handleLogout}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm"
          style={{ background: "rgba(239,68,68,0.06)", color: "#DC2626", border: "1.5px solid rgba(239,68,68,0.15)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.27 }}
        >
          <LogOut className="w-4 h-4" />
          Keluar dari Akun
        </motion.button>
      </div>

      {/* Edit Profile Bottom Sheet */}
      <AnimatePresence>
        {editOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[80] bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditOpen(false)}
            />
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-[81] max-w-lg mx-auto"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
            >
              <div
                className="rounded-t-[32px] overflow-hidden"
                style={{ background: "var(--bg-card)" }}
              >
                <div className="px-6 pt-5 pb-2 gradient-hero flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Profil</p>
                    <h2 className="text-lg font-black text-white">Edit Profil</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditOpen(false)}
                    className="w-9 h-9 rounded-full glass flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </div>

                <div className="px-6 py-5 space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-muted)" }}>
                      Nama
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Nama lengkap"
                      className="w-full px-4 py-3 rounded-2xl text-sm font-medium outline-none"
                      style={{
                        background: "var(--bg)",
                        border: "1.5px solid var(--border)",
                        color: "var(--text)",
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "var(--cyan)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--cyan-glow)"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-muted)" }}>
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+90 5xx xxx xx xx"
                      className="w-full px-4 py-3 rounded-2xl text-sm font-medium outline-none"
                      style={{
                        background: "var(--bg)",
                        border: "1.5px solid var(--border)",
                        color: "var(--text)",
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "var(--cyan)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--cyan-glow)"; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
                    />
                  </div>

                  <AnimatePresence>
                    {saveError && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-xs font-semibold px-1"
                        style={{ color: "#DC2626" }}
                      >
                        {saveError}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="button"
                    onClick={handleSave}
                    disabled={updateProfile.isPending || saveSuccess}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 btn-cyan rounded-2xl flex items-center justify-center gap-2 font-bold text-sm"
                    style={{ marginBottom: "env(safe-area-inset-bottom, 0px)" }}
                  >
                    {updateProfile.isPending ? (
                      <motion.div
                        className="w-4 h-4 border-[2.5px] border-white/40 rounded-full border-t-white"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : saveSuccess ? (
                      <><CheckCircle className="w-4 h-4" /> Tersimpan!</>
                    ) : (
                      <><Save className="w-4 h-4" /> Simpan Perubahan</>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
