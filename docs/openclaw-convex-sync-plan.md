# OpenClaw ↔ Convex Sync Plan

Status: draft implementation plan
Owner: Rahman / Manef
Repo: `rahmanef63/manef-ui`

---

## Core Rule

**If OpenClaw already provides an identifier or stable external identity, use that. Do not invent a new ID.**

Only generate a new ID when:
1. OpenClaw truly does not expose one, and
2. we still need a stable key on the Convex side.

This rule applies especially to:
- `sessionKey`
- `agentId`
- `instanceId`
- channel/account identifiers
- external user identifiers (phone, email, provider account)

Convex `_id` remains internal only.

---

## Goal

Build a reliable **two-way sync** between OpenClaw and Convex Cloud so that:

1. OpenClaw state can be seeded and mirrored into Convex.
2. Dashboard CRUD in Convex can update the corresponding OpenClaw entity.
3. Existing OpenClaw identities are preserved, preventing duplicate or drifting records.

---

## Principle: Source-of-Truth by Entity

Not every table should be equally editable.

### OpenClaw-first entities
These should primarily mirror OpenClaw and use OpenClaw identities directly:
- instances
- sessions
- agentSessions
- channel accounts / status
- live agent presence / runtime status
- usage / logs / runtime metrics

### Convex-editable with sync-back
These may be edited in dashboard, then synced back to OpenClaw:
- agents (display metadata, activation state, role-like config)
- skills (enable/disable, assignment)
- workspace metadata
- user profile labels / preferences
- certain channel settings

### Convex-only entities
These may exist only in Convex if OpenClaw has no native equivalent:
- dashboard-only notes
- UI preferences
- custom tags
- internal audit helpers
- sync outbox / reconciliation tables

---

## Identifier Policy

### Always use OpenClaw-provided identifiers when available

| Entity | Preferred external key from OpenClaw | Notes |
|---|---|---|
| Instance | `instanceId` / hostname (example: `srv614914`) | Use OpenClaw/gateway identity directly |
| Agent | `agentId` / agent slug (example: `main`, `ina`) | Never replace with random UUID |
| Session | `sessionKey` | Must come from OpenClaw store/API if available |
| Channel account | provider + account key + phone/peer | Example: `whatsapp:default:+6285706461111` |
| User identity | phone / email / provider account | Preserve real-world identifier |
| Workspace | OpenClaw workspace slug if present; otherwise deterministic derived key | Generate only if OpenClaw has no native workspace id |

### Only generate IDs when OpenClaw has no stable key

If generation is necessary, generated IDs must be:
- deterministic when possible,
- namespaced,
- reversible enough for debugging.

Examples:
- `srv614914:workspace:main`
- `srv614914:channel:telegram:default`
- `srv614914:agent:main`

Do **not** use random UUIDs for mirrored OpenClaw entities unless there is absolutely no stable natural key.

---

## Current Known OpenClaw Identity Sources

Based on the current system state, these keys already exist and should be reused:

### Instance / host
- `srv614914`
- `76.13.23.37`

### Agents
- `main`
- `ina`
- `irul`
- `irul-bisnis`
- `irul-kuliah`
- `official-zianinn`
- `rysha`
- `si-coder`
- `si-db`
- `si-it`
- `si-nml`
- `si-pinter`
- `si-pm`
- `user-005203`
- `zahra`

### Channels / accounts
- Telegram default account
- WhatsApp default account `+6285706461111`

### Sessions
- Must be taken from OpenClaw session store/API, not generated.
- Example target source:
  - `~/.openclaw/agents/<agent>/sessions/sessions.json`
  - session registry / gateway-backed APIs where available

---

## Data Model Strategy

The Convex layer should maintain both:

1. **internal Convex `_id`** for joins and references
2. **external identity fields** for OpenClaw mapping

Recommended external identity fields:
- `source`: `"openclaw" | "convex" | "manual"`
- `sourceType`: e.g. `"agent" | "session" | "instance" | "channel"`
- `externalId`: canonical stable identifier from OpenClaw
- `externalParentId`: optional parent mapping
- `syncStatus`: `"clean" | "dirty" | "syncing" | "error"`
- `lastSyncedAt`
- `syncError`

Where current schema already has a field like `agentId`, `instanceId`, `channelId`, or `sessionKey`, that field should act as the primary external identity.

---

## Recommended Mapping by Table

### instances
- OpenClaw source key: `instanceId`
- Convex internal key: `_id`
- Direction: mostly OpenClaw → Convex
- Editable in dashboard: limited metadata only

### agents
- OpenClaw source key: `agentId`
- Direction: two-way
- Editable fields:
  - display name
  - active state
  - optional config metadata
- Read-only fields from OpenClaw:
  - runtime/session-derived state unless explicitly overridden

### channels
- OpenClaw source key: `channelId`
- Direction: two-way, but carefully scoped
- Safe editable fields:
  - labels
  - allowlist-related metadata
  - selected toggles
- Runtime status fields should be OpenClaw-driven

### sessions
- OpenClaw source key: `sessionKey`
- Direction: mostly OpenClaw → Convex
- Do not generate session IDs manually if OpenClaw exposes them.
- Dashboard should treat these as mirrored operational records.

### userProfiles / authUsers / userIdentities
- Prefer OpenClaw-backed natural identifiers:
  - email
  - phone
  - provider account IDs
- Two-way only for profile metadata that OpenClaw can meaningfully consume.

### skills
- Use skill slug/name if stable from OpenClaw/skills registry
- Direction: two-way for enable/disable and assignment where supported

---

## Seed Strategy

### Phase 1: bootstrap from known OpenClaw state
Seed the following from current known data:
- owner user (`rahmanef63@gmail.com`)
- owner phone (`+6285856697754`)
- main instance (`srv614914`)
- workspace `main`
- agents discovered from OpenClaw
- channel accounts discovered from OpenClaw
- initial skill registry

### Phase 2: hydrate from real OpenClaw sources
Replace placeholder assumptions with actual extracted data from:
- OpenClaw sessions store
- agent/session registry
- gateway status sources
- channel account status

### Phase 3: reconciliation pass
After first seed, reconcile:
- duplicate users
- duplicate agents
- duplicate channels
- sessions with guessed keys vs real keys

---

## Two-Way Sync Architecture

Seed alone is not enough. Two-way sync needs a proper sync pipeline.

### Pattern
1. User edits data in dashboard (Convex mutation).
2. Mutation writes DB record and marks it dirty.
3. Mutation writes an outbox event.
4. Action/worker sends change to OpenClaw.
5. On success:
   - mark sync clean
   - persist external confirmation / timestamp
6. On failure:
   - keep sync error state
   - surface error in dashboard

### Required pieces
- `syncOutbox` table
- `syncRuns` / `syncErrors` tables (optional but recommended)
- Convex actions for OpenClaw bridge calls
- deterministic mappers per entity type
- conflict policy

---

## Conflict Rules

### Default rule
- If OpenClaw is authoritative for runtime identity/state, OpenClaw wins.
- If dashboard changes metadata that OpenClaw accepts, dashboard can write back.

### Examples
- Session key mismatch → OpenClaw wins
- Agent display label changed in dashboard → dashboard may sync to OpenClaw metadata
- Runtime status changed in OpenClaw → OpenClaw wins
- Dashboard-only note → Convex wins

---

## CRUD Policy

### Allowed 2-way first
Start here first because risk is low:
- agent name / display metadata
- agent active/inactive state
- skill enabled/disabled
- selected channel metadata

### Read-mostly for now
Do not make fully editable yet:
- sessions
- agentSessions
- logs
- usage
- messages

### Cautious later
- workspace structure
- user role bindings
- invitation flows

---

## OpenClaw Data Sources To Use Next

We should pull real data from these before expanding generated placeholders:

1. `openclaw status --all`
2. agent session stores:
   - `~/.openclaw/agents/<agent>/sessions/sessions.json`
3. session JSONL/history stores if present
4. gateway/runtime APIs where available
5. channel account state

Whenever a field is available from those sources, prefer that over generated values.

---

## Immediate Implementation Plan

### Step 1 — stabilize external identity usage
- Audit current seed and mutations
- Replace guessed IDs with OpenClaw keys wherever available
- Add explicit external identity metadata where missing

### Step 2 — ingest real sessions
- Read real OpenClaw session stores
- Upsert Convex `sessions` using real `sessionKey`
- Upsert `agentSessions` with source-linked metadata

### Step 3 — create sync outbox
- Add `syncOutbox` table
- Add event types such as:
  - `agent.update`
  - `skill.toggle`
  - `channel.update`

### Step 4 — implement first two-way flows
- Agent rename
- Agent active toggle
- Skill enable/disable

### Step 5 — add reconciliation UI
- Show whether a record is:
  - mirrored
  - locally modified
  - failed to sync
  - missing OpenClaw identity

---

## Non-Negotiable Rules

1. **Do not invent session IDs if OpenClaw already has session keys.**
2. **Do not replace agent IDs from OpenClaw with dashboard-generated UUIDs.**
3. **Use email/phone/provider IDs as user identity anchors when available.**
4. **Treat Convex `_id` as internal only.**
5. **Any generated fallback ID must be deterministic and namespaced.**
6. **Runtime status should not overwrite real OpenClaw identity.**

---

## Decision Summary

The sync system will follow this policy:

> If OpenClaw provides the identity, use it.
> If OpenClaw does not provide the identity, generate a deterministic fallback.
> Never generate random IDs for mirrored OpenClaw entities unless no stable source key exists.

This is the rule to preserve referential integrity and enable future two-way sync safely.
