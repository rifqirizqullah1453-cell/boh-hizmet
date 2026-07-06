import { getAuth, signOut } from "firebase/auth";
import { LayoutDashboard, ShoppingBag, Users, LogOut, Wrench, HardHat } from "lucide-react";

export type Page = "dashboard" | "orders" | "users" | "workers";

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard",  icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: "orders",    label: "Orders",     icon: <ShoppingBag className="w-4 h-4" /> },
  { id: "users",     label: "Users",      icon: <Users className="w-4 h-4" /> },
  { id: "workers",   label: "Workers",    icon: <HardHat className="w-4 h-4" /> },
];

interface SidebarProps {
  page: Page;
  onChangePage: (p: Page) => void;
}

export function Sidebar({ page, onChangePage }: SidebarProps) {
  return (
    <aside
      className="fixed left-0 top-0 h-full w-56 flex flex-col py-6 px-3 z-20"
      style={{ background: "var(--sidebar)", borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="w-8 h-8 rounded-lg gradient-cyan flex items-center justify-center">
          <Wrench className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-white font-black text-sm leading-none">BÖH Hizmet</p>
          <p className="text-xs mt-0.5 font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangePage(item.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left"
            style={
              page === item.id
                ? { background: "var(--sidebar-active)", color: "var(--cyan-light)" }
                : { color: "rgba(255,255,255,0.5)" }
            }
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      <button
        onClick={() => signOut(getAuth())}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        <LogOut className="w-4 h-4" />
        Keluar
      </button>
    </aside>
  );
}
