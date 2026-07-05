import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { trpc, createTrpcSetup } from "@boh/api";
import "./lib/firestoreClient";
import { useAuth } from "./features/auth/useAuth";
import { LoginPage } from "./features/auth/LoginPage";
import { OrderProvider } from "./features/orders/OrderContext";
import { OrderAlert } from "./components/OrderAlert";
import { WorkerDashboard } from "./pages/WorkerDashboard";
import { HistoryPage } from "./pages/HistoryPage";
import { EarningsPage } from "./pages/EarningsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { BottomNav, type WorkerTab } from "./components/BottomNav";

const { queryClient, trpcClient } = createTrpcSetup({
  serverUrl: import.meta.env.VITE_SERVER_URL ?? "http://localhost:4000",
  getToken: () => getAuth().currentUser?.getIdToken() ?? Promise.resolve(null),
});

function WorkerApp() {
  const { user, loading } = useAuth();
  const register = trpc.auth.register.useMutation();
  const [tab, setTab] = useState<WorkerTab>("home");

  useEffect(() => {
    if (!user) return;
    const name = user.displayName ?? user.email?.split("@")[0] ?? "Pekerja";
    register.mutate({ name, role: "worker" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-hero">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 border-[3px] rounded-full"
            style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "white", animation: "spin 1s linear infinite" }}
          />
          <span className="text-white text-sm font-semibold">Memuat...</span>
        </div>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return (
    <OrderProvider>
      <OrderAlert />
      {tab === "home" && <WorkerDashboard />}
      {tab === "history" && <HistoryPage />}
      {tab === "earnings" && <EarningsPage />}
      {tab === "profile" && <ProfilePage />}
      <BottomNav active={tab} onChange={setTab} />
    </OrderProvider>
  );
}

export default function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <WorkerApp />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
