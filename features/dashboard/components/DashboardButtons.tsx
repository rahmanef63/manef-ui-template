"use client";

import { ErrorBoundary } from "@/shared/errors/ErrorBoundary";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "next-auth/react";

export function DashboardButtons() {
  const { status } = useSession();

  return (
    <ErrorBoundary>
      {status === "loading" ? (
        <div className="w-40 h-9" />
      ) : status === "authenticated" ? (
        <OpenDashboardLinkButton />
      ) : (
        <div className="flex gap-4 animate-[fade-in_0.2s]">
          <Link href="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link href="/dashboard">
            <Button>Dashboard</Button>
          </Link>
        </div>
      )}
    </ErrorBoundary>
  );
}

function OpenDashboardLinkButton() {
  return (
    <Link href="/dashboard" className="animate-[fade-in_0.2s]">
      <Button>Dashboard</Button>
    </Link>
  );
}
