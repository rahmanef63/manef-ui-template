> ⚠️ **Context freeze (2026-03-10):** Dokumen ini dibuat untuk fase dual-sync GG/shared Convex. Untuk plan terbaru pemisahan DB `manef-ui`, jadikan dokumen ini referensi historis saja. Ikuti `2026-03-10-manef-ui-db-separation-migration-plan.md` sebagai sumber utama.

# Secret Rotation Inventory (Initial) — 2026-03-09

## High Priority (rotate first)
1. n8n webhook/API keys (if ever used in shell history/shared logs)
2. Convex deployment tokens used for dual-write workflow headers
3. Any temporary bearer key used in migration scripts

## Medium Priority
1. Dokploy credentials if exposed in plaintext docs or command history
2. Legacy inactive workflow credentials in n8n

## Action Plan
1. Enumerate active credentials in n8n workflow `GG::DualSync::Prod`
2. Rotate Convex tokens (selfhost + cloud) and update workflow headers
3. Rotate `N8N_API_KEY` in `~/.openclaw/.env`
4. Verify manual trigger + production webhook still pass
5. Revoke old credentials and document revocation timestamp

## Evidence to collect
- Rotation timestamp UTC
- New credential last-4 identifier
- Verification command output (redacted)
