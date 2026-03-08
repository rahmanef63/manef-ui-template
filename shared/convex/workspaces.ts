import { makeFunctionReference } from "convex/server";
import type { Id } from "@/shared/types/convex";
import type { Permission } from "@/shared/types/permissions";
import type { WorkspaceSummary } from "@/shared/types/workspaces";

export const listWorkspacesRef = makeFunctionReference<
  "query",
  Record<string, never>,
  WorkspaceSummary[] | null
>("users/workspaces:list");

export const viewerPermissionsRef = makeFunctionReference<
  "query",
  { workspaceId?: Id<"workspaces"> },
  Permission[] | null
>("users/workspaces/members:viewerPermissions");

export const deleteWorkspaceRef = makeFunctionReference<
  "mutation",
  { workspaceId: Id<"workspaces"> },
  void
>("users/workspaces:deleteWorkspace");

export const createWorkspaceRef = makeFunctionReference<
  "mutation",
  { name: string },
  string
>("users/workspaces:create");
