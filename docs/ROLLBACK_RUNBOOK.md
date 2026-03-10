# Rollback Runbook
## Rollback cutover Convex `manef-ui`

Updated: 2026-03-10

## Tujuan
Mengembalikan `manef-ui` ke deployment Convex sebelumnya jika cutover menyebabkan gangguan layanan atau integritas data diragukan.

## Trigger Rollback
- Auth/login gagal setelah cutover.
- Dashboard tidak bisa memuat data inti.
- Mutation penting gagal atau mengarah ke deployment salah.
- Ada indikasi data corruption atau mismatch serius.
- Error rate production meningkat dan tidak reda dalam jendela respons awal.

## Data yang Harus Sudah Tersimpan Sebelum Cutover
- `NEXT_PUBLIC_CONVEX_URL` lama
- `CONVEX_DEPLOYMENT` lama
- revision/image frontend terakhir yang diketahui sehat
- catatan waktu mulai cutover

## Langkah Rollback

### 1. Stop perubahan lanjutan
- Hentikan deploy tambahan.
- Informasikan bahwa rollback sedang berjalan agar tidak ada perubahan paralel.

### 2. Kembalikan env runtime
- Set `NEXT_PUBLIC_CONVEX_URL` ke nilai lama yang dipakai sebelum cutover.
- Set `CONVEX_DEPLOYMENT` ke deployment lama yang tervalidasi.
- Jangan ubah secret lain kecuali memang ikut berubah saat cutover.

### 3. Redeploy frontend ke state sehat terakhir
- Deploy ulang revision/image terakhir yang stabil.
- Jika perubahan kode untuk fail-fast/fallback ikut masuk dalam release cutover, gunakan revision rollback yang sudah diuji.

### 4. Verifikasi pasca-rollback
- Login berhasil.
- Dashboard utama terbuka normal.
- Query utama kembali sehat.
- Mutation utama kembali sehat.

### 5. Bekukan stack baru
- Jangan teruskan trafik ke deployment baru.
- Simpan stack baru untuk investigasi; jangan dihapus dulu.

## Validasi Rollback Sukses
- User flow utama pulih.
- Tidak ada error kritis baru di production.
- Trafik kembali menuju deployment lama sesuai catatan observasi.

## Tindak Lanjut Setelah Rollback
- Buat ringkasan insiden:
  - waktu cutover
  - waktu rollback
  - gejala
  - dugaan akar masalah
- Perbaiki penyebab sebelum menjadwalkan cutover ulang.
- Perbarui checklist validasi jika ada celah proses yang ditemukan.
