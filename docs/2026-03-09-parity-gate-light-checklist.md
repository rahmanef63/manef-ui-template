> ⚠️ **Context freeze (2026-03-10):** Dokumen ini dibuat untuk fase dual-sync GG/shared Convex. Untuk plan terbaru pemisahan DB `manef-ui`, jadikan dokumen ini referensi historis saja. Ikuti `2026-03-10-manef-ui-db-separation-migration-plan.md` sebagai sumber utama.

# Parity Gate (Light) — 2026-03-09 17:18 UTC

## Scope
- userProfiles
- workspaceTrees
- agents
- agentDelegations
- sessions
- messages
- agentSessions
- dailyNotes
- workspaceFiles

## Method
1. Count-only check per table (selfhost vs cloud)
2. Sample check (20 docs/table)
3. For heavy table (messages): sample + snapshot only (no giant full scan)

## Command Stubs
> Fill token/env first, then run in your parity runner.

```bash
# Example pseudo commands (replace with your convex query wrappers)
# selfhost_count <table>
# cloud_count <table>
# sample_compare <table> --limit 20
```

## Result Matrix
| Table | Selfhost Count | Cloud Count | Delta | Sample Match (20) | Notes |
|---|---:|---:|---:|---|---|
| userProfiles |  |  |  |  |  |
| workspaceTrees |  |  |  |  |  |
| agents |  |  |  |  |  |
| agentDelegations |  |  |  |  |  |
| sessions |  |  |  |  |  |
| messages |  |  |  |  |  |
| agentSessions |  |  |  |  |  |
| dailyNotes |  |  |  |  |  |
| workspaceFiles |  |  |  |  |  |
