# Cutover Runbook
## Cutover `manef-ui` ke backend terpisah

Updated: 2026-03-10

## Tujuan
Memindahkan trafik runtime `manef-ui` ke backend terpisah tanpa mengubah stack GG/OpenClaw existing.

## Input Wajib
- Backend/deployment baru untuk `manef-ui`
- Endpoint final:
  - `https://gg.rahmanef.com`
  - `https://ggdb.rahmanef.com`
- Nilai rollback yang sudah dicatat:
  - `NEXT_PUBLIC_CONVEX_URL` lama
  - revision/container image frontend terakhir yang sehat

## Pre-Cutover Checklist
- Validasi di `docs/VALIDATION_CHECKLIST.md` untuk phase provisioning dan deploy sudah lulus.
- Jika ada data penting, phase migration sudah selesai dan diverifikasi.
- Jendela cutover sudah ditentukan.
- Orang yang pegang DNS/router/secret/runtime env siap.

## Langkah Cutover

### 1. Freeze operasional singkat
- Hentikan perubahan non-esensial selama cutover.

### 2. Set env production ke backend baru
- Ubah `NEXT_PUBLIC_CONVEX_URL` menjadi `https://ggdb.rahmanef.com`.
- Pastikan `HOSTED_URL` tetap `https://gg.rahmanef.com`.
- Pastikan `NEXTAUTH_URL` tetap `https://gg.rahmanef.com`.

### 3. Redeploy frontend
- Deploy image/revision yang membawa env baru.
- Tunggu sampai instance production sehat.

### 4. Smoke test segera
- Login dengan akun admin.
- Buka dashboard utama.
- Jalankan minimal satu query yang membaca data.
- Jalankan minimal satu mutation yang menulis data non-destruktif.

### 5. Verifikasi arah trafik
- Pastikan request frontend menuju `ggdb.rahmanef.com`.
- Pastikan tidak ada request `manef-ui` ke endpoint Convex lama/shared.

## Kriteria Sukses
- Frontend production berjalan normal setelah redeploy.
- Request runtime hanya ke endpoint backend baru.
- Tidak ada lonjakan error auth/query/mutation dalam observasi awal.
