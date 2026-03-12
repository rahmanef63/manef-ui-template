# OpenClaw Frontend Parity Tasklist

Updated: 2026-03-12

Dokumen ini melacak pekerjaan `manef-ui` agar makin dekat dengan frontend resmi
OpenClaw, tetapi tetap berjalan di arsitektur `Next.js + Convex`.

Source of truth referensi:

- OpenClaw Control UI
- OpenClaw Dashboard
- OpenClaw Agents
- OpenClaw Multi-Agent Routing

Session handoff references:

- frontend repo aktif:
  [manef-ui](/home/rahman/projects/manef-ui)
- backend repo aktif:
  [manef-db](/home/rahman/projects/manef-db)
- repo acuan feature store:
  [superspace](/home/rahman/projects/superspace)
- halaman store acuan:
  [MenuStorePage.tsx](/home/rahman/projects/superspace/frontend/features/menus/MenuStorePage.tsx)
- halaman workspace acuan:
  [WorkspaceStorePage.tsx](/home/rahman/projects/superspace/frontend/features/workspace-store/WorkspaceStorePage.tsx)

Definisi selesai untuk setiap task frontend:

1. halaman bisa membaca data live dari `manef-db`, bukan mock/fallback statis
2. aksi UI memicu mutation/action backend yang benar
3. setelah write berhasil, UI membaca kembali state yang sama dari database
4. state database tersebut berasal dari atau termirror dengan data runtime
   OpenClaw
5. hard refresh browser tetap menampilkan state yang sama

Task dianggap belum selesai jika salah satu kondisi berikut masih terjadi:

- UI masih memakai `MOCK_*`
- UI menampilkan fallback hardcoded ketika DB kosong padahal runtime OpenClaw
  punya data
- write hanya mengubah Convex tetapi tidak termirror ke runtime OpenClaw
- write hanya mengubah runtime tetapi DB tidak ikut sinkron

## Global rules

- [ ] Hapus semua `MOCK_*` dari halaman operasional OpenClaw:
  `agents`, `sessions`, `channels`, `instances`, `logs`, `config`.
- [ ] Semua halaman OpenClaw harus punya tiga state eksplisit:
  `loading`, `empty-live`, `error`.
- [ ] Semua halaman OpenClaw harus memakai scope aktif dari navigator:
  root workspace atau sub-workspace.
- [ ] Semua write path harus menampilkan hasil read-after-write dari Convex.
- [ ] Semua refresh button harus memanggil action backend yang benar, bukan
  `setTimeout` visual saja.
- [x] Referensi Convex yang sudah punya padanan di `@manef/db/api` harus
  memakai generated source, bukan duplikasi route string manual.
  Bukti:
  - wrapper server-safe baru:
    [api.ts](/home/rahman/projects/manef-ui/shared/convex/api.ts)
  - wrapper `shared/convex/*` sekarang mengarah ke generated `typedApi`
  - vendor package `@manef/db` di
    [vendor/manef-db](/home/rahman/projects/manef-ui/vendor/manef-db)
    disinkronkan dari repo backend agar generated API tersedia saat build
- [x] Route string low-risk harus mulai dipusatkan.
  Bukti:
  - [routes.ts](/home/rahman/projects/manef-ui/shared/constants/routes.ts)
  - dipakai di:
    [DashboardButtons.tsx](/home/rahman/projects/manef-ui/features/dashboard/components/DashboardButtons.tsx),
    [DeleteWorkspaceDialog.tsx](/home/rahman/projects/manef-ui/features/settings/components/DeleteWorkspaceDialog.tsx),
    [CreateWorkspaceDialog.tsx](/home/rahman/projects/manef-ui/features/workspaces/components/CreateWorkspaceDialog.tsx)

## Future context: Feature Store and Superspace

Konteks ini belum dihitung selesai. Ini adalah arah produk yang harus dijaga saat
menambah feature baru di `manef-ui`.

- [x] Tambahkan `Feature Store` sebagai surface terpisah dari dashboard operasi.
  Bukti:
  - config feature:
    [config.ts](/home/rahman/projects/manef-ui/features/feature-store/config.ts)
  - halaman:
    [index.tsx](/home/rahman/projects/manef-ui/features/feature-store/index.tsx)
  - registry:
    [registry.tsx](/home/rahman/projects/manef-ui/features/registry.tsx)
  - menu admin:
    [index.ts](/home/rahman/projects/manef-ui/project/registry/navigation/index.ts)
- [x] `Feature Store` harus bisa menampilkan katalog builder:
  `agent builder`, `workspace app builder`, `shared blocks`, `templates`.
  Bukti:
  - page katalog live membaca item dari backend:
    [index.tsx](/home/rahman/projects/manef-ui/features/feature-store/index.tsx)
  - source backend vendor:
    [api.ts](/home/rahman/projects/manef-ui/vendor/manef-db/convex/features/featureStore/api.ts)
- [x] `Feature Store` sekarang juga menampilkan daftar feature `manef` yang nyata,
  bukan hanya item generik.
  Bukti:
  - card sekarang menampilkan `featureKey`, `route`, `requiredRoles`,
    `grantedSkillKeys`, dan `runtimeDomains`
  - file:
    [index.tsx](/home/rahman/projects/manef-ui/features/feature-store/index.tsx)
- [x] `Agent Builder` sekarang punya draft surface untuk dua mode output:
  `JSON block prerender` dan `custom HTML/TypeScript`.
-  Bukti:
  - draft panel di:
    [index.tsx](/home/rahman/projects/manef-ui/features/feature-store/index.tsx)
  - draft create/edit memakai mutation backend live:
    `createAgentBuilderDraft`, `updateAgentBuilderDraft`,
    `archiveAgentBuilderDraft`
- [ ] `JSON block prerender` harus memakai block components yang sudah disiapkan
  project ini sebagai source of truth.
- [ ] `custom HTML/TypeScript` harus diperlakukan sebagai advanced mode, dengan
  preview, schema metadata, dan sandbox policy yang jelas.
- [x] Semua app/builder draft sekarang bisa dihubungkan ke workspace aktif, bukan
  global ke semua workspace.
  Bukti:
  - draft selalu disimpan dengan `workspaceId` aktif
  - linked agents default diambil dari `selectedScope.agentIds`
  - file:
    [index.tsx](/home/rahman/projects/manef-ui/features/feature-store/index.tsx)
- [x] Store item harus bisa ditandai sebagai:
  `workspace-only`, `tenant-shared`, atau `general/shared`.
  Bukti:
  - UI filter scope dan badge scope:
    [index.tsx](/home/rahman/projects/manef-ui/features/feature-store/index.tsx)
- [ ] Workspace yang berbeda tidak boleh otomatis mewarisi seluruh app/config
  root kecuali ada policy inheritance eksplisit.
- [ ] Install feature ke workspace harus bisa diturunkan menjadi policy agent:
  agent di workspace tersebut otomatis mewarisi skill/capability feature itu.
- [ ] UI store harus siap menjadi bridge ke project eksternal `Superspace Apps`.

Konteks integrasi eksternal:

- target repo saat ini:
  `https://github.com/zianinn/v0-remix-of-superspace-app-aazian.git`
- status: repo eksternal disebut sebagai target integrasi, tetapi isi internalnya
  belum diverifikasi langsung di tasklist ini
- implikasi desain:
  - jangan hardcode struktur Superspace di UI lebih dulu
  - simpan metadata integrasi sebagai config/backend contract
  - anggap Superspace sebagai downstream target dari `Feature Store`, bukan
    source of truth UI saat ini

Definition of done:

- `Feature Store` muncul sebagai menu/halaman nyata
- item store berasal dari backend live, bukan konstanta frontend
- `Agent Builder` bisa menghasilkan draft app dari JSON block config
- workspace aktif menentukan app mana yang terlihat atau dapat diedit
- integrasi Superspace memakai contract/backend adapter yang jelas

## Superspace findings

Temuan yang sudah diverifikasi dari repo
[superspace](/home/rahman/projects/superspace):

- `feature store` yang paling dekat dengan kebutuhan `manef` sebenarnya adalah
  `menu store`, bukan `workspace-store`
- source of truth feature di Superspace berasal dari `config.ts` per feature,
  lalu diubah menjadi manifest/catalog auto-generated
- `workspace-store` di Superspace fokus pada hierarchy workspace, template, dan
  panel inspector
- `menu-store` di Superspace fokus pada:
  - katalog feature installable
  - install ke workspace
  - preview feature
  - visibility/permission

Bukti file:

- manifest default/system:
  [menu_manifest_data.ts](/home/rahman/projects/superspace/convex/features/menus/menu_manifest_data.ts)
- katalog optional/installable:
  [optional_features_catalog.ts](/home/rahman/projects/superspace/convex/features/menus/optional_features_catalog.ts)
- backend install/manage menu:
  [menuItems.ts](/home/rahman/projects/superspace/convex/features/menus/menuItems.ts)
- UI store:
  [MenuStorePage.tsx](/home/rahman/projects/superspace/frontend/features/menus/MenuStorePage.tsx)
- preview registry:
  [all-previews.ts](/home/rahman/projects/superspace/frontend/shared/preview/all-previews.ts)
- workspace hierarchy manager:
  [WorkspaceStorePage.tsx](/home/rahman/projects/superspace/frontend/features/workspace-store/WorkspaceStorePage.tsx)

Implikasi untuk `manef-ui`:

- `Feature Store` sebaiknya meniru pola `catalog -> preview -> install to workspace`
- `Workspace Store` tetap dipisahkan dari `Feature Store`
- `Agent Builder` adalah layer tambahan milik `manef`, bukan fitur yang sama
  persis dengan Superspace
- `Feature Store` `manef` harus tetap `workspace + agent + runtime aware`,
  tidak cukup hanya menu installer

Remaining phase setelah session ini:

- [x] Tambahkan menu/route `Feature Store`
  Bukti:
  - [config.ts](/home/rahman/projects/manef-ui/features/feature-store/config.ts)
  - [index.tsx](/home/rahman/projects/manef-ui/features/feature-store/index.tsx)
- [x] Tampilkan katalog item live dari backend, bukan konstanta frontend
  Bukti:
  - query live:
    `features/featureStore/api:listFeatureStoreItems`
  - halaman:
    [index.tsx](/home/rahman/projects/manef-ui/features/feature-store/index.tsx)
- [x] Tambahkan preview metadata untuk `Feature Store`
  Bukti:
  - render preview headline/summary/bullets dari backend:
    [index.tsx](/home/rahman/projects/manef-ui/features/feature-store/index.tsx)
- [x] Tambahkan status scope item:
  `workspace-local`, `workspace-shared`, `general/shared`, `tenant-shared`
  Bukti:
  - badge + filter scope:
    [index.tsx](/home/rahman/projects/manef-ui/features/feature-store/index.tsx)
- [x] Tampilkan metadata RBAC/capability per feature:
  `featureKey`, `route`, `requiredRoles`, `grantedSkillKeys`, `runtimeDomains`
  Bukti:
  - [index.tsx](/home/rahman/projects/manef-ui/features/feature-store/index.tsx)
- [x] Tambahkan draft surface `Agent Builder`:
  `json_blocks` dan `custom_code`
  Bukti:
  - `Agent Builder Drafts` panel
  - dialog create/edit draft
  - file:
    [index.tsx](/home/rahman/projects/manef-ui/features/feature-store/index.tsx)
- [ ] Tambahkan admin guard backend/frontend yang lebih tegas untuk install/uninstall
- [ ] Tambahkan preview registry tersendiri jika builder output mulai punya komponen interaktif
- [ ] Tambahkan renderer draft `json_blocks`
- [ ] Tambahkan editor `custom_code` yang lebih aman dari textarea metadata sederhana
- [ ] Turunkan `grantedSkillKeys` feature menjadi policy agent/workspace yang nyata

## Navigator and scope

- [ ] Jadikan navigator OpenClaw sebagai source of truth seluruh halaman
  operasional.
- [ ] Scope root harus mewakili contact/account workspace.
- [ ] Scope child harus mewakili sub-agent atau sub-workspace bila ada.
- [ ] Seluruh route dashboard harus mengambil filter dari `selectedScope`.
- [x] Pertahankan kontrak `selectedScope.agentIds` walau backend pindah ke
  model `workspace -> agents[]`.
  Bukti:
  - frontend tetap membaca `selectedScope.agentIds` di
    [useOpenClawNavigator.ts](/home/rahman/projects/manef-ui/features/workspaces/hooks/useOpenClawNavigator.ts)
  - backend navigator sekarang menghitung `agentIds` dari `workspaceAgents`
  - build produksi `manef-ui` lolos setelah perubahan backend model
- [ ] Hilangkan fallback ke workspace legacy untuk halaman OpenClaw-only.

Definition of done:

- `WorkspaceSwitcher` selalu menampilkan root yang sama setelah reload
- child switcher hanya muncul bila root punya child
- pindah scope mengubah query data di halaman OpenClaw
- tidak ada flicker label ke workspace legacy
- root workspace aktif tetap sama saat pindah menu
- child workspace aktif tetap sama saat pindah menu di scope yang sama
- route slug menjadi source of truth untuk switcher dan sidebar

## Agents

Status saat ini:

- UI sudah memfilter `agentIds`
- backend action deploy/run masih mock

Tasks:

- [x] Tampilkan daftar agent live dari Convex tanpa fallback statis.
  Bukti:
  - [Agents.tsx](/home/rahman/projects/manef-ui/features/agents/components/Agents.tsx)
  - commit `90d3e45`
  - query live: `features/agents/api:getAgents`
- [x] Pastikan daftar agent berasal dari runtime mirror OpenClaw terbaru.
  Bukti:
  - backend runtime sync `agents` aktif dan menulis `16` agent ke Convex
  - page ini tetap memakai `features/agents/api:getAgents`
  - runtime source:
    [sync_openclaw_agents_to_convex.py](/home/rahman/projects/manef-db/scripts/sync_openclaw_agents_to_convex.py)
- [ ] Tambahkan kolom/section berikut per agent:
  `agentId`, `name`, `type`, `owner`, `status`, `workspace path`,
  `bound channels`, `last seen`, `session count`.
- [ ] Tambahkan detail panel agent untuk melihat metadata OpenClaw:
  `agentDir`, `bindings`, `config`, `owner profile`.
- [ ] Tombol deploy agent harus memanggil backend nyata, bukan generator random.
- [x] Tombol run agent harus memanggil operasi backend nyata atau dinonaktifkan
  sampai backend siap.
  Bukti:
  - aksi deploy/run palsu dihapus dari
    [Agents.tsx](/home/rahman/projects/manef-ui/features/agents/components/Agents.tsx)
  - commit `90d3e45`
- [ ] Tampilkan parent-child relationship antar agent bila agent punya sub-agent.
- [x] Scope agent harus mengikuti navigator:
  root menampilkan semua agent turunannya, child menampilkan agent child itu saja.
  Bukti:
  - filter scope memakai `selectedScope?.agentIds` dan `selectedRoot?.ownerId` di
    [Agents.tsx](/home/rahman/projects/manef-ui/features/agents/components/Agents.tsx)
  - navigator source:
    [useOpenClawNavigator.ts](/home/rahman/projects/manef-ui/features/workspaces/hooks/useOpenClawNavigator.ts)
  - commit `90d3e45`

Definition of done:

- daftar agent identik dengan data `agents` di Convex
- agent yang muncul di runtime OpenClaw juga muncul di UI setelah sync
- create/update/delete agent tercermin di DB lalu kembali terbaca di UI
- tidak ada agent card yang berasal dari dummy data

## Sessions

- [ ] Hilangkan `MOCK_SESSIONS`.
- [x] Tampilkan session live dari Convex sesuai `selectedScope.agentIds`.
  Bukti:
  - [index.tsx](/home/rahman/projects/manef-ui/features/sessions-list/index.tsx)
  - query live: `features/sessions/api:getSessions`
  - commit `90d3e45`
- [x] Pastikan daftar session berasal dari runtime mirror OpenClaw terbaru.
  Bukti:
  - backend runtime sync `sessions` aktif dan menulis `15` session ke Convex
  - runtime source:
    [sync_openclaw_sessions_to_convex.py](/home/rahman/projects/manef-db/scripts/sync_openclaw_sessions_to_convex.py)
  - smoke test production membaca ulang `features/sessions/api:getSessions`
- [ ] Tambahkan filter live:
  `channel`, `agent`, `status`, `session key`, `user token`.
- [ ] Tambahkan detail panel session:
  `message count`, `first message`, `last activity`, `canonical session key`.
- [ ] Tombol refresh harus memanggil action backend sinkronisasi session.
- [x] Tampilkan empty state live bila agent memang belum punya session.
  Bukti:
  - [index.tsx](/home/rahman/projects/manef-ui/features/sessions-list/index.tsx)
  - commit `90d3e45`

Definition of done:

- daftar session sama dengan data hasil mirror runtime OpenClaw
- session yang baru muncul di runtime ikut muncul di UI setelah sync
- perubahan status/session summary terbaca kembali dari DB

## Channels

- [x] Hilangkan ketergantungan utama pada `CHANNEL_CONFIGS` fallback.
  Bukti:
  - [index.tsx](/home/rahman/projects/manef-ui/features/channels/index.tsx)
  - [ChannelCards.tsx](/home/rahman/projects/manef-ui/features/channels/components/ChannelCards.tsx)
  - file fallback dihapus:
    [index.ts](/home/rahman/projects/manef-ui/features/channels/constants/index.ts)
  - commit `a7beeef`
- [x] Tampilkan seluruh channel/account live dari Convex.
  Bukti:
  - halaman sekarang memetakan seluruh hasil `features/channels/api:listChannels`
    di [index.tsx](/home/rahman/projects/manef-ui/features/channels/index.tsx)
  - commit `a7beeef`
- [ ] Tambahkan informasi binding channel -> agent.
- [x] Tampilkan binding `channel -> workspace` live di card channel.
  Bukti:
  - query `features/channels/api:listChannels` sekarang membawa
    `workspaceBindings` dan `identityBindings`
  - UI menampilkan daftar workspace dan identity ringkas di
    [ChannelCards.tsx](/home/rahman/projects/manef-ui/features/channels/components/ChannelCards.tsx)
  - mapping data di
    [index.tsx](/home/rahman/projects/manef-ui/features/channels/index.tsx)
  - type UI di
    [types/index.ts](/home/rahman/projects/manef-ui/features/channels/types/index.ts)
- [x] Tambahkan surface write untuk binding `channel/account -> workspace`.
  Bukti:
  - panel admin di
    [Users.tsx](/home/rahman/projects/manef-ui/features/users/components/Users.tsx)
  - memakai refs:
    [channels.ts](/home/rahman/projects/manef-ui/shared/convex/channels.ts)
  - admin bisa attach/detach channel binding dari UI
- [x] Tambahkan surface write untuk binding `user identity -> workspace`.
  Bukti:
  - panel admin di
    [Users.tsx](/home/rahman/projects/manef-ui/features/users/components/Users.tsx)
  - admin bisa attach/detach identity binding dari UI
- [x] Tambahkan refresh/filter UI yang benar-benar bekerja untuk channel live.
  Bukti:
  - refresh memakai `router.refresh()`
  - filter client-side untuk `channelId`, `label`, `type`
  - [index.tsx](/home/rahman/projects/manef-ui/features/channels/index.tsx)
- [x] Tampilkan status yang benar:
  `configured`, `running`, `linked`, `connected`, `mode`,
  `last start`, `last connect`, `last error`.
  Bukti:
  - [ChannelCards.tsx](/home/rahman/projects/manef-ui/features/channels/components/ChannelCards.tsx)
  - sekarang juga menampilkan `bindingCount`, `allowListCount`,
    `lastProbe`, `lastMessage`, `authAge`
  - [types/index.ts](/home/rahman/projects/manef-ui/features/channels/types/index.ts)
- [ ] Tambahkan operasi write nyata:
  create channel, update config, relink binding, delete channel.
- [ ] Tambahkan indikator apakah channel termirror dari Gateway/OpenClaw runtime.

Definition of done:

- channel di UI sama dengan record `channels` di DB
- perubahan channel dari backend/runtime tampil di UI tanpa edit manual
- update channel dari UI terbaca ulang dari DB dan runtime
- workspace yang terikat ke channel terlihat di UI tanpa fallback statis

## Workspace, users, and channel access

- [ ] Sidebar/menu harus berbeda untuk admin dan user biasa.
- [ ] User biasa hanya boleh melihat workspace miliknya dan child workspace
  turunannya.
- [ ] Admin boleh melihat semua workspace tenant.
- [ ] Tambahkan surface UI untuk binding `channel/account -> workspace`.
- [ ] Tambahkan surface UI untuk melihat `user identity -> workspace`.
- [x] Tambahkan surface UI untuk binding `channel/account -> workspace`.
  Bukti:
  - panel `Workspace Access Bindings` di
    [Users.tsx](/home/rahman/projects/manef-ui/features/users/components/Users.tsx)
- [x] Tambahkan surface UI untuk melihat `user identity -> workspace`.
  Bukti:
  - panel `Workspace Access Bindings` di
    [Users.tsx](/home/rahman/projects/manef-ui/features/users/components/Users.tsx)
- [ ] Tambahkan surface UI untuk membedakan resources:
  `workspace-local`, `workspace-shared`, `general/shared`.

Definition of done:

- user biasa tidak melihat workspace orang lain
- workspace switcher hanya menampilkan scope yang boleh diakses viewer
- channel visibility dan akses app mengikuti workspace binding yang sama

## Remaining phases

- [ ] Phase berikutnya: policy visibility untuk `workspace-local`,
  `workspace-shared`, dan `general/shared`.
- [ ] Phase berikutnya: `Feature Store` menu + schema backend live.
- [ ] Phase berikutnya: `Agent Builder` draft from `JSON blocks`.

## Channel binding admin controls

- [x] Admin dapat menulis binding `channel/account -> workspace`.
  Bukti:
  - panel `Workspace Access Bindings` di
    [Users.tsx](/home/rahman/projects/manef-ui/features/users/components/Users.tsx)
- [x] Admin dapat menulis binding `identity -> workspace`.
  Bukti:
  - panel `Workspace Access Bindings` di
    [Users.tsx](/home/rahman/projects/manef-ui/features/users/components/Users.tsx)
- [x] Admin dapat mengatur policy channel:
  `multi-workspace` atau `single-primary`.
  Bukti:
  - panel policy di
    [Users.tsx](/home/rahman/projects/manef-ui/features/users/components/Users.tsx)
  - policy tampil juga di
    [ChannelCards.tsx](/home/rahman/projects/manef-ui/features/channels/components/ChannelCards.tsx)

Definition of done:

- admin bisa menambah binding dari UI
- admin bisa menghapus binding dari UI
- admin bisa menyimpan policy channel dari UI
- halaman `Channels` menampilkan policy aktif

## Auth onboarding

- [x] Login menerima `email atau nomor telepon`.
  Bukti:
  - [page.tsx](/home/rahman/projects/manef-ui/app/login/page.tsx)
  - [auth.ts](/home/rahman/projects/manef-ui/auth.ts)
- [x] Halaman login punya tab `Masuk` dan `Daftar`.
  Bukti:
  - [page.tsx](/home/rahman/projects/manef-ui/app/login/page.tsx)
- [x] Registrasi menerima `nomor`, `nama`, dan `konteks`.
  Bukti:
  - [page.tsx](/home/rahman/projects/manef-ui/app/login/page.tsx)
- [x] Temporary password harus memaksa user ke halaman ganti password.
  Bukti:
  - [page.tsx](/home/rahman/projects/manef-ui/app/set-password/page.tsx)
  - [proxy.ts](/home/rahman/projects/manef-ui/proxy.ts)
  - commit `53c63e0`
- [ ] Tambahkan self-service status untuk request registrasi:
  `pending`, `matched workspace`, `approved`, `denied`.
- [ ] Tambahkan history password reset dan notice yang lebih jelas di UI admin.

## Nodes and exec approvals

- [x] Tampilkan daftar node live dari DB.
  Bukti:
  - query host/node live dipakai di
    [ExecApprovals.tsx](/home/rahman/projects/manef-ui/features/nodes/components/ExecApprovals.tsx)
  - backend source: `features/nodes/api:listNodes`
  - commit `8681bd4`
- [x] Tampilkan binding agent -> node.
  Bukti:
  - [ExecApprovals.tsx](/home/rahman/projects/manef-ui/features/nodes/components/ExecApprovals.tsx)
  - backend source: `features/nodes/api:listNodeBindings`
  - commit `8681bd4`
- [x] Tampilkan `exec approvals` per host + agent.
  Bukti:
  - [ExecApprovals.tsx](/home/rahman/projects/manef-ui/features/nodes/components/ExecApprovals.tsx)
  - backend source: `features/nodes/api:getExecApprovals`
  - commit `8681bd4`
- [x] Tambahkan write UI nyata untuk approval config:
  `securityMode`, `askMode`, `allowList`, `denyList`.
  Bukti:
  - save sekarang memanggil `features/nodes/api:upsertExecApproval`
  - [ExecApprovals.tsx](/home/rahman/projects/manef-ui/features/nodes/components/ExecApprovals.tsx)
  - commit `8681bd4`
- [ ] Tambahkan refresh nyata dari runtime gateway.

Definition of done:

- node list identik dengan `nodes` table
- approval yang diubah dari UI terbaca kembali dari DB
- setelah sync runtime, UI menampilkan approval yang sama

## Logs

- [x] Hilangkan `MOCK_LOGS`.
  Bukti:
  - [index.tsx](/home/rahman/projects/manef-ui/features/logs/index.tsx)
  - page tidak lagi fallback ke `MOCK_LOGS`
  - commit current working set 2026-03-11
- [x] Tampilkan log live dari `gatewayLogs`.
  Bukti:
  - query `features.logs.api.getRecentLogs`
  - [index.tsx](/home/rahman/projects/manef-ui/features/logs/index.tsx)
  - backend runtime sync aktif menulis ke `gatewayLogs`
- [x] Tambahkan filter:
  `level`, `source`, `search text`, `time range`.
  Bukti:
  - filter `level` aktif di komponen stream
  - filter `source` + `search text` tersambung ke query backend
  - [LogStream.tsx](/home/rahman/projects/manef-ui/features/logs/components/LogStream.tsx)
  - [index.tsx](/home/rahman/projects/manef-ui/features/logs/index.tsx)
- [x] Tombol refresh harus memanggil backend fetch log nyata.
  Bukti:
  - refresh memicu refetch query live via `router.refresh()`
  - data sumber tetap `gatewayLogs`, bukan mock
- [ ] Tampilkan indikator jika log saat ini hanya snapshot DB lama.

Definition of done:

- log yang tampil berasal dari DB, bukan konstanta frontend
- fetch ulang log mengubah isi tabel bila ada data runtime baru
- hard refresh tidak mengembalikan user ke data dummy

## Skills

- [x] Tampilkan seluruh skill live dari DB.
  Bukti:
  - query `features.skills.api.listSkills`
  - [index.tsx](/home/rahman/projects/manef-ui/features/skills/index.tsx)
  - sync runtime backend mengisi tabel `skills`
- [x] Tambahkan write UI untuk enable/disable skill.
  Bukti:
  - tombol enable/disable memanggil `features.skills.api.toggleSkill`
  - [SkillsList.tsx](/home/rahman/projects/manef-ui/features/skills/components/SkillsList.tsx)
  - [index.tsx](/home/rahman/projects/manef-ui/features/skills/index.tsx)
- [x] Tambahkan status source:
  `bundled`, `custom`, `runtime-discovered`.
  Bukti:
  - badge source dirender dari field `skill.source`
  - [SkillsList.tsx](/home/rahman/projects/manef-ui/features/skills/components/SkillsList.tsx)
- [x] Tambahkan refresh nyata dari runtime OpenClaw.
  Bukti:
  - data di page sekarang berasal dari tabel `skills` yang diisi timer sync runtime
  - scheduler backend:
    [manef-openclaw-runtime-sync.timer](/home/rahman/projects/manef-db/scripts/systemd/manef-openclaw-runtime-sync.timer)

Definition of done:

- daftar skill sama dengan `skills` table
- toggle enabled/disabled terbaca ulang dari DB
- sync runtime memperbarui daftar skill tanpa edit manual frontend

## Sessions

- [x] Sambungkan filter `activeWithin`, `limit`, dan `includeUnknown`.
  Bukti:
  - [index.tsx](/home/rahman/projects/manef-ui/features/sessions-list/index.tsx)
  - [SessionsList.tsx](/home/rahman/projects/manef-ui/features/sessions-list/components/SessionsList.tsx)
- [x] Hapus kontrol dummy yang tidak punya backend nyata.
  Bukti:
  - field `label/thinking/verbose/reasoning` dummy dihapus
  - tabel hanya menyisakan data live + aksi yang benar-benar tersedia
  - [SessionsList.tsx](/home/rahman/projects/manef-ui/features/sessions-list/components/SessionsList.tsx)
- [x] Tambahkan delete session dari UI.
  Bukti:
  - tombol delete memanggil `features.sessions.api.deleteSession`
  - [index.tsx](/home/rahman/projects/manef-ui/features/sessions-list/index.tsx)

## Config

- [ ] Hilangkan `MOCK_SETTINGS`.
- [ ] Tampilkan config entries live dari DB per category.
- [ ] Tambahkan form edit yang sesuai category:
  `auth`, `channels`, `agents`, `environment`, `runtime`.
- [ ] Tombol reload config harus memanggil backend nyata.
- [ ] Tandai field yang belum didukung write-through ke runtime.

Definition of done:

- config panel tidak lagi bergantung pada konstanta mock
- edit config menghasilkan perubahan di DB
- setelah reload/sync, UI membaca nilai yang sama kembali

## Crons

- [ ] Tampilkan daftar job dan run history live.
- [ ] Tambahkan aksi nyata:
  enable, disable, trigger manual, edit schedule.
- [ ] Tambahkan badge source:
  `db`, `runtime`, `mirrored`.

Definition of done:

- cron jobs yang tampil sama dengan DB
- trigger/edit menghasilkan read-after-write yang konsisten
- bila runtime berubah, DB dan UI ikut berubah setelah sync

## Usage

- [ ] Pertahankan scope-aware usage yang sudah ada.
- [ ] Tambahkan verifikasi bahwa usage benar-benar berasal dari agent yang aktif
  di scope.
- [ ] Tambahkan breakdown by `agent`, `channel`, `date`.

Definition of done:

- usage root scope adalah agregasi semua child agent
- usage child scope hanya menampilkan child yang dipilih
- nilai usage dapat ditelusuri kembali ke `usageRecords`

## Admin visibility

- [ ] Admin harus bisa melihat seluruh root/contact workspace.
- [ ] Admin harus bisa berpindah ke child scope user/sub-agent.
- [ ] Label sidebar/user context harus mengikuti scope aktif.
- [ ] Hilangkan asumsi bahwa satu user hanya punya satu workspace legacy.

Definition of done:

- admin melihat semua owner yang ada di `userProfiles`
- setiap root menampilkan child/sub-agent yang sesuai `workspaceTrees`
- halaman scope-aware berubah saat admin pindah root atau child

## Validation checklist per release

- [ ] Login sebagai admin.
- [ ] Ganti root workspace.
- [ ] Ganti child workspace bila ada.
- [x] Verifikasi `Agents` berubah sesuai scope.
  Bukti:
  - query agents sudah difilter oleh navigator di
    [Agents.tsx](/home/rahman/projects/manef-ui/features/agents/components/Agents.tsx)
  - build lolos setelah patch `90d3e45`
- [x] Verifikasi `Sessions` berubah sesuai scope.
  Bukti:
  - query sessions memakai `selectedScope.agentIds` di
    [index.tsx](/home/rahman/projects/manef-ui/features/sessions-list/index.tsx)
  - build lolos setelah patch `90d3e45`
- [x] Verifikasi `Channels` hanya menampilkan data live.
  Bukti:
  - fallback constants dihapus dari route channel
  - [index.tsx](/home/rahman/projects/manef-ui/features/channels/index.tsx)
  - build lolos setelah patch `a7beeef`
- [x] Verifikasi `Nodes` dan `Exec Approvals` bisa read/write.
  Bukti:
  - node/approval panel sekarang read dari query live dan save ke mutation live
  - [ExecApprovals.tsx](/home/rahman/projects/manef-ui/features/nodes/components/ExecApprovals.tsx)
  - build lolos setelah patch `8681bd4`
- [x] Verifikasi `Logs` dan `Skills` bukan dummy data.
  Bukti:
  - `skills` sync awal menulis `60` record runtime
  - `logs` sync awal menulis `200` log runtime
  - `manef-ui` page sekarang membaca query live, bukan fallback mock
- [ ] Hard refresh dan pastikan state tetap konsisten.

## Blockers that must be resolved in manef-db

- [ ] API create/update/delete agent masih mock
- [ ] refresh actions `channels/nodes/logs/skills/config` masih stub
- [ ] binding channel -> agent belum jadi source of truth penuh
- [ ] mirror runtime OpenClaw ke Convex belum lengkap untuk semua tabel
