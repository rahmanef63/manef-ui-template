"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProvider } from "convex/react";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { ErrorBoundary } from "@/shared/errors/ErrorBoundary";

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
  // Do NOT use ConvexProviderWithAuth because this project doesn't fully configure Convex Auth.
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
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
