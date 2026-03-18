"use client";

import { debugClient } from "@/lib/debug/client";
import { useSession } from "next-auth/react";
import { useCallback, useRef, useLayoutEffect, useEffect } from "react";

export function useNextAuthConvexAuth() {
  const { data: session, status } = useSession();

  useEffect(() => {
    debugClient("auth.session", {
      email: session?.user?.email ?? null,
      hasSession: !!session?.user?.email,
      status,
    });
  }, [session?.user?.email, status]);

  // Use a stable ref to avoid fetchAccessToken changing when session changes,
  // which can trigger Convex to re-auth in a loop.
  const sessionRef = useRef(session);
  useLayoutEffect(() => {
    sessionRef.current = session;
  }, [session]);

  const fetchAccessToken = useCallback(
    async (_args: { forceRefreshToken: boolean }) => {
      const currentSession = sessionRef.current;
      if (!currentSession?.user?.email) {
        debugClient("convex-auth.token.skip", {
          reason: "missing-session-email",
        });
        return null;
      }

      debugClient("convex-auth.token.request", {
        email: currentSession.user.email,
      });
      const response = await fetch("/api/convex-auth/token", {
        cache: "no-store",
        credentials: "same-origin",
      });

      if (!response.ok) {
        debugClient("convex-auth.token.response", {
          ok: false,
          status: response.status,
        });
        return null;
      }

      const payload = (await response.json()) as { token?: string };
      debugClient("convex-auth.token.response", {
        ok: true,
        status: response.status,
        hasToken: !!payload.token,
      });
      return payload.token ?? null;
    },
    [], // Fixed dependency to ensure Convex doesn't keep resetting the auth handler
  );

  return {
    fetchAccessToken,
    isAuthenticated: !!session?.user?.email,
    isLoading: status === "loading",
  };
}
