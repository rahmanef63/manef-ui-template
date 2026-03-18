# OpenClaw Phase 2 Contract

Date: March 9, 2026
Scope: Auth App action API + OpenClaw workflow integration

## Transport Security

OpenClaw service calls to Auth App should use these headers:
- `X-OpenClaw-Signature`
- `X-OpenClaw-Timestamp`
- `X-OpenClaw-Nonce`

Recommended signing model:
- algorithm: `HMAC-SHA256`
- payload string:

```text
<timestamp>.<nonce>.<method>.<path>.<raw_body_sha256>
```

- signature header format:

```text
sha256=<hex_digest>
```

Validation rules:
- reject if timestamp drift exceeds 300 seconds
- reject if nonce already used within 5 minutes
- reject if signature mismatch
- reject if body hash mismatch
- method must be uppercase before signing
- sign path only, excluding query string
- empty body hash must use SHA-256 of empty string

Recommended env vars:
- `OPENCLAW_SHARED_SECRET`
- `OPENCLAW_ALLOWED_CLOCK_SKEW_SECONDS=300`
- `OPENCLAW_NONCE_TTL_SECONDS=300`
- `OPENCLAW_WORKFLOW_URL`

## Retry Policy

OpenClaw should retry idempotent action requests with exponential backoff.

Recommended policy:
- max attempts: `5`
- backoff: `2s`, `4s`, `8s`, `16s`, `32s`
- jitter: `+-20%`
- do not retry on `400`, `401`, `403`
- retry on `408`, `429`, `500`, `502`, `503`, `504`

## Event Schema

Event name:
- `device.pending.v1`

Example payload:

```json
{
  "event": "device.pending.v1",
  "eventId": "evt_01JNZ3Q7KX2E5X7P8N5A0M4JQK",
  "occurredAt": "2026-03-09T14:20:31.000Z",
  "source": "auth-app",
  "user": {
    "id": "jh7abc123",
    "email": "admin@example.com",
    "name": "admin"
  },
  "device": {
    "id": "k971def456",
    "hash": "sha256:masked-or-internal-only",
    "label": "Windows / Mozilla/5.0",
    "status": "pending",
    "riskScore": 0,
    "firstSeenAt": 1773066031000,
    "lastSeenAt": 1773066031000,
    "lastSeenIp": "103.10.10.15"
  },
  "policy": {
    "policyVersion": 1,
    "requireDeviceApproval": true
  },
  "requestContext": {
    "userAgent": "Mozilla/5.0 ...",
    "ip": "103.10.10.15"
  }
}
```

Notes:
- `eventId` must be unique and stable per emitted event
- `device.hash` should stay masked/internal if event leaves trusted boundary
- `policy.policyVersion` is required for future invalidation workflows

## Action Response Schema

Standard JSON response:

```json
{
  "status": "ok"
}
```

Allowed `status` values:
- `ok`
- `already_done`
- `not_found`
- `forbidden`

Status semantics:
- `ok`: mutation applied successfully
- `already_done`: request was valid but state was already converged
- `not_found`: target resource not found
- `forbidden`: caller authenticated but not authorized

Recommended HTTP mapping:
- `200` with `ok`
- `200` with `already_done`
- `404` with `not_found`
- `403` with `forbidden`

## Current Auth App Endpoints

Action endpoints:
- `POST /api/auth/device/approve`
- `POST /api/auth/device/revoke`
- `POST /api/auth/session/revoke`
- `POST /api/auth/session/revoke-all`

Lookup endpoints:
- `GET /api/auth/device/pending`
- `POST /api/auth/device/check`
- `POST /api/auth/device/request-approval`

Optional request header for action endpoints:
- `X-Idempotency-Key`

Current status:
- accepted as contract field for callers
- not yet stored as a first-class dedupe record in Auth App

## Actor Identifier Format

Standardize actor values now:
- `openclaw:operator:<channel>:<id>`
- `openclaw:system:workflow:<name>`
- `auth-app:system:<name>`

Examples:
- `openclaw:operator:telegram:88123456`
- `openclaw:system:workflow:device-approval`
- `auth-app:system:bootstrap`

## Current Hardening Status

Already implemented in Auth App:
- idempotent approve/revoke/revoke-all behavior
- bootstrap auto-approve guarded to one-time system bootstrap
- bootstrap audit event separated from normal device approval
- `policyVersion` stored in policy and stamped into auth sessions and NextAuth session

Still pending for Phase 2:
- optional first-class idempotency-key persistence
