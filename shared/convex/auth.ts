import { makeFunctionReference } from "convex/server";
import type { Id } from "@/shared/types/convex";

export const authorizePasswordLoginRef = makeFunctionReference<
  "mutation",
  {
    createSession?: boolean;
    deviceHash: string;
    email: string;
    ip?: string;
    label?: string;
    password: string;
    userAgent?: string;
  },
  {
    code:
      | "APPROVED"
      | "DEVICE_APPROVAL_REQUIRED"
      | "DEVICE_REVOKED"
      | "BLOCKED"
      | "INVALID_CREDENTIALS"
      | "EMAIL_DOMAIN_NOT_ALLOWED";
    deviceId?: Id<"authDevices">;
    policyVersion?: number;
    roles?: string[];
    sessionId?: Id<"authSessions">;
    sessionVersion?: number;
    userId?: Id<"authUsers">;
    userName?: string;
  }
>("features/auth/api:authorizePasswordLogin");

export const listPendingDevicesRef = makeFunctionReference<
  "query",
  Record<string, never>,
  Array<{
    _id: Id<"authDevices">;
    email: string;
    firstSeenAt: number;
    label?: string;
    lastSeenAt: number;
    lastSeenIp?: string;
    name: string;
    riskScore: number;
    status: "approved" | "pending" | "revoked";
    userId: Id<"authUsers">;
  }>
>("features/auth/api:listPendingDevices");

export const getDeviceStatusRef = makeFunctionReference<
  "query",
  {
    deviceHash: string;
    userId: Id<"authUsers">;
  },
  {
    deviceId: Id<"authDevices">;
    status: "approved" | "pending" | "revoked";
  } | null
>("features/auth/api:getDeviceStatus");

export const requestDeviceApprovalRef = makeFunctionReference<
  "mutation",
  {
    deviceHash: string;
    ip?: string;
    label?: string;
    userAgent?: string;
    userId: Id<"authUsers">;
  },
  {
    deviceId: Id<"authDevices">;
    status: "approved" | "pending" | "revoked";
  }
>("features/auth/api:requestDeviceApproval");

export const approveDeviceRef = makeFunctionReference<
  "mutation",
  {
    approvedBy: string;
    deviceId: Id<"authDevices">;
  },
  "ok" | "already_done" | "not_found"
>("features/auth/api:approveDevice");

export const revokeDeviceRef = makeFunctionReference<
  "mutation",
  {
    deviceId: Id<"authDevices">;
    revokedBy: string;
  },
  "ok" | "already_done" | "not_found"
>("features/auth/api:revokeDevice");

export const revokeSessionRef = makeFunctionReference<
  "mutation",
  {
    revokedBy: string;
    sessionId: Id<"authSessions">;
  },
  "ok" | "already_done" | "not_found"
>("features/auth/api:revokeSession");

export const revokeAllUserSessionsRef = makeFunctionReference<
  "mutation",
  {
    revokedBy: string;
    userId: Id<"authUsers">;
  },
  "ok" | "already_done" | "not_found"
>("features/auth/api:revokeAllUserSessions");

export const consumeOpenClawNonceRef = makeFunctionReference<
  "mutation",
  {
    nonce: string;
    requestMethod: string;
    requestPath: string;
    ttlSeconds: number;
  },
  "ok" | "nonce_replay"
>("features/auth/api:consumeOpenClawNonce");
