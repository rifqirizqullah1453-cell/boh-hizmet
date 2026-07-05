import { motion } from "framer-motion";
import { Home, ClipboardList, User } from "lucide-react";

export type WorkerTab = "home" | "history" | "profile";

interface BottomNavProps {
  active: WorkerTab;
  onChange: (tab: WorkerTab) => void;
}

const TABS: { id: WorkerTab; label: string; Icon: typeof Home }[] = [
  { id: "home", label: "Home", Icon: Home },
  { id: "history", label: "Riwayat", Icon: ClipboardList },
  { id: "profile", label: "Profil", Icon: User },
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 nav-glass"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Navigasi utama"
    >
      <div className="flex items-center justify-around px-2 py-3 max-w-lg mx-auto">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              aria-current={isActive ? "page" : undefined}
              className="relative flex flex-col items-center gap-1 px-6 py-1.5 rounded-2xl transition-colors"
              style={{ color: isActive ? "var(--cyan)" : "var(--text-muted)" }}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: "rgba(43,197,212,0.1)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                animate={{ scale: isActive ? 1.15 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              <span
                className="text-[10px] font-bold relative z-10"
                style={{ color: isActive ? "var(--cyan)" : "var(--text-muted)" }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
