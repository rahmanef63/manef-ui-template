# manef-ui — Project Guardrails

Updated: 2026-03-13

## Ringkasan Project

**manef-ui** adalah OpenClaw-aware dashboard UI. Frontend layer yang menghubungkan user ke runtime OpenClaw melalui Convex backend (manef-db).

- **URL**: https://gg.<YOUR_DOMAIN>
- **Stack**: Next.js 16, React 19, NextAuth v5, Convex client, Radix UI, Tailwind v4, Zod
- **Backend**: manef-db (Convex Cloud) via `https://dbgg.<YOUR_DOMAIN>`

## Struktur Penting

```
manef-ui/
├── app/                    # Next.js App Router
│   └── dashboard/[workspaceSlug]/[...catchAll]/page.tsx
├── features/               # 45+ feature modules
├── lib/convex/client.ts    # Convex client + hooks
├── vendor/manef-db/        # Synced copy dari manef-db (JANGAN edit langsung)
├── auth.ts                 # NextAuth config
└── scripts/sync-vendor.sh  # Sync vendor dari manef-db
```

## Pattern Import (WAJIB diikuti)

```typescript
import { appApi, useAppQuery, useAppMutation, useAppAction } from "@/lib/convex/client";

// Query
const agents = useAppQuery(appApi.features.agents.api.getAgents, { ownerId });

// Mutation
const updateAgent = useAppMutation(appApi.features.agents.api.updateAgent);

// Action
const run = useAppAction(appApi.features.agents.api.runAgentTask);
```

## Workspace Model (DUA LAYER — JANGAN DICAMPUR)

```
Legacy layer:  workspaces ↔ members ↔ users  (Ent schema, auth/membership)
OpenClaw layer: userProfiles → workspaceTrees → workspaceAgents → agents
```

- Navigator: `useOpenClawNavigator()` → `{ selectedRoot, selectedScope, isAdmin }`
- Selalu gunakan OpenClaw layer untuk agent/session/channel data
- Legacy layer hanya untuk auth dan workspace membership

## Aturan Wajib

### DILARANG
- Edit file di `vendor/manef-db/` secara langsung
- Menggunakan MOCK_* data (sudah dihapus semua per 2026-03-13)
- Hardcode workspace slug atau agent ID
- Import langsung dari `convex/_generated/` (gunakan `appApi` pattern)
- Merge manef-ui dan manef-db sebelum contract workspace/agent/channel/identity stabil

### WAJIB
- Gunakan `appApi.features.<domain>.api.<fn>` untuk semua Convex calls
- Jalankan `bash scripts/sync-vendor.sh` setelah ubah manef-db
- Validasi dengan Zod untuk semua form inputs
- Gunakan `useOpenClawNavigator()` untuk workspace context

## Write-Through Flow

```
UI mutation
  → Convex (manef-db)
  → syncOutbox table
  → process_openclaw_outbox.py (Python worker)
  → ~/.openclaw/openclaw.json (runtime SSOT)
```

Jangan bypass flow ini. Setiap perubahan ke agent/channel/config harus melewati outbox.

## Domain API (24 features)

`agents`, `auth`, `calendar`, `channels`, `config`, `crons`, `dashboard`, `debug`,
`featureStore`, `inbox`, `instances`, `knowledge`, `logs`, `nodes`, `projects`,
`sessions`, `skills`, `tasks`, `usage`, `users`, `workspace`, `workspace_tasks`

## Commands Tersedia

- `/deploy-flow` — Panduan urutan deploy manef-ui
- `/check-sync` — Cek status sync vendor dan runtime
- `/analyze-feature` — Analisis feature module

## Agents Tersedia

- `feature-validator` — Validasi struktur feature module baru
- `openclaw-debugger` — Debug gateway dan sync issues
- `sync-checker` — Cek status vendor sync dan runtime sync

## Quick Commands

```bash
npm run dev                      # Start dev server
npm run build                    # Build production
bash scripts/sync-vendor.sh      # Sync manef-db vendor
npm run auth:devices:list        # List approved CLI devices
npm run auth:devices:approve     # Approve device untuk CLI auth
```

## Health Check

```bash
curl -si https://gg.<YOUR_DOMAIN>              # Frontend
curl -si https://dbgg.<YOUR_DOMAIN>/version    # Backend
sudo docker ps -a | grep -i manef             # Docker containers
```
