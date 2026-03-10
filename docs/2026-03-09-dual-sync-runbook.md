> ⚠️ **Context freeze (2026-03-10):** Dokumen ini dibuat untuk fase dual-sync GG/shared Convex. Untuk plan terbaru pemisahan DB `manef-ui`, jadikan dokumen ini referensi historis saja. Ikuti `2026-03-10-manef-ui-db-separation-migration-plan.md` sebagai sumber utama.

# Runbook — Dual Sync Webhook (Test vs Prod)

## 1) Production trigger (normal)
```bash
/home/rahman/scripts/gg-manual-trigger.sh --template both
```

## 2) Test trigger (webhook-test)
1. Open n8n UI
2. Open workflow `GG::DualSync::Prod`
3. Click **Execute workflow** (wait until listening)
4. In terminal:
```bash
/home/rahman/scripts/gg-manual-trigger.sh --test --template both
```

## 3) Common failures
- `404` on webhook-test:
  - Cause: workflow not in Execute mode
  - Fix: click Execute workflow first
- `BadJsonBody missing field path`:
  - Cause: payload invalid / no path
  - Fix: include one of `path`, `selfhostPath`, `cloudPath`
- HTTP 200 but target fail:
  - Cause: one target error while other target success
  - Fix: always inspect `selfhost.ok` and `cloud.ok` in response

## 4) Quick diagnostics
```bash
# shared path to both
/home/rahman/scripts/gg-manual-trigger.sh --path sessions:upsertScoped --args '{}'

# target-specific + per-target args
/home/rahman/scripts/gg-manual-trigger.sh \
  --selfhost-path sessions:upsertScoped \
  --cloud-path users:store \
  --selfhost-args '{"tenantId":"rahman-main","sessionKey":"probe:both","agentId":"main","channel":"webchat"}' \
  --cloud-args '{}'
```
