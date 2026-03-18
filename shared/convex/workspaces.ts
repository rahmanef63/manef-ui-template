// @ts-nocheck
import { typedApi } from "@/shared/convex/api";

export const listWorkspacesRef = typedApi.users.workspaces.list;
export const viewerPermissionsRef = typedApi.users.workspaces.members.viewerPermissions;
export const deleteWorkspaceRef = typedApi.users.workspaces.deleteWorkspace;
export const createWorkspaceRef = typedApi.users.workspaces.create;
