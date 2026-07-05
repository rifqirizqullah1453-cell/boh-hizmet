import { motion, AnimatePresence } from "framer-motion";
import { Home, ClipboardList, Wallet, User } from "lucide-react";
import { useOrders } from "../features/orders/OrderContext";

export type WorkerTab = "home" | "history" | "earnings" | "profile";

interface BottomNavProps {
  active: WorkerTab;
  onChange: (tab: WorkerTab) => void;
}

function NavTab({
  id,
  label,
  Icon,
  active,
  badge,
  onChange,
}: {
  id: WorkerTab;
  label: string;
  Icon: typeof Home;
  active: WorkerTab;
  badge?: number;
  onChange: (tab: WorkerTab) => void;
}) {
  const isActive = active === id;
  return (
    <button
      type="button"
      onClick={() => onChange(id)}
      aria-current={isActive ? "page" : undefined}
      className="relative flex flex-col items-center gap-1 px-5 py-1.5 rounded-2xl transition-colors"
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
        className="relative"
      >
        <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
        <AnimatePresence>
          {badge != null && badge > 0 && (
            <motion.span
              key="badge"
              className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-amber-400 flex items-center justify-center text-[9px] font-black text-white border border-white/20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              {badge > 9 ? "9+" : badge}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <span
        className="text-[10px] font-bold relative z-10"
        style={{ color: isActive ? "var(--cyan)" : "var(--text-muted)" }}
      >
        {label}
      </span>
    </button>
  );
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  const { pendingOrders } = useOrders();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 nav-glass"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Navigasi utama"
    >
      <div className="flex items-center justify-around px-2 py-3 max-w-lg mx-auto">
        <NavTab id="home" label="Home" Icon={Home} active={active} badge={pendingOrders.length} onChange={onChange} />
        <NavTab id="history" label="Riwayat" Icon={ClipboardList} active={active} onChange={onChange} />
        <NavTab id="earnings" label="Pendapatan" Icon={Wallet} active={active} onChange={onChange} />
        <NavTab id="profile" label="Profil" Icon={User} active={active} onChange={onChange} />
      </div>
    </nav>
  );
}
