# Validation Checklist
## Validasi pemisahan Convex `manef-ui`

Updated: 2026-03-10

Gunakan checklist ini sebelum, saat, dan setelah cutover.

## A. Discovery
- [ ] Seluruh dokumen `2026-03-09-*` diperlakukan sebagai historical reference.
- [ ] Source of truth aktif hanya dokumen `2026-03-10-*`.
- [ ] Nilai lama `NEXT_PUBLIC_CONVEX_URL` sudah dicatat.
- [ ] Nilai lama `CONVEX_DEPLOYMENT` sudah dicatat.
- [ ] Fallback hardcoded di `shared/providers/ConvexClientProvider.tsx` sudah diidentifikasi.

## B. Provisioning deployment baru
- [ ] Deployment Convex baru khusus `manef-ui` sudah dibuat.
- [ ] `api.manef.rahmanef.com` resolve dengan benar.
- [ ] `db.manef.rahmanef.com` resolve dengan benar.
- [ ] Secret names untuk deployment baru tidak reuse stack shared.
- [ ] Volume/service/router baru menggunakan nama unik.

## C. Deploy schema dan functions
- [ ] Schema repo berhasil terdeploy ke deployment baru.
- [ ] Query dasar ke deployment baru berhasil.
- [ ] Mutation dasar ke deployment baru berhasil.
- [ ] Tidak ada indikasi deploy ke deployment yang salah.

## D. Data migration
- [ ] Diputuskan secara eksplisit apakah migrasi data diperlukan.
- [ ] Jika ya, export sudah selesai.
- [ ] Jika ya, import sudah selesai.
- [ ] Count check lulus.
- [ ] Sample check lulus.
- [ ] Logical integrity check lulus.

## E. Cutover frontend
- [ ] `NEXT_PUBLIC_CONVEX_URL` production diubah ke `https://api.manef.rahmanef.com`.
- [ ] `CONVEX_DEPLOYMENT` production diubah ke deployment `manef-ui`.
- [ ] `HOSTED_URL` tetap sesuai hostname frontend aktif.
- [ ] Fallback hardcoded ke deployment lama sudah ditutup.
- [ ] Frontend production selesai redeploy.

## F. Smoke test pasca-cutover
- [ ] Login admin berhasil.
- [ ] Dashboard utama berhasil dimuat.
- [ ] Minimal satu query inti berhasil.
- [ ] Minimal satu mutation non-destruktif berhasil.
- [ ] Flow session/device approval tervalidasi bila fitur dipakai.

## G. Observability
- [ ] Tidak ada request runtime ke endpoint Convex lama/shared.
- [ ] Error auth tidak meningkat.
- [ ] Error query/mutation tidak meningkat.
- [ ] Log production tidak menunjukkan schema mismatch.

## H. Exit criteria
- [ ] Cutover dinyatakan sukses.
- [ ] Rollback runbook tetap siap dipakai.
- [ ] Decommission stack lama ditunda sampai observasi stabil.
