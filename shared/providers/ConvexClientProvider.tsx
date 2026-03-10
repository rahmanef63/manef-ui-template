"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { SessionProvider } from "next-auth/react";
import { useMemo, type ReactNode } from "react";
import { resolveConvexUrl } from "@/lib/convex/url";
import { ErrorBoundary } from "@/shared/errors/ErrorBoundary";

function ConvexProviderSafe({ children }: { children: ReactNode }) {
  const url = resolveConvexUrl(process.env.NEXT_PUBLIC_CONVEX_URL);

  const client = useMemo(() => {
    try {
      return new ConvexReactClient(url);
    } catch (error) {
      console.error("[ConvexClientProvider] Failed to create Convex client", {
        url,
        error,
      });
      return null;
    }
  }, [url]);

  if (!client) {
    return (
      <div className="m-4 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        Gagal menginisialisasi koneksi data (Convex). Cek NEXT_PUBLIC_CONVEX_URL.
      </div>
    );
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <SessionProvider>
        <ConvexProviderSafe>{children}</ConvexProviderSafe>
      </SessionProvider>
    </ErrorBoundary>
  );
}
