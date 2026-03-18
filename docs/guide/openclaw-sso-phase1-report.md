# OpenClaw SSO Phase 1 Report

Date: March 9, 2026
Project: `openclaw-ui`
Stack: Next.js + NextAuth v5 + Convex

## Purpose

This report summarizes the current SSO/device-approval implementation prepared for OpenClaw integration.

Current architecture decision:
- Auth source of truth remains inside the Auth App on Convex.
- OpenClaw is treated as orchestrator/policy/approval workflow, not as the primary IdP datastore.
- Device approval, revoke, and audit state live in Convex first.

## Phase 1 Status

Implemented:
- Dedicated auth schema for users, identities, devices, sessions, audit logs, and auth policies.
- NextAuth credentials login routed through Convex policy and device approval checks.
- Device fingerprint hashing on the server using normalized request metadata plus app salt.
- One-time bootstrap auto-approve guard for the first admin device, with separate audit event.
- Pending-device gate with explicit login states:
  - `APPROVED`
  - `DEVICE_APPROVAL_REQUIRED`
  - `DEVICE_REVOKED`
  - `BLOCKED`
  - `INVALID_CREDENTIALS`
  - `EMAIL_DOMAIN_NOT_ALLOWED`
- Session metadata propagated into JWT/session:
  - `userId`
  - `deviceId`
  - `sessionId`
  - `roles`
  - `sessionVersion`
- Manual admin queue page for pending device approvals.
- Internal API routes for approve/revoke/check/request flows.
- Per-session revoke and global revoke-all support.
- Idempotent approve/revoke/revoke-all responses for retry-safe orchestration.
- Policy version stamped into auth sessions and NextAuth session payload.
- Audit log entries for login attempts, pending devices, approvals, denials, and revocations.

Not implemented yet:
- OpenClaw service-to-service HMAC verification with nonce replay protection.
- OpenClaw outbound notification delivery.
- OpenClaw-triggered approval callbacks/workflows.
- Multi-user credentials store or OAuth providers beyond env-based admin bootstrap login.
- Cross-app SSO propagation across multiple separate Next.js apps.
- Geo/risk scoring hardening beyond basic placeholder fields.

## Convex Auth Data Model

Added tables:
- `authUsers`
- `authIdentities`
- `authDevices`
- `authSessions`
- `authAuditLogs`
- `authPolicies`

Policy shape currently supported:

```json
{
  "requireDeviceApproval": true,
  "trustedNetworks": [],
  "maxSessionsPerUser": 5,
  "allowedEmailDomains": [],
  "stepUpForNewGeo": true,
  "sessionTtlMinutes": 60,
  "refreshTtlDays": 14
}
```

## Internal Contracts Exposed by Auth App

Available API routes:
- `POST /api/auth/device/check`
- `POST /api/auth/device/request-approval`
- `GET /api/auth/device/pending`
- `POST /api/auth/device/approve`
- `POST /api/auth/device/revoke`
- `POST /api/auth/session/revoke`
- `POST /api/auth/session/revoke-all`

Current intent:
- OpenClaw may call these routes directly, or trigger operators/workflows that call them.
- Convex remains the source of truth for final device/session state.

## Device Fingerprint Strategy

Current device hash input:
- `user-agent`
- `accept-language`
- `sec-ch-ua-platform`
- IP bucket, not raw long-term IP identity

Current processing:
- normalize request metadata
- derive IP bucket
- hash with `SHA-256`
- prepend app salt via `AUTH_DEVICE_SALT`

Privacy posture:
- raw fingerprint is not stored as a durable identity artifact
- stored values are limited to hash + bounded metadata like label, recent IP, recent user agent

## Bootstrap Behavior

To avoid initial lockout:
- first successful device for `AUTH_ADMIN_EMAIL` is auto-approved once

Reason:
- without this, Phase 1 would deadlock because no approved operator device would exist to approve the first login

## Operator Surface

Manual operator page:
- `/dashboard/security`

Purpose:
- local fallback approval queue if OpenClaw notification delivery is unavailable

## Validation

Completed:
- `npx convex codegen`
- `npx tsc --noEmit`

Known repo issue unrelated to auth logic:
- `npm run lint` fails because the existing script still uses `next lint`, which is not valid in the current Next.js 16 setup in this repo

## Required OpenClaw Follow-Up

For Phase 2 integration, OpenClaw only needs to behave as workflow/orchestration layer.

Recommended OpenClaw responsibilities:
- receive pending-device event
- notify operator channel
- optionally call Auth App approve/revoke endpoints
- maintain incident workflow for revoke-all
- optionally push policy updates into Auth App

Recommended next contract from OpenClaw side:
- event payload shape for pending device notification
- authentication method for OpenClaw calling Auth App endpoints
- retry policy for approval/revoke callbacks
- expected operator identity string for `approvedBy` and `revokedBy`

## Recommended Next Phase

Phase 2:
- emit pending-device events toward OpenClaw workflow
- secure Auth App approval endpoints for OpenClaw service calls
- add revoke and approval actions from OpenClaw dashboard/workflow
- add policy sync path if OpenClaw becomes policy editor

Phase 3:
- replace env-based credential source with real user store or OAuth
- support multi-app shared auth domain / internal OIDC evolution
- add session introspection middleware for app-to-app SSO hardening
