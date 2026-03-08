"use client";

import { ClerkProvider, useAuth, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Authenticated, ConvexReactClient, useMutation } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useMediaQuery } from "usehooks-ts";
import { storeUserRef } from "@/shared/convex/users";
import { ErrorBoundary } from "@/shared/errors/ErrorBoundary";

// todo: Missing env validation - add typed env module
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  return (
    <ErrorBoundary>
      <ClerkProvider
        publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        appearance={{ baseTheme: prefersDarkMode ? dark : undefined }}
      >
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <Authenticated>
            <StoreUserInDatabase />
          </Authenticated>
          {children}
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

function StoreUserInDatabase() {
  const { user } = useUser();
  const storeUser = useMutation(storeUserRef);
  useEffect(() => {
    if (!user?.id) {
      return;
    }
    storeUser().catch((error: unknown) => {
      // eslint-disable-next-line no-console
      console.error("Failed to store user", error);
    });
  }, [storeUser, user?.id]);
  return null;
}
