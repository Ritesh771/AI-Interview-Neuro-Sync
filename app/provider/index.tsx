"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode, memo } from "react";

// Create a stable QueryClient instance outside component to prevent recreation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const QueryProvider = memo(({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
));

QueryProvider.displayName = 'QueryProvider';

const SessionProvider = memo(({ children }: { children: ReactNode }) => (
  <NextAuthSessionProvider
    refetchInterval={0}
    refetchOnWindowFocus={false}
    refetchWhenOffline={false}
  >
    {children}
  </NextAuthSessionProvider>
));

SessionProvider.displayName = 'SessionProvider';

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </SessionProvider>
  )
}
