"use client";

import { Authenticated, ConvexProviderWithAuth, ConvexReactClient, useMutation } from "convex/react";
import { SessionProvider, useSession } from "next-auth/react";
import { useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import { storeUserRef } from "@/shared/convex/users";
import { ErrorBoundary } from "@/shared/errors/ErrorBoundary";

// todo: Missing env validation - add typed env module
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <SessionProvider>
        <ConvexProviderWithAuth client={convex} useAuth={useConvexAuth}>
          <Authenticated>
            <StoreUserInDatabase />
          </Authenticated>
          {children}
        </ConvexProviderWithAuth>
      </SessionProvider>
    </ErrorBoundary>
  );
}

function useConvexAuth() {
  const { data: session, status } = useSession();
  const email = session?.user?.email;

  const fetchAccessToken = useCallback(async () => {
    if (email === undefined || email.length === 0) {
      return null;
    }
    return `session:${email}`;
  }, [email]);

  return {
    isLoading: status === "loading",
    isAuthenticated: email !== undefined && email.length > 0,
    fetchAccessToken,
  };
}

function StoreUserInDatabase() {
  const { data: session, status } = useSession();
  const email = session?.user?.email;
  const storeUser = useMutation(storeUserRef);

  useEffect(() => {
    if (status !== "authenticated" || email === undefined || email.length === 0) {
      return;
    }
    storeUser().catch((error: unknown) => {
      // eslint-disable-next-line no-console
      console.error("Failed to store user", error);
    });
  }, [email, status, storeUser]);

  return null;
}
