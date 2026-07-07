import { LayoutDashboard, ClipboardList, Users, HardHat, LogOut } from "lucide-react";
import { getAuth } from "firebase/auth";
import type { FC } from "react";
import type { Page } from "./BottomNav";

const navItems: { page: Page; label: string; Icon: FC<{ className?: string }> }[] = [
  { page: "dashboard", label: "Dashboard",  Icon: LayoutDashboard },
  { page: "orders",    label: "Pesanan",    Icon: ClipboardList   },
  { page: "users",     label: "Pengguna",   Icon: Users           },
  { page: "workers",   label: "Pekerja",    Icon: HardHat         },
];

interface Props {
  page: Page;
  onChangePage: (p: Page) => void;
}

export function Sidebar({ page, onChangePage }: Props) {
  return (
    <aside
      className="hidden md:flex h-screen w-64 fixed left-0 top-0 flex-col z-50"
      style={{
        background: "var(--surface-container-lowest)",
        borderRight: "1px solid rgba(187,201,202,0.25)",
        boxShadow: "4px 0 24px rgba(0,0,0,0.04)",
      }}
    >
      {/* Logo */}
      <div className="px-6 pt-7 pb-6">
        <h1 className="text-xl font-extrabold tracking-tight" style={{ color: "var(--primary)" }}>
          BÖH Hizmet
        </h1>
        <p
          className="text-[10px] font-semibold uppercase tracking-widest mt-0.5"
          style={{ color: "var(--on-surface-variant)", opacity: 0.7 }}
        >
          Admin Console
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ page: p, label, Icon }) => {
          const active = page === p;
          return (
            <button
              key={p}
              onClick={() => onChangePage(p)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
              style={
                active
                  ? { background: "rgba(56,209,218,0.15)", color: "var(--primary)" }
                  : { color: "var(--on-surface-variant)" }
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-6 pt-4" style={{ borderTop: "1px solid rgba(187,201,202,0.2)" }}>
        <button
          onClick={() => getAuth().signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
          style={{ color: "var(--on-surface-variant)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(186,26,26,0.06)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
