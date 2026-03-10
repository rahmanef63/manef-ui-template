# Alignment Review
## Dokumen `2026-03-09-*` vs Plan Separation `manef-ui`

Updated: 2026-03-10

## Ringkasan
Dokumen `2026-03-09-*` dibuat untuk konteks **GG dual-sync/shared Convex**. Untuk pekerjaan pemisahan DB `manef-ui`, dokumen tersebut **tidak boleh dijadikan source of truth utama**.

Source utama terbaru:
- `docs/2026-03-10-manef-ui-db-separation-migration-plan.md`

## Hasil Analisa per Dokumen

1. `2026-03-09-dual-sync-runbook.md`
- Status: historical
- Tidak selaras: masih berfokus webhook dual-sync GG
- Aksi: beri context-freeze warning (DONE)

2. `2026-03-09-dual-sync-source-of-truth.md`
- Status: historical
- Tidak selaras: menyebut endpoint shared (`api.rahmanef.com`, `db.rahmanef.com`) sebagai active truth
- Aksi: context-freeze warning (DONE)

3. `2026-03-09-low-hanging-fruit-execution-report.md`
- Status: historical
- Tidak selaras: checklist untuk workflow GG, bukan separation manef-ui
- Aksi: context-freeze warning (DONE)

4. `2026-03-09-migration-sync-status-report.md`
- Status: historical
- Tidak selaras: prioritas dan risk matrix milik phase GG/cloud parity
- Aksi: context-freeze warning (DONE)

5. `2026-03-09-parity-gate-light-checklist.md`
- Status: reusable template parsial
- Tidak selaras: scope tabel target bukan separation endpoint manef-ui
- Aksi: context-freeze warning (DONE)

6. `2026-03-09-parity-gate-results.md`
- Status: historical snapshot
- Tidak selaras: hasil parity cloud lama, bukan baseline instance manef-ui baru
- Aksi: context-freeze warning (DONE)

7. `2026-03-09-secret-rotation-inventory.md`
- Status: reusable parsial
- Tidak selaras: daftar secret spesifik workflow GG, belum include secret domain manef-ui baru
- Aksi: context-freeze warning (DONE)

## Keputusan Operasional
1. Simpan semua `2026-03-09-*` sebagai referensi sejarah.
2. Semua eksekusi baru untuk manef-ui wajib mengacu ke dokumen 2026-03-10.
3. Jika perlu, buat dokumen baru bertopik sama tapi khusus namespace manef-ui (tanpa copy endpoint shared).

## Gap Implementasi yang Ditemukan di Repo
- Tidak ada hardcoded `api.rahmanef.com` atau `db.rahmanef.com` pada runtime app saat ini.
- Default runtime frontend sekarang diarahkan ke `ggdb.rahmanef.com` di `shared/providers/ConvexClientProvider.tsx`.
- Implikasi: alignment dokumen sudah lebih dekat ke target operasional, tetapi env production tetap harus diverifikasi agar frontend `gg.rahmanef.com` tidak drift dari backend `manef-db`.
