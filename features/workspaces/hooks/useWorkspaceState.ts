import { useQuery } from "convex/react";
import type { UsePaginatedQueryResult } from "convex/react";
import { debugClient } from "@/lib/debug/client";
import { useParams } from "next/navigation";
import { useEffect, useRef, useMemo } from "react";
import { listWorkspacesRef, viewerPermissionsRef } from "@/shared/convex/workspaces";
import type { WorkspaceSummary } from "@/shared/types/workspaces";

export function useWorkspaceRouteState() {
  const params = useParams();
  const workspaceSlug =
    typeof params?.workspaceSlug === "string" ? params.workspaceSlug : undefined;
  const rawWorkspaces = useQuery(listWorkspacesRef);
  const { value: workspaces } = useStaleValue(rawWorkspaces);
  const fallbackWorkspace =
    workspaces?.find((workspace: WorkspaceSummary) => workspace.isPersonal) ??
    workspaces?.[0];
  const currentWorkspace = workspaces?.find(
    (workspace: WorkspaceSummary) => workspace.slug === workspaceSlug,
  );

  const state = {
    currentWorkspace,
    fallbackWorkspace,
    isEmpty: Array.isArray(workspaces) && workspaces.length === 0,
    isLoading: rawWorkspaces === undefined && workspaces === undefined,
    isMissing:
      workspaces !== undefined &&
      Array.isArray(workspaces) &&
      workspaces.length > 0 &&
      workspaceSlug !== undefined &&
      currentWorkspace === undefined,
    workspaces,
    workspaceSlug,
  };

  useEffect(() => {
    debugClient("workspace.route-state", {
      currentWorkspaceSlug: state.currentWorkspace?.slug ?? null,
      fallbackWorkspaceSlug: state.fallbackWorkspace?.slug ?? null,
      isEmpty: state.isEmpty,
      isLoading: state.isLoading,
      isMissing: state.isMissing,
      workspaceCount: state.workspaces?.length ?? null,
      workspaceSlug: state.workspaceSlug ?? null,
    });
  }, [
    state.currentWorkspace?.slug,
    state.fallbackWorkspace?.slug,
    state.isEmpty,
    state.isLoading,
    state.isMissing,
    state.workspaces?.length,
    state.workspaceSlug,
  ]);

  return state;
}

export function useCurrentWorkspace(): WorkspaceSummary | undefined {
  return useWorkspaceRouteState().currentWorkspace;
}

export function useViewerPermissions() {
  const workspace = useCurrentWorkspace();
  const permissions = useQuery(
    viewerPermissionsRef,
    workspace == null ? "skip" : { workspaceId: workspace._id },
  );

  useEffect(() => {
    debugClient("workspace.permissions", {
      permissionCount: permissions?.length ?? null,
      workspaceId: workspace?._id ?? null,
      workspaceSlug: workspace?.slug ?? null,
    });
  }, [permissions?.length, workspace?._id, workspace?.slug]);

  return useMemo(() => {
    return permissions == null ? null : new Set(permissions);
  }, [permissions]);
}

export function useStaleValue<T>(value: T | undefined) {
  const stored = useRef(value);
  if (value !== undefined) {
    stored.current = value;
  }
  return { value: stored.current, stale: value !== stored.current };
}

export function useStalePaginationValue<T>(value: UsePaginatedQueryResult<T>) {
  const stored = useRef(value);
  if (value.results.length > 0 || !value.isLoading) {
    stored.current = value;
  }
  return { value: stored.current, stale: value !== stored.current };
}
