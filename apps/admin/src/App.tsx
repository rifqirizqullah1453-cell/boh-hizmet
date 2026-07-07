import { useState } from "react";
import { getAuth } from "firebase/auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { trpc, createTrpcSetup } from "@boh/api";
import "./lib/firebaseClient";
import { useAuth } from "./hooks/useAuth";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { OrdersPage } from "./pages/OrdersPage";
import { UsersPage } from "./pages/UsersPage";
import { WorkersPage } from "./pages/WorkersPage";
import { Sidebar } from "./components/Sidebar";
import { BottomNav, type Page } from "./components/BottomNav";
import { Bell, Search } from "lucide-react";

const { queryClient, trpcClient } = createTrpcSetup({
  serverUrl: import.meta.env.VITE_SERVER_URL ?? "http://localhost:4000",
  getToken: () => getAuth().currentUser?.getIdToken() ?? Promise.resolve(null),
});

const pageTitles: Record<Page, string> = {
  dashboard: "BÖH Hizmet",
  orders:    "Manajemen Pesanan",
  users:     "Manajemen Pengguna",
  workers:   "Pekerja",
};

function AdminApp() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState<Page>("dashboard");

  const meQuery = trpc.auth.me.useQuery(undefined, { enabled: !!user });
  const isAdmin = meQuery.data?.role === "admin";

  if (loading || (user && meQuery.isLoading)) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "var(--surface)" }}>
        <div
          className="w-9 h-9 rounded-full border-[3px]"
          style={{ borderColor: "var(--outline-variant)", borderTopColor: "var(--primary)", animation: "spin 1s linear infinite" }}
        />
      </div>
    );
  }

  if (!user || !isAdmin) return <LoginPage />;

  const isWorkers = page === "workers";
  const displayName = user.displayName ?? "Admin";
  const initials = displayName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div style={{ background: "var(--surface)" }}>
      {/* Desktop sidebar — hidden on mobile */}
      <Sidebar page={page} onChangePage={setPage} />

      {/* Main area offset by sidebar on desktop */}
      <main className={`md:ml-64 flex flex-col ${isWorkers ? "h-screen overflow-hidden" : "min-h-screen"}`}>
        {/* Sticky header inside main */}
        <header
          className="sticky top-0 z-40 h-16 flex items-center justify-between px-4 md:px-8 shrink-0"
          style={{
            background: "rgba(244,251,251,0.9)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(187,201,202,0.3)",
            boxShadow: "0 1px 8px rgba(22,29,29,0.04)",
          }}
        >
          {/* Left: mobile title / desktop search */}
          <div className="flex items-center gap-4">
            <p className="md:hidden text-base font-extrabold" style={{ color: "var(--primary)" }}>
              {pageTitles[page]}
            </p>
            <div className="relative hidden lg:block w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--outline)" }} />
              <input
                type="text"
                placeholder="Cari pesanan, pengguna..."
                className="w-full rounded-full pl-9 pr-4 py-2 text-sm outline-none transition-all"
                style={{ background: "var(--surface-container)", color: "var(--on-surface)", border: "none" }}
              />
            </div>
          </div>

          {/* Right: bell + user avatar */}
          <div className="flex items-center gap-1.5">
            <button
              className="p-2 rounded-full transition-all active:scale-95"
              style={{ color: "var(--on-surface-variant)" }}
            >
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-px h-6 mx-1" style={{ background: "rgba(187,201,202,0.4)" }} />
            <div className="hidden sm:flex flex-col items-end mr-2">
              <p className="text-xs font-bold leading-tight" style={{ color: "var(--on-surface)" }}>{displayName}</p>
              <p className="text-[10px]" style={{ color: "var(--primary)" }}>Super Admin</p>
            </div>
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                className="w-9 h-9 rounded-full object-cover border-2"
                style={{ borderColor: "var(--primary-container)" }}
              />
            ) : (
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white premium-gradient shrink-0">
                {initials}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <div className={isWorkers ? "flex-1 overflow-hidden" : "flex-1 pb-20 md:pb-0"}>
          {page === "dashboard" && <DashboardPage />}
          {page === "orders"    && <OrdersPage />}
          {page === "users"     && <UsersPage />}
          {page === "workers"   && <WorkersPage />}
        </div>
      </main>

      {/* Mobile bottom nav — hidden on desktop */}
      <div className="md:hidden">
        <BottomNav page={page} onChangePage={setPage} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AdminApp />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
