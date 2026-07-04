import { trpc, createTrpcSetup } from '@boh/api';
import { auth } from '@/firebase/config';
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

const getToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    return await user.getIdToken();
  } catch {
    return null;
  }
};

const { queryClient, trpcClient } = createTrpcSetup({
  serverUrl: import.meta.env.VITE_SERVER_URL || 'http://localhost:4000',
  getToken,
});

export { trpc };

export function TRPCProvider({ children }: { children: ReactNode }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
