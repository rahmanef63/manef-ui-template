import { makeFunctionReference } from "convex/server";
import type { Id } from "@/shared/types/convex";

// --- Users ---
export const getUsersRef = makeFunctionReference<
    "query",
    Record<string, never>,
    Array<{
        _id: Id<"authUsers">;
        name: string;
        email: string;
        roles: string[];
        status: string;
        createdAt: number;
        updatedAt: number;
    }>
>("features/users/api:getUsers");

export const updateUserStatusRef = makeFunctionReference<
    "mutation",
    {
        userId: Id<"authUsers">;
        status: "active" | "blocked";
    },
    null
>("features/users/api:updateUserStatus");

// --- Roles ---
export const listRolesRef = makeFunctionReference<
    "query",
    Record<string, never>,
    Array<{
        _id: Id<"roles">;
        name: string;
        isDefault: boolean;
    }>
>("features/users/api:listRoles");

// --- Audit Logs ---
export const listAuditLogsRef = makeFunctionReference<
    "query",
    {
        eventFilter?: string;
        limit?: number;
    },
    Array<{
        _id: Id<"authAuditLogs">;
        event: string;
        createdAt: number;
        userId?: Id<"authUsers">;
        userName?: string;
        userEmail?: string;
        meta?: unknown;
    }>
>("features/users/api:listAuditLogs");
