# Cutover Runbook
## Cutover `manef-ui` ke Convex terpisah

Updated: 2026-03-10

## Tujuan
Memindahkan trafik runtime `manef-ui` ke deployment Convex baru tanpa mengubah stack GG/OpenClaw existing.

## Input Wajib
- Deployment Convex baru untuk `manef-ui`
- Endpoint final:
  - `https://api.manef.rahmanef.com`
  - `https://db.manef.rahmanef.com`
- Nilai rollback yang sudah dicatat:
  - `NEXT_PUBLIC_CONVEX_URL` lama
  - `CONVEX_DEPLOYMENT` lama
  - revision/container image frontend terakhir yang sehat

## Pre-Cutover Checklist
- Validasi di `docs/VALIDATION_CHECKLIST.md` untuk phase provisioning dan deploy sudah lulus.
- Jika ada data penting, phase migration sudah selesai dan diverifikasi.
- Jendela cutover sudah ditentukan.
- Orang yang pegang DNS/router/secret/runtime env siap.

## Langkah Cutover

### 1. Freeze operasional singkat
- Hentikan perubahan non-esensial selama cutover.
- Jika ada write-critical flow, aktifkan maintenance operasional atau instruksikan freeze write sementara.

### 2. Set env production ke deployment baru
- Ubah `NEXT_PUBLIC_CONVEX_URL` menjadi `https://api.manef.rahmanef.com`.
- Ubah `CONVEX_DEPLOYMENT` menjadi deployment khusus `manef-ui`.
- Pastikan `HOSTED_URL` tetap menunjuk hostname frontend production aktif.

### 3. Pastikan app tidak punya fallback ke deployment lama
- Review `shared/providers/ConvexClientProvider.tsx`.
- Jika fallback hardcoded masih ada, tutup lebih dulu sebelum deploy production.

### 4. Redeploy frontend
- Deploy image/revision yang membawa env baru.
- Tunggu sampai instance production sehat.

### 5. Smoke test segera
- Login dengan akun admin.
- Buka dashboard utama.
- Jalankan minimal satu query yang membaca data.
- Jalankan minimal satu mutation yang menulis data non-destruktif.
- Verifikasi flow session/device approval bila fitur itu aktif.

### 6. Verifikasi arah trafik
- Pastikan request frontend menuju `api.manef.rahmanef.com`.
- Pastikan tidak ada request `manef-ui` ke endpoint Convex lama/shared.

## Kriteria Sukses
- Frontend production berjalan normal setelah redeploy.
- Request runtime hanya ke endpoint Convex baru.
- Tidak ada lonjakan error auth/query/mutation dalam observasi awal.

## Monitoring 0-60 Menit
- Pantau login failure.
- Pantau error boundary atau console/server log terkait Convex.
- Pantau mutation/write error.
- Pantau invite/session/device flow jika digunakan.

## Kondisi Wajib Rollback
- Login gagal secara konsisten.
- Query inti tidak bisa resolve.
- Mutation inti gagal atau menulis ke deployment yang salah.
- Terdeteksi request masih menuju deployment lama dan tidak bisa dihentikan cepat.

## Catatan Operasional
- Jangan decommission deployment lama pada hari yang sama dengan cutover.
- Simpan screenshot/log hasil smoke test dan timestamp cutover.
