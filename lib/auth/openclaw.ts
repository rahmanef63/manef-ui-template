import { createHash, createHmac, timingSafeEqual, randomUUID } from "crypto";
import { fetchMutation } from "@/lib/convex/server";
import { consumeOpenClawNonceRef } from "@/shared/convex/auth";

const EMPTY_BODY_SHA256 =
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

function sha256Hex(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function getOpenClawConfig() {
  return {
    allowedClockSkewSeconds: Number(
      process.env.OPENCLAW_ALLOWED_CLOCK_SKEW_SECONDS ?? "300"
    ),
    nonceTtlSeconds: Number(process.env.OPENCLAW_NONCE_TTL_SECONDS ?? "300"),
    sharedSecret: process.env.OPENCLAW_SHARED_SECRET,
    workflowUrl: process.env.OPENCLAW_WORKFLOW_URL,
  };
}

function getCanonicalPath(request: Request) {
  const url = new URL(request.url);
  return url.pathname;
}

function getTimestampMs(timestamp: string) {
  const asNumber = Number(timestamp);
  if (Number.isNaN(asNumber)) {
    return Number.NaN;
  }
  return asNumber > 1_000_000_000_000 ? asNumber : asNumber * 1000;
}

function buildSignaturePayload(args: {
  body: string;
  method: string;
  nonce: string;
  path: string;
  timestamp: string;
}) {
  return `${args.timestamp}.${args.nonce}.${args.method.toUpperCase()}.${args.path}.${sha256Hex(args.body)}`;
}

export async function authenticateActionRequest(request: Request, rawBody: string) {
  const signature = request.headers.get("x-openclaw-signature");
  const timestamp = request.headers.get("x-openclaw-timestamp");
  const nonce = request.headers.get("x-openclaw-nonce");

  if (!signature || !timestamp || !nonce) {
    return { mode: "anonymous" as const };
  }

  const config = getOpenClawConfig();
  if (!config.sharedSecret) {
    console.warn("openclaw.auth.reject", { reason: "missing_shared_secret" });
    return { mode: "rejected" as const, reason: "forbidden" as const };
  }

  const timestampMs = getTimestampMs(timestamp);
  if (Number.isNaN(timestampMs)) {
    console.warn("openclaw.auth.reject", { reason: "bad_timestamp" });
    return { mode: "rejected" as const, reason: "timestamp_skew" as const };
  }

  const now = Date.now();
  const driftMs = Math.abs(now - timestampMs);
  if (driftMs > config.allowedClockSkewSeconds * 1000) {
    console.warn("openclaw.auth.reject", { reason: "timestamp_skew", driftMs });
    return { mode: "rejected" as const, reason: "timestamp_skew" as const };
  }

  const path = getCanonicalPath(request);
  const expected = createHmac("sha256", config.sharedSecret)
    .update(
      buildSignaturePayload({
        body: rawBody,
        method: request.method,
        nonce,
        path,
        timestamp,
      })
    )
    .digest("hex");
  const provided = signature.replace(/^sha256=/, "");

  const matches =
    provided.length === expected.length &&
    timingSafeEqual(Buffer.from(provided, "hex"), Buffer.from(expected, "hex"));
  if (!matches) {
    console.warn("openclaw.auth.reject", { reason: "bad_sig", path });
    return { mode: "rejected" as const, reason: "bad_sig" as const };
  }

  const nonceResult = await fetchMutation(consumeOpenClawNonceRef, {
    nonce,
    requestMethod: request.method.toUpperCase(),
    requestPath: path,
    ttlSeconds: config.nonceTtlSeconds,
  });
  if (nonceResult === "nonce_replay") {
    console.warn("openclaw.auth.reject", { reason: "nonce_replay", path });
    return { mode: "rejected" as const, reason: "nonce_replay" as const };
  }

  return {
    actor: request.headers.get("x-openclaw-actor") ?? "openclaw:system:workflow:unknown",
    idempotencyKey: request.headers.get("x-idempotency-key") ?? undefined,
    mode: "openclaw" as const,
  };
}

export function getEmptyBodySha256() {
  return EMPTY_BODY_SHA256;
}

export async function emitDevicePendingEvent(args: {
  device: {
    id: string;
    label?: string;
    lastSeenIp?: string;
    riskScore: number;
  };
  policy: {
    policyVersion: number;
    requireDeviceApproval: boolean;
  };
  requestContext: {
    ip?: string;
    userAgent?: string;
  };
  user: {
    email: string;
    id?: string;
    name?: string;
  };
}) {
  const config = getOpenClawConfig();
  if (!config.workflowUrl || !config.sharedSecret) {
    return;
  }

  const occurredAt = new Date().toISOString();
  const event = {
    device: {
      firstSeenAt: Date.now(),
      hash: "sha256:internal",
      id: args.device.id,
      label: args.device.label,
      lastSeenAt: Date.now(),
      lastSeenIp: args.device.lastSeenIp
        ? args.device.lastSeenIp.replace(/\d+$/, "xxx")
        : undefined,
      riskScore: args.device.riskScore,
      status: "pending" as const,
    },
    event: "device.pending.v1" as const,
    eventId: randomUUID(),
    occurredAt,
    policy: args.policy,
    requestContext: {
      ip: args.requestContext.ip?.replace(/\d+$/, "xxx"),
      userAgent: args.requestContext.userAgent,
    },
    source: "auth-app",
    user: {
      email: args.user.email,
      id: args.user.id,
      name: args.user.name,
    },
  };

  const body = JSON.stringify(event);
  const timestamp = String(Date.now());
  const nonce = randomUUID();
  const path = new URL(config.workflowUrl).pathname;
  const signature = createHmac("sha256", config.sharedSecret)
    .update(
      buildSignaturePayload({
        body,
        method: "POST",
        nonce,
        path,
        timestamp,
      })
    )
    .digest("hex");

  await fetch(config.workflowUrl, {
    body,
    headers: {
      "content-type": "application/json",
      "x-openclaw-nonce": nonce,
      "x-openclaw-signature": `sha256=${signature}`,
      "x-openclaw-timestamp": timestamp,
    },
    method: "POST",
  });
}
