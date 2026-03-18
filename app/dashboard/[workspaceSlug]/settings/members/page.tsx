"use client";

import { useCurrentWorkspace } from "@/features/workspaces/hooks/useWorkspaceState";
import { SettingsMenuButton } from "@/features/settings/components/SettingsMenuButton";
import { AddMember } from "@/features/members/components/AddMember";
import { MembersList } from "@/features/members/components/MemberList";
import { ErrorBoundary } from "@/shared/errors/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MembersPage() {
  const workspace = useCurrentWorkspace();
  const router = useRouter();
  useEffect(() => {
    if (workspace?.isPersonal === true) {
      router.replace(`/dashboard/${workspace.slug}/settings`);
    }
  }, [workspace, router]);
  if (workspace == null) {
    return <MembersSkeleton />;
  }

  return (
    <>
      <div className="flex items-center mt-8">
        <SettingsMenuButton />
        <h1 className="text-4xl font-extrabold">Members</h1>
      </div>

      <ErrorBoundary>
        <AddMember />
      </ErrorBoundary>
      <ErrorBoundary>
        <MembersList />
      </ErrorBoundary>
    </>
  );
}

function MembersSkeleton() {
  return (
    <div className="space-y-6 py-8">
      <Skeleton className="h-10 w-56" />
      <div className="rounded-xl border p-6 space-y-3">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="rounded-xl border p-6 space-y-3">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
