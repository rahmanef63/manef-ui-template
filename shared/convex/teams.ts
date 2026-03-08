import { makeFunctionReference } from "convex/server";
import type { Id } from "@/shared/types/convex";
import type { Permission } from "@/shared/types/permissions";
import type { TeamSummary } from "@/shared/types/teams";

export const listTeamsRef = makeFunctionReference<
  "query",
  Record<string, never>,
  TeamSummary[] | null
>("users/teams:list");

export const viewerPermissionsRef = makeFunctionReference<
  "query",
  { teamId?: Id<"teams"> },
  Permission[] | null
>("users/teams/members:viewerPermissions");

export const deleteTeamRef = makeFunctionReference<
  "mutation",
  { teamId: Id<"teams"> },
  void
>("users/teams:deleteTeam");

export const createTeamRef = makeFunctionReference<
  "mutation",
  { name: string },
  string
>("users/teams:create");
