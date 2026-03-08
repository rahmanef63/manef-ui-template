import { useQuery } from "convex/react";
import type { UsePaginatedQueryResult } from "convex/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { listTeamsRef, viewerPermissionsRef } from "@/shared/convex/teams";
import type { TeamSummary } from "@/shared/types/teams";

export function useCurrentTeam(): TeamSummary | undefined {
  const router = useRouter();
  const pathname = usePathname();
  const { teamSlug } = useParams();
  const teams = useQuery(listTeamsRef);
  const currentTeam =
    teams?.find((team: TeamSummary) => team.slug === teamSlug) ?? teams?.[0];
  useEffect(() => {
    if (currentTeam !== undefined && currentTeam.slug !== teamSlug) {
      router.push(
        `/dashboard/${currentTeam.slug}/${pathname
          .split("/")
          .slice(3)
          .join("/")}`
      );
    }
  }, [currentTeam, pathname, router, teamSlug]);
  return currentTeam;
}

export function useViewerPermissions() {
  const team = useCurrentTeam();
  const permissions = useQuery(viewerPermissionsRef, { teamId: team?._id });
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
