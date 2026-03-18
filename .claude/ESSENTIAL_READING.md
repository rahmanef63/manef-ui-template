# Essential Reading — manef-ui

## Untuk Developer Baru (Urutan Baca)

### 1. Arsitektur (10 menit)
- `docs/TARGET_ARCHITECTURE.md` — Boundaries antara Superspace, OpenClaw, dan manef
- `.claude/CLAUDE.md` — Guardrails dan aturan wajib project ini

### 2. Data Flow (10 menit)
- `lib/convex/client.ts` — Convex client setup dan helper hooks
- `features/workspaces/hooks/useOpenClawNavigator.ts` — Workspace context hook
- `vendor/manef-db/` — Type definitions dari backend

### 3. Feature Structure (15 menit)
- `features/agents/` — Contoh feature lengkap
- `features/sessions/` — Contoh feature dengan real-time query
- `features/channels/` — Contoh feature dengan complex bindings

## Mental Model Kunci

### 1. Dua Layer Workspace (JANGAN DICAMPUR)
```
Layer 1 (Legacy/Auth):
  workspaces → members → users (Ent schema)
  Digunakan untuk: auth, membership, invites

Layer 2 (OpenClaw):
  userProfiles → workspaceTrees → workspaceAgents → agents
  Digunakan untuk: semua data runtime OpenClaw
```

### 2. Semua Data Runtime = Read-Only Mirror
Data di Convex adalah mirror dari OpenClaw runtime. Jangan anggap Convex sebagai source of truth untuk agents/sessions/channels.

### 3. Write-Through untuk Setiap Mutasi Runtime
```
User action → UI mutation → Convex update → syncOutbox → Python worker → OpenClaw runtime
```

### 4. appApi Pattern (WAJIB)
```typescript
// BENAR
const data = useAppQuery(appApi.features.agents.api.getAgents, args);
const mutate = useAppMutation(appApi.features.agents.api.updateAgent);

// SALAH — jangan import langsung dari _generated
import { api } from "@/convex/_generated/api";
```

## Checklist Sebelum Commit

- [ ] Tidak ada hardcoded ID atau slug
- [ ] Tidak ada MOCK_* data
- [ ] Semua form input divalidasi dengan Zod
- [ ] Vendor sudah di-sync jika ada perubahan manef-db
- [ ] Tidak ada import langsung dari `vendor/manef-db/` selain via `appApi`

## Checklist Sebelum Feature Baru

- [ ] Folder di `features/{name}/` dengan minimal: `index.tsx`, komponen utama
- [ ] Hook menggunakan `useAppQuery`/`useAppMutation` dari `lib/convex/client`
- [ ] Feature terdaftar di routing (catchAll page handler)
- [ ] Error state dan loading state ditangani

## Troubleshooting Umum

### Type error setelah ubah manef-db
```bash
bash scripts/sync-vendor.sh
# Restart TypeScript server di editor
```

### Data tidak update setelah sync runtime
```bash
cd <USER_HOME>/projects/manef-db
npm run sync:runtime:agents  # atau domain yang relevan
```

### Gateway mati / data kosong
```bash
sudo ss -tlnp | grep 18789
openclaw gateway status
tail -50 /tmp/openclaw-1001/openclaw-$(date +%Y-%m-%d).log
```

### Build error
```bash
npm run build 2>&1 | head -50
# Cek apakah ada perubahan vendor yang belum di-commit
```
