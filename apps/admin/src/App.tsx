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
import { BottomNav, type Page } from "./components/BottomNav";
import { LogOut } from "lucide-react";

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
      <div
        className="min-h-dvh flex items-center justify-center"
        style={{ background: "var(--surface)" }}
      >
        <div
          className="w-9 h-9 rounded-full border-[3px]"
          style={{
            borderColor: "var(--outline-variant)",
            borderTopColor: "var(--primary)",
            animation: "spin 1s linear infinite",
          }}
        />
      </div>
    );
  }

  if (!user || !isAdmin) return <LoginPage />;

  const isWorkers = page === "workers";

  return (
    <div style={{ background: "var(--surface)", minHeight: "100dvh" }}>
      {/* Top App Bar */}
      <header
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 h-16"
        style={{
          background: "var(--surface-container-lowest)",
          borderBottom: "1px solid var(--outline-variant)",
          boxShadow: "0 1px 8px rgba(25,28,29,0.06)",
        }}
      >
        <h1
          className="text-[17px] font-extrabold tracking-tight"
          style={{ color: "var(--on-surface)" }}
        >
          {pageTitles[page]}
        </h1>
        <button
          onClick={() => getAuth().signOut()}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
          style={{ background: "var(--surface-container-low)" }}
          title="Keluar"
        >
          <LogOut className="w-4 h-4" style={{ color: "var(--on-surface-variant)" }} />
        </button>
      </header>

      {/* Page content */}
      <main
        className={
          isWorkers
            ? "fixed inset-0 pt-16 pb-20"
            : "pt-16 pb-24 min-h-dvh"
        }
      >
        {page === "dashboard" && <DashboardPage />}
        {page === "orders"    && <OrdersPage />}
        {page === "users"     && <UsersPage />}
        {page === "workers"   && <WorkersPage />}
      </main>

      <BottomNav page={page} onChangePage={setPage} />
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
