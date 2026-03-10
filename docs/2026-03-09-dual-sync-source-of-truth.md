> ⚠️ **Context freeze (2026-03-10):** Dokumen ini dibuat untuk fase dual-sync GG/shared Convex. Untuk plan terbaru pemisahan DB `manef-ui`, jadikan dokumen ini referensi historis saja. Ikuti `2026-03-10-manef-ui-db-separation-migration-plan.md` sebagai sumber utama.

# Dual Sync Source of Truth (Prod)

Updated: 2026-03-09 17:19 UTC

## Active Workflow
- Name: `GG::DualSync::Prod`
- ID: `cjoY9QWS5Xfq0ohO`
- Status: `active`
- Webhook (prod): `POST https://n8n.rahmanef.com/webhook/convex-dual-sync`
- Webhook (test): `POST https://n8n.rahmanef.com/webhook-test/convex-dual-sync` (requires Execute Workflow in UI)

## Payload Contract (v3)
```json
{
  "path": "optional shared path",
  "selfhostPath": "optional target-specific path",
  "cloudPath": "optional target-specific path",
  "args": {},
  "selfhostArgs": {},
  "cloudArgs": {},
  "correlationId": "optional"
}
```

Validation rule: at least one of `path`, `selfhostPath`, `cloudPath` must exist.
Args precedence:
- selfhost uses `selfhostArgs` (fallback `args`)
- cloud uses `cloudArgs` (fallback `args`)

## Response Contract
```json
{
  "ok": true,
  "correlationId": "...",
  "selfhost": { "ok": true, "status": 200, "error": null, "body": {} },
  "cloud": { "ok": false, "status": 400, "error": "...", "body": {} },
  "workflow": "GG::DualSync::Prod",
  "ts": "2026-03-09T...Z"
}
```

## Owner / Ops
- Manual trigger script: `/home/rahman/scripts/gg-manual-trigger.sh`
- Payload templates: `/home/rahman/scripts/dual-sync-templates/*.json`
- n8n API management helper: `/home/rahman/.local/bin/n8n-push`
