import type { FC } from "react";
import { LayoutDashboard, ClipboardList, Users, HardHat } from "lucide-react";

export type Page = "dashboard" | "orders" | "users" | "workers";

interface Props {
  page: Page;
  onChangePage: (p: Page) => void;
}

const navItems: { page: Page; label: string; Icon: FC<{ className?: string }> }[] = [
  { page: "dashboard", label: "Dasbor",    Icon: LayoutDashboard },
  { page: "orders",    label: "Pesanan",   Icon: ClipboardList },
  { page: "users",     label: "Pengguna",  Icon: Users },
  { page: "workers",   label: "Pekerja",   Icon: HardHat },
];

export function BottomNav({ page, onChangePage }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-20 px-2 safe-area-bottom"
      style={{
        background: "var(--surface-container-lowest)",
        borderTop: "1px solid var(--outline-variant)",
        boxShadow: "0 -2px 12px rgba(25,28,29,0.06)",
      }}
    >
      {navItems.map(({ page: p, label, Icon }) => {
        const active = page === p;
        return (
          <button
            key={p}
            onClick={() => onChangePage(p)}
            className="flex flex-col items-center justify-center gap-1 flex-1 py-2 rounded-2xl mx-1 transition-all active:scale-95"
            style={
              active
                ? { background: "var(--primary-container)", color: "var(--on-primary-container)" }
                : { color: "var(--on-surface-variant)" }
            }
          >
            <Icon className="w-[22px] h-[22px]" />
            <span
              className="text-[11px] font-bold leading-none"
              style={active ? { color: "var(--on-primary-container)" } : { color: "var(--on-surface-variant)" }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
