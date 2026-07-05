import "./BottomNav.css";

export type WorkerTab = "home" | "history" | "profile";

interface BottomNavProps {
  active: WorkerTab;
  onChange: (tab: WorkerTab) => void;
}

function IconHome() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12L12 3L21 12V20C21 20.55 20.55 21 20 21H15V16H9V21H4C3.45 21 3 20.55 3 20V12Z"/>
    </svg>
  );
}

function IconHistory() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 5H7C5.9 5 5 5.9 5 7V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V7C19 5.9 18.1 5 17 5H15"/>
      <path d="M9 5C9 4.45 9.45 4 10 4H14C14.55 4 15 4.45 15 5C15 5.55 14.55 6 14 6H10C9.45 6 9 5.55 9 5Z"/>
      <line x1="12" y1="11" x2="15" y2="11"/>
      <line x1="12" y1="15" x2="15" y2="15"/>
      <circle cx="9" cy="11" r="0.5" fill="currentColor"/>
      <circle cx="9" cy="15" r="0.5" fill="currentColor"/>
    </svg>
  );
}

function IconProfile() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21V19C20 16.79 18.21 15 16 15H8C5.79 15 4 16.79 4 19V21"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Navigasi utama">
      <button
        type="button"
        className={`bottom-nav__item ${active === "home" ? "is-active" : ""}`}
        onClick={() => onChange("home")}
        aria-current={active === "home" ? "page" : undefined}
      >
        <IconHome />
        <span>Home</span>
      </button>
      <button
        type="button"
        className={`bottom-nav__item ${active === "history" ? "is-active" : ""}`}
        onClick={() => onChange("history")}
        aria-current={active === "history" ? "page" : undefined}
      >
        <IconHistory />
        <span>Riwayat</span>
      </button>
      <button
        type="button"
        className={`bottom-nav__item ${active === "profile" ? "is-active" : ""}`}
        onClick={() => onChange("profile")}
        aria-current={active === "profile" ? "page" : undefined}
      >
        <IconProfile />
        <span>Profil</span>
      </button>
    </nav>
  );
}
