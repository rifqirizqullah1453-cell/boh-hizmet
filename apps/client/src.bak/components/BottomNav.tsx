import "./BottomNav.css";

export type TabName = "home" | "orders" | "profile";

interface BottomNavProps {
  activeTab: TabName;
  onChange: (tab: TabName) => void;
}

const TABS: Array<{ id: TabName; label: string }> = [
  { id: "home", label: "Beranda" },
  { id: "orders", label: "Pesanan" },
  { id: "profile", label: "Profil" },
];

function TabIcon({ tab, active }: { tab: TabName; active: boolean }) {
  const color = active ? "var(--c-primary)" : "var(--c-text-3)";
  if (tab === "home") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 10.5L12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (tab === "orders") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="4" width="14" height="17" rx="2" stroke={color} strokeWidth="2" />
        <path d="M9 3h6v3H9z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        <path d="M8.5 12h7M8.5 16h4.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth="2" />
      <path d="M5 20c1.2-3.6 4-5.5 7-5.5s5.8 1.9 7 5.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`bottom-nav__item ${isActive ? "is-active" : ""}`}
            onClick={() => onChange(tab.id)}
          >
            <TabIcon tab={tab.id} active={isActive} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
