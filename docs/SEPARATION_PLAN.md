# Separation Plan
## Pemisahan Convex `manef-ui` dari stack shared

Updated: 2026-03-10
Source of truth:
- `docs/2026-03-10-manef-ui-db-separation-migration-plan.md`
- `docs/2026-03-10-alignment-review-2026-03-09-docs.md`

## Scope
Tujuan dokumen ini adalah memberi rencana eksekusi operasional untuk memindahkan `manef-ui` ke backend Convex yang terpisah, tanpa mengubah stack GG/OpenClaw existing selain observasi read-only.

Target endpoint final:
- Convex API: `https://api.manef.rahmanef.com`
- Convex Dashboard: `https://db.manef.rahmanef.com`

Out of scope:
- Refactor product feature
- Cleanup stack GG/OpenClaw lama
- Destructive migration tanpa backup dan rollback

## Discovery Saat Ini

### Inventory env dan dependency runtime

| Variable / dependency | Source saat ini | Lokasi pemakaian | Catatan |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_CONVEX_URL` | `.env.example`, runtime container | `docker-compose.yml`, `shared/providers/ConvexClientProvider.tsx` | Ini adalah saklar utama frontend ke Convex baru. |
| `CONVEX_DEPLOYMENT` | `.env.example`, runtime container | `docker-compose.yml` | Dipakai untuk operasi/deploy Convex. Nilai harus deployment khusus `manef-ui`. |
| Hardcoded fallback Convex URL | kode frontend | `shared/providers/ConvexClientProvider.tsx` | Masih fallback ke `https://proficient-cricket-724.convex.cloud`; harus dihapus/ditutup sebelum cutover final. |
| `HOSTED_URL` | `.env.example`, runtime container | `docker-compose.yml` | Harus konsisten dengan hostname frontend production aktif. |
| NextAuth/OpenClaw secrets | `.env.example`, runtime container | `docker-compose.yml` | Bukan blocker separation DB, tapi perlu dipastikan tidak ikut menunjuk service shared yang salah. |

### Hasil pencarian endpoint lama
- Tidak ditemukan hardcoded runtime `api.rahmanef.com` atau `db.rahmanef.com` di source app.
- Dokumen historis `2026-03-09-*` masih menyebut endpoint shared; dokumen tersebut hanya referensi sejarah.
- Risiko aktual di repo saat ini adalah fallback ke deployment Convex cloud lama, bukan ke domain shared lama.

## Rencana Eksekusi

### Phase 0. Freeze konteks
- Pakai hanya dokumen `2026-03-10-*` sebagai source of truth.
- Perlakukan `2026-03-09-*` sebagai historical reference.
- Pastikan nilai lama berikut dicatat sebelum perubahan:
  - `NEXT_PUBLIC_CONVEX_URL`
  - `CONVEX_DEPLOYMENT`
  - hostname frontend production aktif

### Phase 1. Provision stack Convex baru
- Buat project/deployment Convex baru khusus `manef-ui`.
- Buat routing/domain:
  - `api.manef.rahmanef.com`
  - `db.manef.rahmanef.com`
- Pastikan seluruh resource unik:
  - project name
  - service name
  - router/ingress
  - secret names
  - volumes

Exit criteria:
- Endpoint API dan dashboard resolve.
- Environment variables deployment baru sudah bisa diakses tim operasi.

### Phase 2. Deploy schema dan functions
- Deploy schema/fungsi repo ini ke deployment baru.
- Jalankan codegen bila diperlukan setelah koneksi deployment baru aktif.
- Verifikasi query/mutation publik utama bisa dipanggil tanpa error routing.

Exit criteria:
- Health check aplikasi ke Convex baru berhasil.
- Tidak ada error schema mismatch.

### Phase 3. Data migration
- Tentukan apakah migration data diperlukan.
- Jika ya:
  - freeze write sementara pada jendela cutover
  - export data dari deployment lama
  - import ke deployment baru
  - lakukan count check dan sample check
- Jika tidak ada data penting, phase ini bisa dilewati dengan catatan eksplisit.

Exit criteria:
- Hasil integrity check terdokumentasi.
- Titik rollback masih tersedia.

### Phase 4. Application cutover
- Update runtime env:
  - `NEXT_PUBLIC_CONVEX_URL=https://api.manef.rahmanef.com`
  - `CONVEX_DEPLOYMENT=<deployment-manef-ui>`
- Hapus fallback lama di `shared/providers/ConvexClientProvider.tsx` agar app fail fast jika env belum benar.
- Redeploy frontend.
- Smoke test login, dashboard load, query, mutation, dan alur invite/session.

Exit criteria:
- Semua request `manef-ui` hanya menuju deployment baru.
- Frontend production stabil setelah redeploy.

### Phase 5. Stabilization
- Monitor 24 jam pertama.
- Pantau error rate, auth flow, dan mutation failure.
- Tunda decommission stack lama sampai hasil observasi stabil.

Exit criteria:
- Tidak ada trafik aplikasi ke deployment lama.
- Rollback tidak perlu dipakai sampai akhir jendela observasi.

## Risiko Utama

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Fallback hardcoded masih aktif | App diam-diam terkoneksi ke deployment lama | Hilangkan fallback sebelum cutover final. |
| `CONVEX_DEPLOYMENT` salah | Deploy schema ke instance yang salah | Verifikasi ID deployment sebelum setiap deploy. |
| Data tidak lengkap saat migrasi | Missing record / auth inconsistency | Freeze write, lakukan count + sampling checks. |
| Secret reuse dengan stack shared | Cross-environment contamination | Gunakan secret names baru dan inventory terpisah. |

## Deliverables
- `docs/SEPARATION_PLAN.md`
- `docs/CUTOVER_RUNBOOK.md`
- `docs/ROLLBACK_RUNBOOK.md`
- `docs/VALIDATION_CHECKLIST.md`

## Keputusan Go/No-Go
Go untuk cutover hanya jika:
- Deployment baru sehat
- Env production sudah siap
- Validasi data lulus
- Rollback steps sudah diuji secara administratif
