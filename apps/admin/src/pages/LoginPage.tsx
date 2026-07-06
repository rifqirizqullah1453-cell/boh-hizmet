import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signInWithEmailAndPassword(getAuth(), email, password);
    } catch {
      setError("Email atau password salah.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--sidebar)" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm mx-4"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-cyan mb-4">
            <span className="text-white font-black text-xl">BH</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">BÖH Hizmet</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.35)" }} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1.5px solid rgba(255,255,255,0.1)",
                color: "white",
              }}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.35)" }} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-11 pr-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1.5px solid rgba(255,255,255,0.1)",
                color: "white",
              }}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: "rgba(239,68,68,0.12)", color: "#FCA5A5" }}>
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm text-white gradient-cyan transition-all disabled:opacity-60"
            style={{ boxShadow: "0 4px 20px rgba(43,197,212,0.35)" }}
          >
            {loading ? "Masuk..." : "Masuk sebagai Admin"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
