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
import { Sidebar, type Page } from "./components/Sidebar";

const { queryClient, trpcClient } = createTrpcSetup({
  serverUrl: import.meta.env.VITE_SERVER_URL ?? "http://localhost:4000",
  getToken: () => getAuth().currentUser?.getIdToken() ?? Promise.resolve(null),
});

function AdminApp() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState<Page>("dashboard");

  const meQuery = trpc.auth.me.useQuery(undefined, { enabled: !!user });
  const isAdmin = meQuery.data?.role === "admin";

  if (loading || (user && meQuery.isLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--sidebar)" }}>
        <div className="w-8 h-8 rounded-full border-[3px]" style={{ borderColor: "rgba(255,255,255,0.2)", borderTopColor: "var(--cyan)", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  if (!user || !isAdmin) return <LoginPage />;

  const isFullHeight = page === "workers";

  return (
    <div className="flex min-h-screen">
      <Sidebar page={page} onChangePage={setPage} />
      <main
        className="flex-1 ml-56"
        style={{ background: "var(--bg)", ...(isFullHeight ? { height: "100vh", overflow: "hidden" } : {}) }}
      >
        {page === "dashboard" && <DashboardPage />}
        {page === "orders"    && <OrdersPage />}
        {page === "users"     && <UsersPage />}
        {page === "workers"   && <WorkersPage />}
      </main>
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
