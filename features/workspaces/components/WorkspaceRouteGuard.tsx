"use client";

import { WorkspaceErrorState } from "@/features/workspaces/components/WorkspaceErrorState";
import { useWorkspaceRouteState } from "@/features/workspaces/hooks/useWorkspaceState";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function WorkspaceRouteGuard({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const { fallbackWorkspace, isEmpty, isLoading, isMissing } =
    useWorkspaceRouteState();

  if (isLoading) {
    return <>{children}</>;
  }

  if (isEmpty) {
    return (
      <WorkspaceErrorState
        code="WORKSPACE_BOOTSTRAP_FAILED"
        backHref="/dashboard"
        backLabel="Muat ulang dashboard"
      />
    );
  }

  if (!isMissing) {
    return <>{children}</>;
  }

  const pathSuffix = pathname.split("/").slice(3).join("/");
  const recoveryHref = fallbackWorkspace
    ? `/dashboard/${fallbackWorkspace.slug}${pathSuffix ? `/${pathSuffix}` : ""}`
    : undefined;

  return (
    <WorkspaceErrorState
      code="WORKSPACE_NOT_FOUND"
      recoveryHref={recoveryHref}
      recoveryLabel={
        fallbackWorkspace ? `Buka ${fallbackWorkspace.name}` : undefined
      }
    />
  );
}
