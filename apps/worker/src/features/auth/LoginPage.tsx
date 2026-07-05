import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { Mail, Lock, User, AlertCircle } from "lucide-react";

export function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithPopup(getAuth(), new GoogleAuthProvider());
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      if (code !== "auth/popup-closed-by-user") setError(formatFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const auth = getAuth();
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (name.trim()) {
          await updateProfile(cred.user, { displayName: name.trim() });
        }
      }
    } catch (err: unknown) {
      setError(formatFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg)" }}>
      {/* Hero */}
      <div className="gradient-hero px-6 pt-16 pb-12 rounded-b-[40px] relative overflow-hidden">
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
            top: "-30%",
            right: "-20%",
          }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
              BÖH Hizmet
            </p>
            <h1 className="text-3xl font-black text-white leading-tight tracking-tight">
              {mode === "login" ? "Halo,\nPekerja! 🛵" : "Bergabung\nSekarang! 🚀"}
            </h1>
            <p className="text-sm mt-3 font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>
              {mode === "login"
                ? "Masuk ke portal pekerja BÖH Hizmet."
                : "Daftar dan mulai terima pesanan hari ini."}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form area */}
      <div className="flex-1 px-5 pt-6 pb-8 max-w-sm mx-auto w-full">
        {/* Google Sign-in */}
        <motion.button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm mb-5"
          style={{
            background: "var(--bg-card)",
            border: "1.5px solid var(--border)",
            color: "var(--text)",
            boxShadow: "var(--shadow-sm)",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GoogleIcon />
          Masuk dengan Google
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: "var(--border-light)" }} />
          <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>atau</span>
          <div className="flex-1 h-px" style={{ background: "var(--border-light)" }} />
        </div>

        {/* Mode tabs */}
        <motion.div
          className="flex gap-1 p-1 rounded-2xl mb-5"
          style={{ background: "var(--border-light)" }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {(["login", "register"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(null); }}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all relative"
              style={{ color: mode === m ? "var(--text)" : "var(--text-muted)" }}
            >
              {mode === m && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 rounded-xl bg-white"
                  style={{ boxShadow: "var(--shadow-sm)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{m === "login" ? "Masuk" : "Daftar"}</span>
            </button>
          ))}
        </motion.div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence>
            {mode === "register" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <InputField
                  id="name"
                  type="text"
                  value={name}
                  onChange={(v) => setName(v)}
                  placeholder="Nama Lengkap"
                  icon={<User className="w-4 h-4" />}
                  autoComplete="name"
                  required
                />
              </motion.div>
            )}
          </AnimatePresence>

          <InputField
            id="email"
            type="email"
            value={email}
            onChange={(v) => setEmail(v)}
            placeholder="Email"
            icon={<Mail className="w-4 h-4" />}
            autoComplete="email"
            required
          />

          <InputField
            id="password"
            type="password"
            value={password}
            onChange={(v) => setPassword(v)}
            placeholder="Password (min. 6 karakter)"
            icon={<Lock className="w-4 h-4" />}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            minLength={6}
          />

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-start gap-2 p-3 rounded-xl text-sm font-medium"
                style={{ background: "rgba(239,68,68,0.08)", color: "#DC2626" }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 btn-cyan rounded-2xl text-sm mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  className="w-4 h-4 border-[2.5px] border-white/40 rounded-full border-t-white"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Memproses...
              </span>
            ) : mode === "login" ? (
              "Masuk"
            ) : (
              "Daftar Sekarang"
            )}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
}

function InputField({
  id,
  type,
  value,
  onChange,
  placeholder,
  icon,
  autoComplete,
  required,
  minLength,
}: {
  id: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div className="relative">
      <div
        className="absolute left-4 top-1/2 -translate-y-1/2"
        style={{ color: "var(--text-muted)" }}
      >
        {icon}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        minLength={minLength}
        className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-sm font-medium outline-none transition-all"
        style={{
          background: "var(--bg-card)",
          border: "1.5px solid var(--border)",
          color: "var(--text)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--cyan)";
          e.currentTarget.style.boxShadow = "0 0 0 4px var(--cyan-glow)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function formatFirebaseError(err: unknown): string {
  const code = (err as { code?: string }).code ?? "";
  const map: Record<string, string> = {
    "auth/user-not-found": "Email tidak ditemukan.",
    "auth/wrong-password": "Password salah.",
    "auth/invalid-credential": "Email atau password salah.",
    "auth/email-already-in-use": "Email sudah terdaftar. Coba masuk.",
    "auth/weak-password": "Password terlalu lemah (minimal 6 karakter).",
    "auth/invalid-email": "Format email tidak valid.",
    "auth/too-many-requests": "Terlalu banyak percobaan. Coba lagi nanti.",
    "auth/network-request-failed": "Gagal terhubung ke server. Cek koneksi Anda.",
    "auth/popup-blocked": "Popup diblokir. Izinkan popup dari browser.",
  };
  return map[code] ?? "Terjadi kesalahan. Silakan coba lagi.";
}
