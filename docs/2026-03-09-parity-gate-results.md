> ⚠️ **Context freeze (2026-03-10):** Dokumen ini dibuat untuk fase dual-sync GG/shared Convex. Untuk plan terbaru pemisahan DB `manef-ui`, jadikan dokumen ini referensi historis saja. Ikuti `2026-03-10-manef-ui-db-separation-migration-plan.md` sebagai sumber utama.

# Parity Gate Results — 2026-03-09 17:33 UTC

## Summary
Status: **FAIL**

Cloud deployment `proficient-cricket-724` is **not yet parity-aligned** with self-hosted `api.rahmanef.com`.
This is not a small drift — most core tables are still empty on cloud.

## Table Counts

| Table | Self-hosted | Cloud | Delta | Notes |
|---|---:|---:|---:|---|
| userProfiles | 26 | 0 | -26 | FAIL |
| workspaceTrees | 56 | 0 | -56 | FAIL |
| agents | 16 | 1 | -15 | FAIL |
| agentDelegations | 3 | 0 | -3 | FAIL |
| sessions | 29 | 0 | -29 | FAIL |
| messages | timeout | 0 | n/a | selfhost light query timed out |
| agentSessions | 3 | 0 | -3 | FAIL |
| dailyNotes | 9 | 0 | -9 | FAIL |
| workspaceFiles | 117 | 0 | -117 | FAIL |

## Observations
1. Cloud is still effectively a mostly-empty target.
2. Dual-write workflow is now technically working, but it is **not sufficient** to create parity because historical data has not been imported.
3. `messages` on self-hosted still needs special handling due to timeout even in light mode.

## Interpretation
This means we should **not** move to auth hardening or cutover planning yet.
The correct next move is a **real migration sync/import** for core tables, followed by a second parity gate.

## Recommended Next Actions
1. Export/import core tables from self-hosted to cloud.
2. Re-run parity gate counts.
3. Run sample compare only after cloud has non-trivial row counts.
4. Then proceed to auth hardening.
