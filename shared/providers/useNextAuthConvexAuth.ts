"use client";

import { useSession } from "next-auth/react";
import { useEffectEvent } from "react";

export function useNextAuthConvexAuth() {
  const { data: session, status } = useSession();

  const fetchAccessToken = useEffectEvent(
    async (_args: { forceRefreshToken: boolean }) => {
      if (!session?.user?.email) {
        return null;
      }

      const response = await fetch("/api/convex-auth/token", {
        cache: "no-store",
        credentials: "same-origin",
      });

      if (!response.ok) {
        return null;
      }

      const payload = (await response.json()) as { token?: string };
      return payload.token ?? null;
    },
  );

  return {
    fetchAccessToken,
    isAuthenticated: !!session?.user?.email,
    isLoading: status === "loading",
  };
}
