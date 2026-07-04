import { httpBatchLink, TRPCClientError } from "@trpc/client";

export { TRPCClientError };
import { QueryClient } from "@tanstack/react-query";
import superjson from "superjson";
import { trpc } from "./trpc";

export interface CreateTrpcSetupOptions {
  /** e.g. "http://localhost:4000" — no trailing slash or /api/trpc suffix. */
  serverUrl: string;
  /**
   * Async function that returns the Firebase ID token for the current user,
   * or null when no user is signed in. Called before every tRPC request so
   * the token is always fresh (Firebase refreshes it transparently ~1h).
   */
  getToken?: () => Promise<string | null>;
}

/**
 * One factory shared by every frontend so the auth-header/transformer wiring
 * can't drift between apps — each app only supplies its own serverUrl and a
 * getToken callback backed by firebase.auth().currentUser.getIdToken().
 */
export function createTrpcSetup({ serverUrl, getToken }: CreateTrpcSetupOptions) {
  const queryClient = new QueryClient();

  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: `${serverUrl}/api/trpc`,
        transformer: superjson,
        async headers() {
          const token = getToken ? await getToken() : null;
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
      }),
    ],
  });

  return { queryClient, trpcClient };
}
