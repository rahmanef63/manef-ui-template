# Docs Index

Updated: 2026-03-10

Dokumen aktif yang perlu dipakai untuk operasional repo ini:

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

1. Verifikasi deploy Dokploy end-to-end untuk `manef-ui` dan `manef-db`.
2. Pastikan `dbgg.rahmanef.com` tidak lagi `502` dan `gg.rahmanef.com/api/convex-auth/.well-known/jwks.json` tidak lagi `500`.
3. Putuskan mode deploy `manef-db`: tetap `Convex Cloud + proxy` atau pindah penuh ke self-hosted, jangan campur env keduanya.
4. Rapikan sisa legacy frontend yang masih mengganggu lint/typecheck, terutama file lama di `convex/`.
5. Putuskan distribusi final `@manef/db`: tetap `file:../manef-db`, git dependency, atau private package registry.

Port alignment note (Dokploy):

- `manef-db` proxy wajib pakai `Domains -> Container Port` yang sesuai port listen container aktif.
- Jika salah diarahkan ke `3000`, akan muncul `502 Bad Gateway` di `dbgg.rahmanef.com`.
- Setelah perbaikan port + redeploy backend, baru validasi ulang login flow `manef-ui`.

Dokumen yang sudah dihapus dari repo ini adalah dokumen fase dual-sync/shared Convex
tanggal 2026-03-09. Dokumen tersebut tidak lagi dipakai sebagai source of truth
karena backend `manef-ui` sekarang sudah dipisah ke `manef-db`.
