import { createHash } from "crypto";

function pickHeader(headers: Headers, names: string[]) {
  for (const name of names) {
    const value = headers.get(name);
    if (value) {
      return value;
    }
  }
  return undefined;
}

function normalizeIp(ip: string | undefined) {
  if (!ip) {
    return undefined;
  }

  const first = ip.split(",")[0]?.trim();
  if (!first) {
    return undefined;
  }

  if (first.includes(".")) {
    const parts = first.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
    }
  }

  if (first.includes(":")) {
    return first
      .split(":")
      .slice(0, 4)
      .join(":");
  }

  return first;
}

function buildLabel(userAgent: string | undefined, platform: string | undefined) {
  const platformLabel = platform?.replaceAll('"', "").trim() || "unknown-platform";
  const userAgentLabel = userAgent?.split(" ").slice(0, 2).join(" ") || "unknown-browser";
  return `${platformLabel} / ${userAgentLabel}`;
}

export function buildDeviceContext(headers: Headers) {
  const userAgent = pickHeader(headers, ["user-agent"]);
  const acceptLanguage = pickHeader(headers, ["accept-language"]);
  const platform = pickHeader(headers, ["sec-ch-ua-platform"]);
  const forwardedFor = pickHeader(headers, ["x-forwarded-for", "x-real-ip"]);
  const ip = forwardedFor?.split(",")[0]?.trim();
  const ipBucket = normalizeIp(ip);

  const fingerprintPayload = JSON.stringify({
    acceptLanguage,
    ipBucket,
    platform,
    userAgent,
  });

  return {
    deviceHash: createHash("sha256")
      .update(`${process.env.AUTH_DEVICE_SALT ?? "openclaw-auth"}:${fingerprintPayload}`)
      .digest("hex"),
    ip,
    label: buildLabel(userAgent, platform),
    userAgent,
  };
}
