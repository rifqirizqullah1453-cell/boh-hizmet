import { useState, type FormEvent } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import "./LoginPage.css";

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
    <div className="login-page">
      <div className="login-page__hero">
        <p className="login-page__greeting">
          {mode === "login" ? "Halo,\nPekerja! 🛵" : "Bergabung\nSekarang! 🚀"}
        </p>
        <p className="login-page__subtitle">
          {mode === "login"
            ? "Masuk ke portal pekerja BÖH Hizmet."
            : "Daftar sebagai pekerja dan mulai terima pesanan."}
        </p>
        <div className="login-page__illustration">
          <WorkerCharacter />
        </div>
      </div>

      <div className="login-page__body">
        <button
          type="button"
          className="login-page__google-btn"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <GoogleIcon />
          Masuk dengan Google
        </button>

        <div className="login-page__divider">
          <span>atau</span>
        </div>

        <div className="login-page__tabs">
          <button
            type="button"
            className={`login-page__tab ${mode === "login" ? "is-active" : ""}`}
            onClick={() => { setMode("login"); setError(null); }}
          >
            Masuk
          </button>
          <button
            type="button"
            className={`login-page__tab ${mode === "register" ? "is-active" : ""}`}
            onClick={() => { setMode("register"); setError(null); }}
          >
            Daftar
          </button>
        </div>

        <form className="login-page__form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <div className="login-page__field">
              <label htmlFor="name">Nama Lengkap</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ahmed Yılmaz"
                required
                autoComplete="name"
              />
            </div>
          )}
          <div className="login-page__field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
              autoComplete="email"
            />
          </div>
          <div className="login-page__field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              required
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={6}
            />
          </div>

          {error && <p className="login-page__error">{error}</p>}

          <button type="submit" className="login-page__submit" disabled={loading}>
            {loading ? "Memproses..." : mode === "login" ? "Masuk" : "Daftar Sekarang"}
          </button>
        </form>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function WorkerCharacter() {
  return (
    <svg width="108" height="128" viewBox="0 0 108 128" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Shadow */}
      <ellipse cx="54" cy="124" rx="28" ry="5" fill="#1a1a2e" opacity="0.08"/>
      {/* Legs */}
      <rect x="30" y="96" width="18" height="26" rx="9" fill="#333"/>
      <rect x="60" y="96" width="18" height="26" rx="9" fill="#333"/>
      {/* Shoes */}
      <ellipse cx="39" cy="122" rx="13" ry="6" fill="#1a1a2e"/>
      <ellipse cx="69" cy="122" rx="13" ry="6" fill="#1a1a2e"/>
      {/* Body - dark shirt */}
      <path d="M24 58 C16 62 14 70 14 78 L14 100 L94 100 L94 78 C94 70 92 62 84 58 L70 50 L54 58 L38 50 Z" fill="#1a1a2e"/>
      {/* Lime safety vest - left panel */}
      <path d="M28 58 L28 100 L48 100 L48 58 L42 52 Z" fill="#caef45" opacity="0.95"/>
      {/* Lime safety vest - right panel */}
      <path d="M80 58 L80 100 L60 100 L60 58 L66 52 Z" fill="#caef45" opacity="0.95"/>
      {/* Reflective stripes */}
      <rect x="28" y="74" width="20" height="4" rx="2" fill="white" opacity="0.5"/>
      <rect x="60" y="74" width="20" height="4" rx="2" fill="white" opacity="0.5"/>
      <rect x="28" y="86" width="20" height="4" rx="2" fill="white" opacity="0.5"/>
      <rect x="60" y="86" width="20" height="4" rx="2" fill="white" opacity="0.5"/>
      {/* Neck */}
      <rect x="48" y="46" width="14" height="14" rx="6" fill="#D4956A"/>
      {/* Left arm raised — triumphant pose */}
      <path d="M24 64 C14 56 8 48 6 38" stroke="#D4956A" strokeWidth="13" strokeLinecap="round" fill="none"/>
      <ellipse cx="5" cy="36" rx="7" ry="7" fill="#D4956A"/>
      {/* Lime sleeve on left arm */}
      <path d="M24 64 C18 58 12 52 8 44" stroke="#caef45" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.85"/>
      {/* Right arm raised */}
      <path d="M84 64 C94 56 100 48 102 38" stroke="#D4956A" strokeWidth="13" strokeLinecap="round" fill="none"/>
      <ellipse cx="103" cy="36" rx="7" ry="7" fill="#D4956A"/>
      {/* Lime sleeve on right arm */}
      <path d="M84 64 C90 58 96 52 100 44" stroke="#caef45" strokeWidth="8" strokeLinecap="round" fill="none" opacity="0.85"/>
      {/* Head */}
      <ellipse cx="54" cy="30" rx="22" ry="24" fill="#D4956A"/>
      {/* White cap - dome */}
      <path d="M32 26 C32 8 76 8 76 26 L76 30 L32 30 Z" fill="white"/>
      {/* Cap seam */}
      <path d="M54 9 L54 30" stroke="#e5e7eb" strokeWidth="1.5" opacity="0.7"/>
      {/* Cap button */}
      <circle cx="54" cy="9" r="3" fill="#e5e7eb"/>
      {/* Cap brim */}
      <path d="M26 31 Q54 25 82 31 L80 37 Q54 32 28 37 Z" fill="white"/>
      {/* Brim underside shadow */}
      <path d="M28 36 Q54 32 80 36" stroke="#d1d5db" strokeWidth="1.5" fill="none"/>
      {/* Ears */}
      <ellipse cx="32" cy="30" rx="4" ry="5" fill="#D4956A"/>
      <ellipse cx="76" cy="30" rx="4" ry="5" fill="#D4956A"/>
      {/* Eyes — happy squint / smiling eyes */}
      <path d="M42 30 Q47 26 52 30" stroke="#1a1a2e" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      <path d="M56 30 Q61 26 66 30" stroke="#1a1a2e" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      {/* Eyebrows - confident arch */}
      <path d="M40 23 Q47 19 52 22" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M56 22 Q61 19 68 23" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Big smile */}
      <path d="M42 40 Q54 50 66 40" stroke="#c97240" strokeWidth="3" strokeLinecap="round" fill="none"/>
      {/* Teeth */}
      <path d="M44 41 Q54 49 64 41 Q54 50 44 41 Z" fill="white" opacity="0.9"/>
      {/* Blush */}
      <ellipse cx="37" cy="36" rx="7" ry="4" fill="#FFB5B5" opacity="0.4"/>
      <ellipse cx="71" cy="36" rx="7" ry="4" fill="#FFB5B5" opacity="0.4"/>
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
