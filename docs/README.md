# Docs Index

Updated: 2026-03-10

Dokumen aktif yang perlu dipakai untuk operasional repo ini:

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
- Backend/public endpoint: `https://ggdb.rahmanef.com`
- Local dev bisa memakai `CONVEX_SERVER_URL` jika TLS `ggdb.rahmanef.com` belum trusted.

Remaining tasks yang masih relevan:

1. Verifikasi deploy Dokploy end-to-end untuk `manef-ui` dan `manef-db`.
2. Pastikan TLS `ggdb.rahmanef.com` valid sehingga local/production tidak perlu fallback URL.
3. Rapikan sisa legacy frontend yang masih mengganggu lint/typecheck, terutama file lama di `convex/`.
4. Putuskan distribusi final `@manef/db`: tetap `file:../manef-db`, git dependency, atau private package registry.

Dokumen yang sudah dihapus dari repo ini adalah dokumen fase dual-sync/shared Convex
tanggal 2026-03-09. Dokumen tersebut tidak lagi dipakai sebagai source of truth
karena backend `manef-ui` sekarang sudah dipisah ke `manef-db`.
