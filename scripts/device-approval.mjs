#!/usr/bin/env node

import { createHash, createHmac, randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const DEFAULT_ACTOR = "openclaw:system:workflow:device-approval-cli";
const DEFAULT_DOKPLOY_ENV_FILE =
  "/etc/dokploy/applications/openclaw-dashbaord-manef-obeant/code/.env";

function usage() {
  console.error(`Usage:
  node scripts/device-approval.mjs list [--json] [--url <auth-app-url>] [--secret <shared-secret>] [--env-file <path>]
  node scripts/device-approval.mjs approve <deviceId> [--actor <actor>] [--url <auth-app-url>] [--secret <shared-secret>] [--env-file <path>]
  node scripts/device-approval.mjs revoke <deviceId> [--actor <actor>] [--url <auth-app-url>] [--secret <shared-secret>] [--env-file <path>]

Environment:
  AUTH_APP_URL or HOSTED_URL or NEXTAUTH_URL
  OPENCLAW_SHARED_SECRET
  AUTH_APP_ENV_FILE (optional override for env file path)
`);
}

function parseArgs(argv) {
  const positionals = [];
  const options = {};
  for (let index = 0; index < argv.length; index += 1) {
    const current = argv[index];
    if (!current.startsWith("--")) {
      positionals.push(current);
      continue;
    }

    const key = current.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      options[key] = "true";
      continue;
    }

    options[key] = next;
    index += 1;
  }

  return { options, positionals };
}

function loadEnvFile(filePath) {
  if (!filePath || !existsSync(filePath)) {
    return {};
  }

  const raw = readFileSync(filePath, "utf8");
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

function resolveEnv(options) {
  const cwd = process.cwd();
  const candidateFiles = [
    options["env-file"],
    process.env.AUTH_APP_ENV_FILE,
    DEFAULT_DOKPLOY_ENV_FILE,
    path.join(cwd, ".env.local"),
    path.join(cwd, ".env"),
  ].filter(Boolean);

  const merged = {};
  for (const file of candidateFiles) {
    Object.assign(merged, loadEnvFile(file));
  }

  const authAppUrl =
    options.url ||
    process.env.AUTH_APP_URL ||
    process.env.HOSTED_URL ||
    process.env.NEXTAUTH_URL ||
    merged.AUTH_APP_URL ||
    merged.HOSTED_URL ||
    merged.NEXTAUTH_URL;
  const sharedSecret =
    options.secret ||
    process.env.OPENCLAW_SHARED_SECRET ||
    merged.OPENCLAW_SHARED_SECRET;

  return {
    authAppUrl,
    envFile: candidateFiles.find((file) => file && existsSync(file)) ?? null,
    sharedSecret,
  };
}

function sha256Hex(value) {
  return createHash("sha256").update(value).digest("hex");
}

function buildSignaturePayload({ body, method, nonce, pathName, timestamp }) {
  return `${timestamp}.${nonce}.${method.toUpperCase()}.${pathName}.${sha256Hex(body)}`;
}

async function signedFetch({ actionPath, actor, authAppUrl, body, method, sharedSecret }) {
  const url = new URL(actionPath, authAppUrl);
  const nonce = randomUUID();
  const timestamp = String(Date.now());
  const serializedBody = body ? JSON.stringify(body) : "";
  const signature = createHmac("sha256", sharedSecret)
    .update(
      buildSignaturePayload({
        body: serializedBody,
        method,
        nonce,
        pathName: url.pathname,
        timestamp,
      })
    )
    .digest("hex");

  const response = await fetch(url, {
    body: serializedBody || undefined,
    headers: {
      ...(serializedBody ? { "content-type": "application/json" } : {}),
      "x-openclaw-actor": actor,
      "x-openclaw-nonce": nonce,
      "x-openclaw-signature": `sha256=${signature}`,
      "x-openclaw-timestamp": timestamp,
    },
    method,
  });

  const text = await response.text();
  let parsed;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text;
  }

  return { body: parsed, ok: response.ok, status: response.status };
}

function formatDeviceLine(device) {
  const seenAt = new Date(device.lastSeenAt).toISOString();
  return `${device._id} | ${device.email} | ${device.label ?? "Unknown device"} | ${device.lastSeenIp ?? "unknown IP"} | ${seenAt}`;
}

async function main() {
  const { options, positionals } = parseArgs(process.argv.slice(2));
  const command = positionals[0];

  if (options.help === "true") {
    usage();
    process.exit(0);
  }

  if (!command) {
    usage();
    process.exit(1);
  }

  const { authAppUrl, envFile, sharedSecret } = resolveEnv(options);
  if (!authAppUrl) {
    console.error("Missing auth app URL. Set --url, AUTH_APP_URL, HOSTED_URL, or NEXTAUTH_URL.");
    process.exit(1);
  }
  if (!sharedSecret) {
    console.error("Missing OPENCLAW_SHARED_SECRET. Set --secret or provide an env file.");
    process.exit(1);
  }

  if (command === "list") {
    const result = await signedFetch({
      actionPath: "/api/auth/device/pending",
      actor: options.actor || DEFAULT_ACTOR,
      authAppUrl,
      body: null,
      method: "GET",
      sharedSecret,
    });
    if (!result.ok) {
      console.error(`Request failed: HTTP ${result.status}`);
      console.error(JSON.stringify(result.body, null, 2));
      process.exit(1);
    }

    const items = result.body?.items ?? [];
    if (options.json === "true") {
      console.log(JSON.stringify(items, null, 2));
      return;
    }

    if (items.length === 0) {
      console.log(`No pending devices. Source: ${authAppUrl}`);
      if (envFile) {
        console.log(`Env file: ${envFile}`);
      }
      return;
    }

    console.log(`Pending devices: ${items.length}`);
    if (envFile) {
      console.log(`Env file: ${envFile}`);
    }
    for (const item of items) {
      console.log(formatDeviceLine(item));
    }
    return;
  }

  const deviceId = positionals[1];
  if (!deviceId) {
    console.error("Missing deviceId.");
    usage();
    process.exit(1);
  }

  const actionPath =
    command === "approve"
      ? "/api/auth/device/approve"
      : command === "revoke"
        ? "/api/auth/device/revoke"
        : null;
  if (!actionPath) {
    console.error(`Unknown command: ${command}`);
    usage();
    process.exit(1);
  }

  const result = await signedFetch({
    actionPath,
    actor: options.actor || DEFAULT_ACTOR,
    authAppUrl,
    body: { deviceId },
    method: "POST",
    sharedSecret,
  });
  if (!result.ok) {
    console.error(`Request failed: HTTP ${result.status}`);
    console.error(JSON.stringify(result.body, null, 2));
    process.exit(1);
  }

  console.log(JSON.stringify(result.body, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
