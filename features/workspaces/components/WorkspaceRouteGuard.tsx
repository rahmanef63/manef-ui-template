"use client";

import { WorkspaceErrorState } from "@/features/workspaces/components/WorkspaceErrorState";
import { useWorkspaceRouteState } from "@/features/workspaces/hooks/useWorkspaceState";
import { useOpenClawNavigator } from "@/features/workspaces/hooks/useOpenClawNavigator";
import { useParams, usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function WorkspaceRouteGuard({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const { fallbackWorkspace, isEmpty, isLoading, isMissing } =
    useWorkspaceRouteState();
  const navigator = useOpenClawNavigator();
  const workspaceSlug =
    typeof params?.workspaceSlug === "string" ? params.workspaceSlug : undefined;

  const matchesOpenClawScope =
    !!workspaceSlug &&
    navigator.roots.some(
      (root) =>
        root.slug === workspaceSlug ||
        root.children.some((child) => child.slug === workspaceSlug),
    );

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

  if (!isMissing || matchesOpenClawScope) {
    return <>{children}</>;
  }

  const pathSuffix = pathname.split("/").slice(3).join("/");
  const recoverySlug = navigator.defaultScopeSlug ?? fallbackWorkspace?.slug;
  const recoveryHref = recoverySlug
    ? `/dashboard/${recoverySlug}${pathSuffix ? `/${pathSuffix}` : ""}`
    : undefined;

  return (
    <WorkspaceErrorState
      code="WORKSPACE_NOT_FOUND"
      recoveryHref={recoveryHref}
      recoveryLabel={
        recoverySlug
          ? `Buka ${recoverySlug === fallbackWorkspace?.slug ? fallbackWorkspace?.name ?? recoverySlug : recoverySlug}`
          : undefined
      }
    />
  );
}
