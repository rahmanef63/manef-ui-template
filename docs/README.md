# Docs Index

Updated: 2026-03-12

Dokumen aktif yang perlu dipakai untuk operasional repo ini:

- `docs/TARGET_ARCHITECTURE.md`
- `docs/OPENCLAW_FRONTEND_PARITY_TASKLIST.md`
- `docs/2026-03-11-login-deploy-status.md`
- `docs/2026-03-10-manef-ui-db-separation-migration-plan.md`
- `docs/SEPARATION_PLAN.md`
- `docs/CUTOVER_RUNBOOK.md`
- `docs/ROLLBACK_RUNBOOK.md`
- `docs/VALIDATION_CHECKLIST.md`
- `docs/ENVIRONMENT_MATRIX.md`
- `docs/DOKPLOY_DEPLOYMENT_CHECKLIST.md`
- `docs/guide/manef-db-repo-split.md`

Ringkasan status:

- Frontend repo: `rahmanef63/manef-ui`
- Frontend domain: `https://gg.rahmanef.com`
- Backend repo: `rahmanef63/manef-db`
- Backend/public endpoint: `https://dbgg.rahmanef.com`
- Local dev bisa memakai `CONVEX_SERVER_URL` jika TLS `dbgg.rahmanef.com` belum trusted.

Remaining tasks yang masih relevan:

1. Bangun editor/review yang lebih aman untuk `Agent Builder` mode `custom_code`.
2. Tentukan contract publish/downstream ke `Superspace`.
3. Putuskan distribusi final `@manef/db`: tetap `vendor`, git dependency, atau private package registry.

Pattern UI terbaru yang sudah dipakai:

- `Feature Store` memakai three-panel layout ringan:
  browse -> detail -> workspace context/drafts
- search/filter/sort sekarang mulai dipusatkan di shared toolbar:
  [DiscoveryToolbar.tsx](/home/rahman/projects/manef-ui/shared/block/ui/layout/DiscoveryToolbar.tsx)

Dokumen baru yang harus dipakai sebelum lanjut `Feature Store`:

- [TARGET_ARCHITECTURE.md](/home/rahman/projects/manef-ui/docs/TARGET_ARCHITECTURE.md)

Dokumen ini menetapkan boundary:

- `Superspace` = product shell reference
- `OpenClaw` = runtime subsystem
- `manef` = integration layer aktif

Port alignment note (Dokploy):

- `manef-db` proxy wajib pakai `Domains -> Container Port` yang sesuai port listen container aktif.
- Jika salah diarahkan ke `3000`, akan muncul `502 Bad Gateway` di `dbgg.rahmanef.com`.
- Setelah perbaikan port + redeploy backend, baru validasi ulang login flow `manef-ui`.

Dokumen yang sudah dihapus dari repo ini adalah dokumen fase dual-sync/shared Convex
tanggal 2026-03-09. Dokumen tersebut tidak lagi dipakai sebagai source of truth
karena backend `manef-ui` sekarang sudah dipisah ke `manef-db`.
