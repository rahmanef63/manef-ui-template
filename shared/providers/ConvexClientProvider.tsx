"use client";

import { ConvexReactClient, ConvexProviderWithAuth } from "convex/react";
import { SessionProvider, useSession } from "next-auth/react";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { ErrorBoundary } from "@/shared/errors/ErrorBoundary";

function useAuthFromSession() {
  const { data: session, status } = useSession();
  return useMemo(
    () => ({
      isLoading: status === "loading",
      isAuthenticated: status === "authenticated",
      fetchAccessToken: async () =>
        session?.user?.email ? `session:${session.user.email}` : null,
    }),
    [session, status]
  );
}

function ConvexProviderMaybe({ children }: { children: ReactNode }) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;

  // Avoid build-time crash when env is missing in CI/Nixpacks.
  if (!url) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn("NEXT_PUBLIC_CONVEX_URL is missing. Rendering without Convex provider.");
    }
    return <>{children}</>;
  }

  const client = new ConvexReactClient(url);
  return <ConvexProviderWithAuth client={client} useAuth={useAuthFromSession}>{children}</ConvexProviderWithAuth>;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <SessionProvider>
        <ConvexProviderMaybe>{children}</ConvexProviderMaybe>
      </SessionProvider>
    </ErrorBoundary>
  );
}
