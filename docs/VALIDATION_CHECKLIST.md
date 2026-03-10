# Validation Checklist
## Validasi pemisahan backend `manef-ui`

Updated: 2026-03-10

Gunakan checklist ini sebelum, saat, dan setelah cutover.

## A. Discovery
- [ ] Seluruh dokumen `2026-03-09-*` diperlakukan sebagai historical reference.
- [ ] Source of truth aktif hanya dokumen `2026-03-10-*`.
- [ ] Nilai lama `NEXT_PUBLIC_CONVEX_URL` sudah dicatat.
- [ ] Repo/domain backend `manef-db` sudah dicatat.
- [ ] Default URL di `shared/providers/ConvexClientProvider.tsx` sudah diverifikasi.

## B. Provisioning deployment baru
- [ ] Backend `manef-db` sudah siap.
- [ ] `gg.rahmanef.com` resolve dengan benar.
- [ ] `ggdb.rahmanef.com` resolve dengan benar.
- [ ] Secret names untuk deployment baru tidak reuse stack shared.

## C. Deploy schema dan functions
- [ ] Schema repo `manef-db` berhasil terdeploy ke deployment baru.
- [ ] Query dasar ke deployment baru berhasil.
- [ ] Mutation dasar ke deployment baru berhasil.

## D. Data migration
- [ ] Diputuskan secara eksplisit apakah migrasi data diperlukan.
- [ ] Jika ya, export sudah selesai.
- [ ] Jika ya, import sudah selesai.
- [ ] Count check lulus.
- [ ] Sample check lulus.

## E. Cutover frontend
- [ ] `NEXT_PUBLIC_CONVEX_URL` production diubah ke `https://ggdb.rahmanef.com`.
- [ ] `HOSTED_URL` tetap `https://gg.rahmanef.com`.
- [ ] `NEXTAUTH_URL` tetap `https://gg.rahmanef.com`.
- [ ] Default frontend tidak lagi menunjuk endpoint shared lama.
- [ ] Frontend production selesai redeploy.

## F. Smoke test pasca-cutover
- [ ] Login admin berhasil.
- [ ] Dashboard utama berhasil dimuat.
- [ ] Minimal satu query inti berhasil.
- [ ] Minimal satu mutation non-destruktif berhasil.

## G. Observability
- [ ] Tidak ada request runtime ke endpoint Convex lama/shared.
- [ ] Error auth tidak meningkat.
- [ ] Error query/mutation tidak meningkat.

## H. Exit criteria
- [ ] Cutover dinyatakan sukses.
- [ ] Rollback runbook tetap siap dipakai.
