import { useQuery } from "convex/react";
import type { UsePaginatedQueryResult } from "convex/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { listWorkspacesRef, viewerPermissionsRef } from "@/shared/convex/workspaces";
import type { WorkspaceSummary } from "@/shared/types/workspaces";

export function useCurrentWorkspace(): WorkspaceSummary | undefined {
  const router = useRouter();
  const pathname = usePathname();
  const { workspaceSlug } = useParams();
  const workspaces = useQuery(listWorkspacesRef);
  const currentWorkspace =
    workspaces?.find((workspace: WorkspaceSummary) => workspace.slug === workspaceSlug) ?? workspaces?.[0];
  useEffect(() => {
    if (currentWorkspace !== undefined && currentWorkspace.slug !== workspaceSlug) {
      router.push(
        `/dashboard/${currentWorkspace.slug}/${pathname
          .split("/")
          .slice(3)
          .join("/")}`
      );
    }
  }, [currentWorkspace, pathname, router, workspaceSlug]);
  return currentWorkspace;
}

export function useViewerPermissions() {
  const workspace = useCurrentWorkspace();
  const permissions = useQuery(viewerPermissionsRef, { workspaceId: workspace?._id });
  return permissions == null ? null : new Set(permissions);
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
