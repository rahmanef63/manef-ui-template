# Manef UI

Frontend repo for Manef, served on `https://gg.rahmanef.com`.

Backend ownership has moved to the separate `manef-db` repo, served on
`https://dbgg.rahmanef.com`.

## Auth Setup 

This template now uses `next-auth@5` credentials auth with a simple admin
fallback:

- `AUTH_SECRET`
- `AUTH_DEVICE_SALT`
- `OPENCLAW_SHARED_SECRET`
- `OPENCLAW_ALLOWED_CLOCK_SKEW_SECONDS`
- `OPENCLAW_NONCE_TTL_SECONDS`
- `OPENCLAW_WORKFLOW_URL`

Admin bootstrap credentials and invite-email envs now live in the backend repo
`manef-db`, not in `manef-ui`.

Quick start:

1. Copy `.env.example` to `.env.local` and fill the auth + Convex values.
2. Run `npm install`.
3. Ensure `manef-db` is available if you need the backend locally.
4. Run `npm run dev`.
5. Login at `/login` with your configured admin credentials.

Extending auth:

- Replace credentials auth in `auth.ts` with OAuth/email providers as needed.
- Keep middleware route protection in `middleware.ts`.
- Keep Convex client wiring in `shared/providers/ConvexClientProvider.tsx`.
- For VPS operations on pending-device approvals, use
  [docs/DEVICE_APPROVAL_CLI.md](/home/rahman/projects/manef-ui/docs/DEVICE_APPROVAL_CLI.md).

Debugging dashboard fetch churn:

- Open browser devtools console and run:
  `localStorage.setItem("manef:debug", "1"); location.reload();`
- Disable again with:
  `localStorage.removeItem("manef:debug"); location.reload();`
- Debug logs are prefixed with `"[manef-debug]"`.

Roadmap aktif untuk parity terhadap OpenClaw resmi ada di:

- [docs/TARGET_ARCHITECTURE.md](/home/rahman/projects/manef-ui/docs/TARGET_ARCHITECTURE.md)
- [docs/OPENCLAW_FRONTEND_PARITY_TASKLIST.md](/home/rahman/projects/manef-ui/docs/OPENCLAW_FRONTEND_PARITY_TASKLIST.md)

Session handoff references:

- frontend tasklist:
  [OPENCLAW_FRONTEND_PARITY_TASKLIST.md](/home/rahman/projects/manef-ui/docs/OPENCLAW_FRONTEND_PARITY_TASKLIST.md)
- backend tasklist:
  [OPENCLAW_BACKEND_PARITY_TASKLIST.md](/home/rahman/projects/manef-db/docs/OPENCLAW_BACKEND_PARITY_TASKLIST.md)
- Superspace repo clone:
  [superspace](/home/rahman/projects/superspace)

Roadmap produk berikutnya yang harus dijaga:

- `Feature Store`
- `Agent Builder`
- integrasi `Superspace Apps`

Catatan konteks:

- `Feature Store` direncanakan menjadi tempat katalog app/builder per workspace
- `Agent Builder` direncanakan mendukung dua mode:
  `JSON block prerender` dan `custom HTML/TypeScript`
- target integrasi eksternal yang disebut saat ini:
  `https://github.com/zianinn/v0-remix-of-superspace-app-aazian.git`
- repo eksternal tersebut belum menjadi source of truth frontend ini; konteksnya
  saat ini dicatat sebagai target downstream integration

Temuan Superspace yang sudah diverifikasi:

- acuan `Feature Store` yang paling relevan adalah pola `menu-store`
- acuan `Workspace Store` yang paling relevan adalah pola `workspace-store`
- file referensi penting:
  - [MenuStorePage.tsx](/home/rahman/projects/superspace/frontend/features/menus/MenuStorePage.tsx)
  - [WorkspaceStorePage.tsx](/home/rahman/projects/superspace/frontend/features/workspace-store/WorkspaceStorePage.tsx)
  - [menu_manifest_data.ts](/home/rahman/projects/superspace/convex/features/menus/menu_manifest_data.ts)
  - [optional_features_catalog.ts](/home/rahman/projects/superspace/convex/features/menus/optional_features_catalog.ts)
  - [all-previews.ts](/home/rahman/projects/superspace/frontend/shared/preview/all-previews.ts)

Kesimpulan implementasi:

- `Feature Store` `manef` nanti harus meniru pola:
  `catalog -> preview -> install to workspace`
- tapi tetap harus memahami:
  `workspace`, `sub-workspace`, `agents`, `channels`, dan runtime OpenClaw
- `Agent Builder` tetap menjadi fitur khusus `manef`

Task dinyatakan selesai hanya bila:

- CRUD database backend tersedia
- data termirror dengan runtime OpenClaw
- hasil write terbaca ulang di UI tanpa mock/fallback statis

## OpenClaw Workspace Navigator

Dashboard header sekarang memakai navigator OpenClaw berbasis data backend, bukan
hanya daftar `workspaces` legacy.

Source data:

- `userProfiles`
- `workspaceTrees`
- `agents`
- `agentDelegations`

Perilaku UI:

- header switcher pertama memilih root/contact workspace
- jika root tersebut punya child agent/sub-workspace, header kedua otomatis muncul
- pilihan navigator disimpan stabil di browser agar tidak bolak-balik saat auth
  atau Convex reconnect

Halaman yang sudah mengikuti scope navigator:

- `Agents`
- `Sessions`
- `Usage`

Panel yang sekarang sudah membaca mirror runtime OpenClaw dari Convex:

- `Skills`
- `Channels`
- `Logs`
- `Nodes + Exec Approvals`

Progress terbaru:

- `Channels` sekarang juga menampilkan binding live:
  - `channel -> workspace`
  - `identity -> workspace`
- `Feature Store` sekarang sudah hidup di admin menu:
  - katalog item live dari backend
  - daftar feature `manef` yang nyata
  - preview metadata live
  - install/uninstall per workspace
  - metadata capability:
    `featureKey`, `route`, `requiredRoles`, `grantedSkillKeys`, `runtimeDomains`
- `Agent Builder Drafts` sekarang sudah hidup di `Feature Store`:
  - draft `json_blocks`
  - draft `custom_code`
  - create/edit/mark-ready/archive per workspace
  - contract output minimum:
    `requiredFeatureKeys`, `requiredSkillKeys`, linked agents/channels
- `Skills` sekarang diposisikan sebagai `Skills Store`:
  - filter source-aware
  - label `by Rahman`, `by ClawHub`, `by OpenClaw`
  - metadata `trust`, `scope`, dan `install state`
  - summary status store live dari backend
  - grant/revoke skill ke workspace aktif
  - assigned agent count per scope aktif
- login/registrasi sekarang mendukung:
  - `email atau nomor telepon`
  - request registrasi
  - request forgot-password
  - temporary password
  - wajib ganti password saat first login
- `Admin -> Users` sekarang menampilkan:
  - daftar workspace per user
  - daftar feature workspace
  - kolom password sementara + reset password sementara
- `WorkspaceRouteGuard` sekarang mengakui slug workspace OpenClaw langsung,
  jadi admin bisa membuka workspace non-legacy tanpa kena error
  `Workspace tidak ditemukan`
- workspace dengan `featureKeys` eksplisit sekarang membatasi:
  - sidebar
  - bottom navigation
  - page tabs
  - route leaf dashboard
- `Feature Store` sekarang juga menampilkan capability policy live untuk workspace
  aktif:
  - installed features
  - granted skills
  - agent policy rows
- `Agent Builder Drafts` sekarang juga divalidasi terhadap capability workspace:
  - requirement feature
  - requirement skill
  - linked agent yang tersedia di workspace
  - gap skill per agent
- `Agent Builder` mode `json_blocks` sekarang punya preview minimal:
  - block aman yang didukung:
    `page_header`, `stats`, `section_card`, `key_values`, `callout`
  - JSON invalid tidak bisa disimpan
- RBAC store sekarang lebih tegas:
  - route leaf dashboard mengikuti `requiredRoles`
  - `Skills Store` menjadi read-only untuk non-admin
  - menu/tab workspace mengikuti `featureKeys`

Remaining phase terdekat:

- renderer `Agent Builder`:
  `json_blocks`
- editor aman `Agent Builder`:
  `custom_code`
- publish/downstream bridge ke `Superspace`

Skills Store note:

- integrasi `ClawHub` saat ini diperlakukan sebagai `pull-ready`, bukan webhook
  push
- source of truth tetap runtime sync lokal backend:
  `openclaw skills list --json` + metadata skill lokal yang ada di host
- jika metadata/lockfile `ClawHub` tersedia di host, item akan otomatis muncul
  sebagai `by ClawHub` tanpa perlu ubah komponen frontend lagi

Admin tooling terbaru:

- halaman `Users` sekarang punya panel `Workspace Access Bindings`
- admin bisa attach/detach:
  - `channel/account -> workspace`
  - `identity -> workspace`
- admin bisa mengatur policy channel:
  - `multi-workspace`
  - `single-primary`

Catatan:

- beberapa halaman lama masih global/mock dan belum full scope-aware, misalnya
  sebagian panel `nodes`, `instances`, `logs`, dan `config`
- transisi antar menu dashboard sekarang harus menampilkan skeleton loading,
  bukan kartu overview asli

Included:

- Convex-backed data access through the separate `manef-db` repo
- Member invite emails using [Resend](https://resend.com)
- User sign-in with [NextAuth.js](https://authjs.dev)
- Website router with [Next.js](https://nextjs.org/)
- Slick UX with [shadcn/ui](https://ui.shadcn.com/)

Check out [Convex docs](https://docs.convex.dev/home), and
[Convex Ents docs](https://labs.convex.dev/convex-ents)

## Screenshots

`<img alt="Personal Account and Teams" src="https://cdn.sanity.io/images/ts10onj4/production/574eeb5fd38aa598e2068b765390e0dc8b220075-1890x742.png" width="400">`

`<img alt="Members management" src="https://cdn.sanity.io/images/ts10onj4/production/2a0334dddfdc3a52bb7ffb5c74b58edf8a7b9e03-1894x1130.png" width="400">`

`<img alt="Invites management" src="https://cdn.sanity.io/images/ts10onj4/production/ee70ea18510494e3b67eb58639fc8f11344a4a83-1512x398.png" width="330">`

`<img alt="Invite accept flow" src="https://cdn.sanity.io/images/ts10onj4/production/afbf9daf190f992af8eadfba6daaf175b7bea679-1864x1070.png" width="400">`

## Repo Split

- Frontend repo: `rahmanef63/manef-ui`
- Backend repo: `rahmanef63/manef-db`
- Frontend domain: `gg.rahmanef.com`
- Backend domain: `dbgg.rahmanef.com`
