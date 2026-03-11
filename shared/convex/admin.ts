// @ts-nocheck
import { typedApi } from "@/shared/convex/api";

export const getUsersRef = typedApi.features.users.api.getUsers;
export const updateUserStatusRef = typedApi.features.users.api.updateUserStatus;
export const listRolesRef = typedApi.features.users.api.listRoles;
export const listAuditLogsRef = typedApi.features.users.api.listAuditLogs;
