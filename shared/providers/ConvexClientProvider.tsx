"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithAuth } from "convex/react";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { ErrorBoundary } from "@/shared/errors/ErrorBoundary";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function useAuthFromSession() {
  const { data: session, status } = useSession();
  return useMemo(
    () => ({
      isLoading: status === "loading",
      isAuthenticated: status === "authenticated",
      fetchAccessToken: async () => {
        // For self-hosted Convex without Clerk JWT,
        // we use a simple token derived from session
        return session ? `session:${session.user?.email}` : null;
      },
    }),
    [session, status]
  );
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <SessionProvider>
        <ConvexProviderWithAuth client={convex} useAuth={useAuthFromSession}>
          {children}
        </ConvexProviderWithAuth>
      </SessionProvider>
    </ErrorBoundary>
  );
}
