"use client";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function DashboardButtons() {
  const { status } = useSession();
  if (status === "loading") return <div className="w-40 h-9" />;
  if (status === "authenticated") {
    return (
      <Link href="/dashboard">
        <Button>Dashboard</Button>
      </Link>
    );
  }
  return (
    <div className="flex gap-4">
      <Link href="/login">
        <Button variant="ghost">Sign in</Button>
      </Link>
    </div>
  );
}
