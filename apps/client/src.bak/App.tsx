import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { trpc, createTrpcSetup } from "@boh/api";
import type { CreateOrderInput } from "@boh/contracts";
// Ensures Firebase app + Auth emulator are initialized before any auth op.
import "./lib/firestoreClient";
import { useAuth } from "./features/auth/useAuth";
import { LoginPage } from "./features/auth/LoginPage";
import { Home } from "./pages/Home";
import { CreateOrder } from "./pages/CreateOrder";
import { TrackOrder } from "./pages/TrackOrder";
import { OrderHistory } from "./pages/OrderHistory";
import { BottomNav, type TabName } from "./components/BottomNav";

const { queryClient, trpcClient } = createTrpcSetup({
  serverUrl: import.meta.env.VITE_SERVER_URL ?? "http://localhost:4000",
  // getToken is called right before each request — getAuth().currentUser is
  // always the live Firebase user at that moment, so no stale-token risk.
  getToken: () => getAuth().currentUser?.getIdToken() ?? Promise.resolve(null),
});

type Page =
  | { name: "home" }
  | { name: "create"; serviceType: CreateOrderInput["serviceType"] }
  | { name: "track"; orderId: string }
  | { name: "orders" }
  | { name: "profile" };

function AuthenticatedApp() {
  const [page, setPage] = useState<Page>({ name: "home" });
  const [activeTab, setActiveTab] = useState<TabName>("home");

  const handleTabChange = (tab: TabName) => {
    setActiveTab(tab);
    if (tab === "home") setPage({ name: "home" });
    else if (tab === "orders") setPage({ name: "orders" });
    else setPage({ name: "profile" });
  };

  const handleSelectService = (serviceType: CreateOrderInput["serviceType"]) => {
    setPage({ name: "create", serviceType });
  };

  const handleOrderCreated = (orderId: string) => {
    setPage({ name: "track", orderId });
  };

  const handleViewOrder = (orderId: string) => {
    setPage({ name: "track", orderId });
  };

  const handleBackToHome = () => {
    setPage({ name: "home" });
    setActiveTab("home");
  };

  const handleBackFromTrack = () => {
    if (activeTab === "orders") setPage({ name: "orders" });
    else if (activeTab === "profile") setPage({ name: "profile" });
    else setPage({ name: "home" });
  };

  const showBottomNav = page.name !== "track";

  return (
    <div className="app-shell">
      <main className={`app-main ${showBottomNav ? "app-main--with-nav" : ""}`}>
        {page.name === "home" && <Home onSelectService={handleSelectService} />}
        {page.name === "create" && (
          <CreateOrder
            initialServiceType={page.serviceType}
            onCreated={handleOrderCreated}
            onBack={handleBackToHome}
          />
        )}
        {page.name === "track" && <TrackOrder orderId={page.orderId} onBack={handleBackFromTrack} />}
        {page.name === "orders" && <OrderHistory onSelectOrder={handleViewOrder} />}
        {page.name === "profile" && (
          <div className="placeholder-page">
            <p>👤</p>
            <p>Halaman profil akan segera hadir.</p>
          </div>
        )}
      </main>
      {showBottomNav && <BottomNav activeTab={activeTab} onChange={handleTabChange} />}
    </div>
  );
}

function AppInner() {
  const { user, loading } = useAuth();
  const register = trpc.auth.register.useMutation();

  // After Firebase login, sync the canonical name and role to MySQL.
  // This is idempotent and runs every time the Firebase user changes
  // (including on reload) — the server only updates role if it's still
  // the "customer" default, so repeated calls are safe.
  useEffect(() => {
    if (!user) return;
    const name =
      user.displayName ?? user.email?.split("@")[0] ?? "Pelanggan";
    register.mutate({ name, role: "customer" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="app-loading">
        <span>Memuat...</span>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return <AuthenticatedApp />;
}

export default function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppInner />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
