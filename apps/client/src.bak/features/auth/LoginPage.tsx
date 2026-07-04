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
          {mode === "login" ? "Selamat\nDatang! 👋" : "Buat\nAkun Baru ✨"}
        </p>
        <p className="login-page__subtitle">
          {mode === "login"
            ? "Masuk untuk melanjutkan ke BÖH Hizmet."
            : "Daftar dan nikmati layanan on-demand Bartın."}
        </p>
        <div className="login-page__illustration">
          <CustomerCharacter />
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
            {loading ? "Memproses..." : mode === "login" ? "Masuk" : "Buat Akun"}
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

function CustomerCharacter() {
  return (
    <svg width="108" height="128" viewBox="0 0 108 128" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Shadow */}
      <ellipse cx="54" cy="124" rx="30" ry="5" fill="#1a1a2e" opacity="0.08"/>
      {/* Legs */}
      <rect x="30" y="96" width="18" height="26" rx="9" fill="#1a1a2e"/>
      <rect x="60" y="96" width="18" height="26" rx="9" fill="#1a1a2e"/>
      {/* Shoes */}
      <ellipse cx="39" cy="122" rx="13" ry="6" fill="#333"/>
      <ellipse cx="69" cy="122" rx="13" ry="6" fill="#333"/>
      {/* Body - white top */}
      <path d="M24 58 C16 62 14 70 14 78 L14 100 L94 100 L94 78 C94 70 92 62 84 58 L70 50 L54 58 L38 50 Z" fill="white"/>
      {/* Lime V-neck detail */}
      <path d="M40 54 L54 68 L68 54 L63 50 L54 60 L45 50 Z" fill="#caef45"/>
      {/* Neck */}
      <rect x="48" y="46" width="14" height="14" rx="6" fill="#FDDBB4"/>
      {/* Left arm holding phone */}
      <path d="M24 64 C14 70 10 80 8 90" stroke="#FDDBB4" strokeWidth="13" strokeLinecap="round" fill="none"/>
      <ellipse cx="8" cy="92" rx="8" ry="7" fill="#FDDBB4"/>
      {/* Phone */}
      <rect x="0" y="78" width="16" height="26" rx="4" fill="#1a1a2e"/>
      <rect x="2" y="80" width="12" height="20" rx="3" fill="#caef45"/>
      <rect x="4" y="82" width="8" height="2" rx="1" fill="rgba(26,26,46,0.25)"/>
      <rect x="4" y="86" width="6" height="2" rx="1" fill="rgba(26,26,46,0.2)"/>
      <circle cx="8" cy="92" r="2" fill="rgba(26,26,46,0.2)"/>
      {/* Right arm */}
      <path d="M84 64 C94 70 98 78 96 88" stroke="#FDDBB4" strokeWidth="13" strokeLinecap="round" fill="none"/>
      <ellipse cx="97" cy="89" rx="7" ry="7" fill="#FDDBB4"/>
      {/* Hair back */}
      <ellipse cx="54" cy="28" rx="24" ry="26" fill="#1a1a2e"/>
      {/* Head */}
      <ellipse cx="54" cy="30" rx="22" ry="24" fill="#FDDBB4"/>
      {/* Hair top */}
      <path d="M32 24 C32 6 76 6 76 24 L74 18 C72 4 36 4 34 18 Z" fill="#1a1a2e"/>
      {/* Hair sides */}
      <path d="M32 22 C28 30 28 46 32 56 L35 54 C32 46 31 32 34 24 Z" fill="#1a1a2e"/>
      <path d="M76 22 C80 30 80 46 76 56 L73 54 C76 46 77 32 74 24 Z" fill="#1a1a2e"/>
      {/* Ears */}
      <ellipse cx="32" cy="30" rx="4" ry="5" fill="#FDDBB4"/>
      <ellipse cx="76" cy="30" rx="4" ry="5" fill="#FDDBB4"/>
      {/* Eyes */}
      <ellipse cx="45" cy="28" rx="5" ry="5.5" fill="#1a1a2e"/>
      <ellipse cx="63" cy="28" rx="5" ry="5.5" fill="#1a1a2e"/>
      <circle cx="46.5" cy="26.5" r="1.8" fill="white"/>
      <circle cx="64.5" cy="26.5" r="1.8" fill="white"/>
      {/* Eyebrows */}
      <path d="M40 21 Q45 18 50 21" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <path d="M58 21 Q63 18 68 21" stroke="#1a1a2e" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Nose */}
      <path d="M51 35 Q54 38 57 35" stroke="#c97240" strokeWidth="1.5" fill="none" opacity="0.6"/>
      {/* Smile */}
      <path d="M45 41 Q54 48 63 41" stroke="#c97240" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      {/* Teeth */}
      <path d="M47 42 Q54 47 61 42 Q54 48 47 42 Z" fill="white" opacity="0.8"/>
      {/* Blush */}
      <ellipse cx="38" cy="36" rx="6" ry="3.5" fill="#FFB5B5" opacity="0.45"/>
      <ellipse cx="70" cy="36" rx="6" ry="3.5" fill="#FFB5B5" opacity="0.45"/>
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
