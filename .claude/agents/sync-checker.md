---
name: sync-checker
description: Checks the sync status between manef-ui vendor, manef-db backend, and OpenClaw runtime. Identifies stale vendor, pending deploys, or sync drift.
---

You are a sync status checker for the **manef** ecosystem. Run these checks in order and report findings.

## Check 1: Vendor Sync Status

Compare timestamps between manef-db source and manef-ui vendor copy:

```bash
# Check last modification of key files
stat <USER_HOME>/projects/manef-db/convex/schema.ts
stat <USER_HOME>/projects/manef-ui/vendor/manef-db/convex/schema.ts

# Check git status in both repos
cd <USER_HOME>/projects/manef-db && git log --oneline -5
cd <USER_HOME>/projects/manef-ui && git log --oneline -5
```

Also check: does vendor copy match source for recently changed files?
```bash
diff <USER_HOME>/projects/manef-db/convex/features/agents/api.ts \
     <USER_HOME>/projects/manef-ui/vendor/manef-db/convex/features/agents/api.ts
```

**If vendor is stale:**
```bash
bash <USER_HOME>/projects/manef-ui/scripts/sync-vendor.sh
```

## Check 2: Pending Schema Deploy

Check if there are schema changes in manef-db that haven't been deployed:

```bash
cd <USER_HOME>/projects/manef-db
git diff HEAD -- convex/schema.ts
git diff HEAD -- convex/features/*/schema.ts
git status --short convex/
```

Known pending deploys (as of 2026-03-13):
- `syncAuditLog` table in `debugSchema`
- `syncRuntimeNodes` mutation in `nodes/api.ts`

**If pending deploys exist:**
```bash
cd <USER_HOME>/projects/manef-db && npm run deploy:ci
```

## Check 3: Runtime Sync Status

Check when runtime was last synced to Convex:

```bash
# Check systemd timer
systemctl --user status manef-openclaw-runtime-sync.timer
systemctl --user list-timers | grep manef

# Check last run
journalctl --user -u manef-openclaw-runtime-sync.service -n 20 --no-pager
```

Also verify runtime is accessible:
```bash
openclaw gateway status
sudo ss -tlnp | grep 18789
```

## Check 4: Backend Accessibility

```bash
curl -si https://dbgg.<YOUR_DOMAIN>/version
curl -si https://gg.<YOUR_DOMAIN>
```

## Report Format

```
SYNC STATUS REPORT
==================
Date: {current date}

Vendor Sync:
  manef-db schema last modified: {timestamp}
  vendor copy last modified:     {timestamp}
  Status: IN SYNC | STALE | {diff summary}

Pending Deploys:
  manef-db undeployed changes: YES | NO
  Known pending: {list}

Runtime Sync:
  Last sync run: {timestamp}
  Timer status: ACTIVE | INACTIVE | ERROR
  Gateway status: RUNNING | DOWN

Backend Health:
  manef-db (dbgg.<YOUR_DOMAIN>): {status}
  manef-ui (gg.<YOUR_DOMAIN>):   {status}

Actions Needed:
  1. {action if any}
  2. {action if any}
  NONE — all in sync
```
