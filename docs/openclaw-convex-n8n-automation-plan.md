# OpenClaw ↔ Convex Automation Plan (No LLM / No OpenClaw Heartbeat)

Status: implementation plan
Owner: Rahman / Manef
Repo: `rahmanef63/manef-ui`

---

## Objective

Build OpenClaw ↔ Convex synchronization using:
- **Convex** for storage, mutation logic, and API surface
- **n8n** for orchestration and scheduling
- **local shell/scripts** for reading OpenClaw local files and runtime state

Avoid using:
- LLM tokens
- OpenClaw heartbeat polling
- OpenClaw cron for routine sync

This sync pipeline should be deterministic, low-cost, and operationally predictable.

---

## Non-Goals

This plan is **not** based on:
- conversational polling
- AI summarization loops
- recurring OpenClaw heartbeat prompts
- LLM-based ETL

If a task can be done by file parsing, HTTP calls, deterministic transforms, or n8n logic, use that instead.

---

## Core Architecture

### Direction A — OpenClaw → Convex
Use n8n or local scripts to ingest:
- `openclaw status --all`
- local session stores (`~/.openclaw/agents/*/sessions/sessions.json`)
- local JSONL session files if needed
- gateway/runtime facts available from CLI or files

Then write into Convex using:
- Convex HTTP actions/mutations
- or Convex CLI / scripted mutation calls

### Direction B — Convex → OpenClaw
When user changes supported records in dashboard:
1. Convex writes the DB mutation
2. Convex creates a `syncOutbox` event
3. n8n polls or receives webhook trigger
4. n8n calls a deterministic OpenClaw-side script/API
5. n8n marks the outbox event done/failed

---

## Why n8n Instead of OpenClaw Cron/Heartbeat

### OpenClaw heartbeat
- consumes LLM context/tokens
- not ideal for deterministic sync jobs
- designed for assistant behavior, not ETL

### OpenClaw cron
- useful for reminders and agent turns
- still not ideal as the main operational sync engine here
- mixes automation with agent runtime concerns

### n8n
- deterministic scheduling
- webhook-friendly
- built for branching, retries, logging, transforms
- no LLM token cost for ordinary sync jobs
- easy to visualize and maintain

**Decision:** use **n8n** as the default orchestrator for sync.

---

## Sync Modes

### 1. Pull sync (OpenClaw → Convex)
Scheduled by n8n, e.g. every 5 or 15 minutes.

Input sources:
- `openclaw status --all`
- session store files
- local filesystem metadata

Output:
- upsert `instances`
- upsert `agents`
- upsert `channels`
- upsert `sessions`
- upsert `agentSessions`

### 2. Push sync (Convex → OpenClaw)
Triggered by DB changes.

Input source:
- `syncOutbox`

Output:
- apply changes to OpenClaw local state/config where supported
- mark event delivered / failed

### 3. Reconciliation sync
Less frequent, e.g. hourly/daily.

Purpose:
- detect drift
- repair missed updates
- ensure external identities still match OpenClaw reality

---

## Identity Rule

Use OpenClaw identities when available:
- `instanceId`
- `agentId`
- `sessionKey`
- provider/channel identifiers
- phone / email / provider account id

Only generate fallback IDs when OpenClaw does not provide one.

This rule applies equally to both n8n flows and Convex schemas.

---

## Proposed Automation Components

## A. Local extractor scripts
Store in a scripts folder outside LLM flows, for example:
- `<USER_HOME>/scripts/openclaw/export-status.sh`
- `<USER_HOME>/scripts/openclaw/export-sessions.py`
- `<USER_HOME>/scripts/openclaw/export-agents.py`

### Responsibilities

#### `export-status.sh`
Outputs normalized JSON from:
```bash
openclaw status --all
```

#### `export-sessions.py`
Reads:
- `~/.openclaw/agents/*/sessions/sessions.json`
- optionally referenced JSONL files

Outputs normalized JSON like:
```json
{
  "instances": [...],
  "agents": [...],
  "sessions": [...],
  "channels": [...]
}
```

#### `apply-openclaw-change.py`
Consumes desired mutations from outbox, such as:
- agent rename
- agent activation toggle
- skill enable/disable (if mapped)
- future config changes

This script should be deterministic and log every applied change.

---

## B. Convex tables to add

### `syncOutbox`
Purpose: queue outbound changes from Convex to OpenClaw.

Recommended fields:
- `eventId`
- `entityType`
- `entityKey`
- `operation`
- `payload`
- `status` (`pending`, `processing`, `done`, `failed`)
- `attemptCount`
- `lastError`
- `createdAt`
- `updatedAt`
- `processedAt`

### `syncRuns`
Purpose: track importer/exporter runs.

Recommended fields:
- `runId`
- `direction` (`pull`, `push`, `reconcile`)
- `source`
- `status`
- `stats`
- `startedAt`
- `endedAt`
- `error`

### `syncState`
Purpose: keep checkpoints.

Recommended fields:
- `key`
- `value`
- `updatedAt`

Examples:
- last imported session timestamp
- last processed outbox cursor
- last successful status snapshot hash

---

## C. Convex server functions to add

### Pull-side mutations
- `sync/upsertInstanceFromOpenClaw`
- `sync/upsertAgentFromOpenClaw`
- `sync/upsertChannelFromOpenClaw`
- `sync/upsertSessionFromOpenClaw`
- `sync/upsertAgentSessionFromOpenClaw`

These should:
- upsert by OpenClaw external identity
- never generate replacement IDs when source key exists
- preserve internal `_id` stability

### Push-side mutations
- `sync/createOutboxEvent`
- `sync/markOutboxProcessing`
- `sync/markOutboxDone`
- `sync/markOutboxFailed`
- `sync/listPendingOutbox`

### Dashboard mutations
Any editable mutation should:
1. update local Convex state
2. create outbox event

Examples:
- `agents/updateAgentMetadata`
- `agents/setAgentActive`
- `skills/setSkillEnabled`

---

## n8n Workflow Design

## Workflow 1 — OpenClaw status pull
**Trigger:** Schedule (every 5m or 15m)

Steps:
1. Execute Command: `openclaw status --all`
2. Execute Command / Script: normalize to JSON
3. HTTP Request to Convex mutation endpoint(s)
4. Record run status

No LLM involved.

---

## Workflow 2 — Session store pull
**Trigger:** Schedule (every 5m / 10m)

Steps:
1. Read `~/.openclaw/agents/*/sessions/sessions.json`
2. Parse JSON
3. Extract session identities and metadata
4. Upsert into Convex
5. Save checkpoint/hash if needed

No LLM involved.

---

## Workflow 3 — Outbox dispatcher
**Trigger options:**
- polling schedule every minute, or
- webhook from Convex/Next backend after outbox insert

Steps:
1. Get pending outbox items from Convex
2. Route by `entityType + operation`
3. Execute deterministic script/API call on host
4. Mark success/failure in Convex
5. Retry with bounded backoff

No LLM involved.

---

## Workflow 4 — Reconciliation audit
**Trigger:** hourly or daily

Steps:
1. Read current OpenClaw state
2. Compare with Convex mirrors
3. Detect drift
4. Write audit summary to Convex logs / syncRuns
5. Optionally auto-heal selected fields

No LLM involved.

---

## Convex CRUD Behavior

When user edits a supported entity in dashboard:

### Example: rename agent
1. User updates agent display name in UI
2. Convex mutation updates `agents`
3. Convex mutation creates outbox event:
```json
{
  "entityType": "agent",
  "entityKey": "main",
  "operation": "rename",
  "payload": { "name": "Manef" }
}
```
4. n8n picks it up
5. n8n calls local OpenClaw apply script
6. result written back to Convex

This keeps UI responsive and avoids blocking on OpenClaw execution.

---

## Data Ownership Rules

### OpenClaw owns
- live runtime state
- session identity
- session activity timestamps
- channel connection status
- gateway instance facts

### Convex may own and push back
- display labels
- enable/disable toggles
- dashboard metadata
- manually curated mappings
- operator annotations

### Shared with conflict resolution
- agent metadata
- selected channel settings
- user-facing labels

Default conflict rule:
- OpenClaw wins for runtime identity/state
- Convex wins for operator-managed metadata

---

## Security Notes

### No LLM token usage
The sync pipeline must use only:
- shell scripts
- n8n workflows
- HTTP requests
- Convex mutations/actions
- file parsing

Do not route sync through assistant chat or heartbeat turns.

### Secrets handling
Store secrets in n8n / Dokploy envs, not hardcoded in docs.
Examples:
- `CONVEX_DEPLOY_KEY`
- OpenClaw shared secrets
- any webhook secret

### File access
The extractor scripts should run on the same host that has access to:
- `~/.openclaw/agents/*/sessions/`
- `openclaw` CLI

---

## Recommended Initial Scope

### Implement first
1. Pull sync for:
   - instances
   - agents
   - channels
   - sessions
2. Push sync for:
   - agent rename
   - agent active toggle
   - skill enable/disable

### Delay until later
- message-level sync
- full workspace tree sync
- automatic role/permission sync-back
- destructive OpenClaw operations from dashboard

---

## Minimal First Delivery

### Phase A
- Add `syncOutbox`, `syncRuns`, `syncState`
- Add Convex mutations for upsert + outbox tracking
- Add local exporter script for sessions/status
- Build n8n pull workflow
- **Implementation status:** initial Convex schema + API foundations for `syncOutbox`, `syncRuns`, and `syncState` have been added; exporter script and n8n workflow JSON are next

### Phase B
- Add dashboard mutations that emit outbox events
- Build n8n outbox dispatcher workflow
- Add retry/error tracking

### Phase C
- Add reconciliation workflow
- Add sync status UI in dashboard

---

## Success Criteria

The system is considered correctly implemented when:

1. Session and agent records in Convex are populated from real OpenClaw identities.
2. No sync flow depends on LLM prompts, heartbeat turns, or OpenClaw cron reminders.
3. n8n can run sync jobs on schedule and via webhook.
4. Editing supported fields in Convex creates outbox events.
5. Outbox events update OpenClaw deterministically.
6. Failures are visible in Convex (`failed`, `lastError`, retry count).

---

## Final Decision

**Use Convex + n8n + deterministic scripts as the sync backbone.**

Do not use:
- assistant heartbeat
- LLM-driven polling
- OpenClaw cron agent turns

Use OpenClaw only as:
- source of truth for exposed runtime identities
- execution target for deterministic sync-back operations

This keeps sync cheap, fast, auditable, and free from token burn.
