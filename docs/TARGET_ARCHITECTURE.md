# Target Architecture

Updated: 2026-03-12

Dokumen ini menjadi SSOT arsitektur target untuk `manef-ui`.

Tujuan utamanya:

1. menjaga boundary yang jelas antara `Superspace`, `OpenClaw`, dan `manef`
2. mencegah keputusan tergesa seperti merge repo terlalu awal
3. memberi arah implementasi `Feature Store` dan `Agent Builder`

## Decision

Keputusan saat ini:

- **jangan merge repo dulu**
- `Superspace` diperlakukan sebagai **product shell reference**
- `OpenClaw` diperlakukan sebagai **runtime subsystem**
- `manef-ui` + `manef-db` diperlakukan sebagai **integration layer aktif**

Artinya:

- `OpenClaw` bukan hanya satu feature biasa di Superspace
- `Superspace` juga bukan source of truth untuk runtime OpenClaw
- convergence boleh terjadi nanti, tetapi setelah contract stabil

## Product Boundaries

### 1. Superspace Domain

Tanggung jawab domain ini:

- workspace/product shell
- feature catalog
- feature install surface
- preview surface
- builder/app ecosystem
- generic SaaS feature UX

Reference files:

- [MenuStorePage.tsx](<USER_HOME>/projects/superspace/frontend/features/menus/MenuStorePage.tsx)
- [WorkspaceStorePage.tsx](<USER_HOME>/projects/superspace/frontend/features/workspace-store/WorkspaceStorePage.tsx)
- [menu_manifest_data.ts](<USER_HOME>/projects/superspace/convex/features/menus/menu_manifest_data.ts)
- [optional_features_catalog.ts](<USER_HOME>/projects/superspace/convex/features/menus/optional_features_catalog.ts)

### 2. OpenClaw Domain

Tanggung jawab domain ini:

- agents
- channels
- sessions
- logs
- runtime config
- cron jobs
- workspace files
- local runtime state

Reference runtime paths:

- `~/.openclaw/openclaw.json`
- `~/.openclaw/workspace*`
- `~/.openclaw/agents/*`
- `~/.openclaw/cron/jobs.json`
- `journalctl --user-unit openclaw-gateway`

### 3. Manef Integration Domain

Tanggung jawab `manef`:

- workspace switcher OpenClaw-aware
- auth flow user/admin yang cocok untuk context OpenClaw
- runtime mirror `OpenClaw -> Convex`
- write-through aman `dashboard -> local runtime`
- UI admin bindings:
  - `channel -> workspace`
  - `identity -> workspace`
  - `policy channel`
- pondasi `Feature Store` yang tetap `workspace + agent + runtime aware`

Relevant files:

- [useOpenClawNavigator.ts](<USER_HOME>/projects/manef-ui/features/workspaces/hooks/useOpenClawNavigator.ts)
- [WorkspaceSwitcher.tsx](<USER_HOME>/projects/manef-ui/features/workspaces/components/WorkspaceSwitcher.tsx)
- [Users.tsx](<USER_HOME>/projects/manef-ui/features/users/components/Users.tsx)
- [channels/index.tsx](<USER_HOME>/projects/manef-ui/features/channels/index.tsx)
- [OPENCLAW_FRONTEND_PARITY_TASKLIST.md](<USER_HOME>/projects/manef-ui/docs/OPENCLAW_FRONTEND_PARITY_TASKLIST.md)

## Integration Contract

Contract bersama yang harus distabilkan sebelum merge/convergence:

### Workspace Contract

- satu `root workspace` bisa punya banyak `child/sub-workspace`
- satu workspace bisa punya banyak agent
- setiap agent punya `primary workspace`
- child workspace **tidak otomatis** mewarisi seluruh context root
- inheritance harus eksplisit

### Identity Contract

- satu `userProfile` bisa punya banyak identity/channel
- login user bisa memakai identifier yang cocok dengan profile:
  email atau phone
- identity binding menentukan workspace mana yang boleh diakses

### Channel Contract

- channel/account bisa dipetakan ke satu atau banyak workspace
- policy channel:
  - `multi-workspace`
  - `single-primary`
- write manual dari dashboard harus akhirnya terbaca lagi dari runtime

### Feature Contract

- feature item harus punya `scope`
  - `workspace-local`
  - `workspace-shared`
  - `general/shared`
- feature install tidak boleh buta terhadap workspace aktif
- preview, install, dan enablement harus berbasis backend live

### Builder Contract

- `Agent Builder` mendukung:
  - `json_blocks`
  - `custom_code`
- output builder harus tetap dikaitkan ke workspace
- builder output harus siap dipublish ke target downstream seperti Superspace

## Recommended Approach

Urutan implementasi yang disarankan:

1. stabilkan contract `workspace/agent/channel/identity`
2. bangun `Feature Store` di `manef`
3. bangun `Agent Builder` di atas contract itu
4. baru evaluasi shared package atau convergence dengan Superspace

## Why Not Merge Yet

Alasan belum merge:

- model runtime OpenClaw masih lebih kompleks dari feature biasa
- contract `workspace -> agents[] -> channels -> identities` masih bergerak
- `manef` masih menjadi tempat validasi arsitektur integrasi
- merge terlalu cepat akan membuat domain boundaries kabur

## Remaining Near-Term Work

Frontend phase berikutnya:

- `Feature Store` route + menu entry
- katalog item live dari backend
- preview panel
- install/uninstall per workspace
- draft UI `Agent Builder`

Track detail di:

- [OPENCLAW_FRONTEND_PARITY_TASKLIST.md](<USER_HOME>/projects/manef-ui/docs/OPENCLAW_FRONTEND_PARITY_TASKLIST.md)
