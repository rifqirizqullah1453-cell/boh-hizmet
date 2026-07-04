import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { trpc, createTrpcSetup } from "@boh/api";
import "./lib/firestoreClient";
import { useAuth } from "./features/auth/useAuth";
import { LoginPage } from "./features/auth/LoginPage";
import { OrderProvider } from "./features/orders/OrderContext";
import { WorkerDashboard } from "./pages/WorkerDashboard";

const { queryClient, trpcClient } = createTrpcSetup({
  serverUrl: import.meta.env.VITE_SERVER_URL ?? "http://localhost:4000",
  getToken: () => getAuth().currentUser?.getIdToken() ?? Promise.resolve(null),
});

function WorkerApp() {
  const { user, loading } = useAuth();
  const register = trpc.auth.register.useMutation();

  useEffect(() => {
    if (!user) return;
    const name = user.displayName ?? user.email?.split("@")[0] ?? "Pekerja";
    // Worker app always registers with role: "worker". The server only applies
    // the role if the MySQL row is still at the "customer" default (i.e. this
    // is the user's very first login), so repeated calls are safe.
    register.mutate({ name, role: "worker" });
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

  return (
    <OrderProvider>
      <WorkerDashboard />
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
