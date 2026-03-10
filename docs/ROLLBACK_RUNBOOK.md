# Rollback Runbook
## Rollback cutover backend `manef-ui`

Updated: 2026-03-10

## Tujuan
Mengembalikan `manef-ui` ke backend sebelumnya jika cutover menyebabkan gangguan layanan atau integritas data diragukan.

## Trigger Rollback
- Auth/login gagal setelah cutover.
- Dashboard tidak bisa memuat data inti.
- Mutation penting gagal atau mengarah ke backend salah.
- Ada indikasi data corruption atau mismatch serius.

## Data yang Harus Sudah Tersimpan Sebelum Cutover
- `NEXT_PUBLIC_CONVEX_URL` lama
- revision/image frontend terakhir yang diketahui sehat
- catatan waktu mulai cutover

## Langkah Rollback

### 1. Stop perubahan lanjutan
- Hentikan deploy tambahan.
- Informasikan bahwa rollback sedang berjalan agar tidak ada perubahan paralel.

### 2. Kembalikan env runtime
- Set `NEXT_PUBLIC_CONVEX_URL` ke nilai lama yang dipakai sebelum cutover.
- Jangan ubah secret lain kecuali memang ikut berubah saat cutover.

### 3. Redeploy frontend ke state sehat terakhir
- Deploy ulang revision/image terakhir yang stabil.

### 4. Verifikasi pasca-rollback
- Login berhasil.
- Dashboard utama terbuka normal.
- Query utama kembali sehat.
- Mutation utama kembali sehat.

### 5. Bekukan stack baru
- Jangan teruskan trafik ke backend baru.
- Simpan stack baru untuk investigasi.
