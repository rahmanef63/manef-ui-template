# Separation Plan
## Pemisahan Convex `manef-ui` dari stack shared

Updated: 2026-03-10
Source of truth:
- `docs/2026-03-10-manef-ui-db-separation-migration-plan.md`
- `docs/README.md`

## Scope
Tujuan dokumen ini adalah memberi rencana eksekusi operasional untuk memindahkan `manef-ui` ke backend Convex yang terpisah, tanpa mengubah stack GG/OpenClaw existing selain observasi read-only.

Target endpoint final:
- Frontend: `https://gg.<YOUR_DOMAIN>`
- Backend/public Convex endpoint: `https://dbgg.<YOUR_DOMAIN>`

Out of scope:
- Refactor product feature
- Cleanup stack GG/OpenClaw lama
- Destructive migration tanpa backup dan rollback

## Discovery Saat Ini

### Inventory env dan dependency runtime

| Variable / dependency | Source saat ini | Lokasi pemakaian | Catatan |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_CONVEX_URL` | `.env.example`, runtime container | `docker-compose.yml`, `shared/providers/ConvexClientProvider.tsx` | Saklar utama frontend ke backend baru. |
| `CONVEX_SERVER_URL` | `.env.example`, runtime container | `docker-compose.yml`, `lib/convex/server.ts` | Override opsional untuk server-side fetch saat local/dev butuh TLS-valid endpoint. |
| Default Convex URL | kode frontend | `shared/providers/ConvexClientProvider.tsx` | Default ke `https://dbgg.<YOUR_DOMAIN>`; env production tetap harus eksplisit. |
| `HOSTED_URL` | `.env.example`, runtime container | `docker-compose.yml` | Harus konsisten dengan hostname frontend production aktif. |
| `NEXTAUTH_URL` | `.env.example`, runtime container | `docker-compose.yml` | Harus sama dengan domain frontend production. |

### Hasil pencarian endpoint lama
- Tidak ditemukan hardcoded runtime `api.<YOUR_DOMAIN>` atau `db.<YOUR_DOMAIN>` di source app.
- Risiko aktual di repo saat ini adalah drift konfigurasi antara frontend `gg.<YOUR_DOMAIN>` dan backend `dbgg.<YOUR_DOMAIN>`.

## Rencana Eksekusi

### Phase 0. Freeze konteks
- Pakai hanya dokumen aktif yang terdaftar di `docs/README.md`.
- Pastikan nilai lama berikut dicatat sebelum perubahan:
  - `NEXT_PUBLIC_CONVEX_URL`
  - hostname frontend production aktif

### Phase 1. Provision stack backend baru
- Gunakan repo `rahmanef63/manef-db` sebagai backend terpisah.
- Buat atau pertahankan routing/domain backend:
  - `dbgg.<YOUR_DOMAIN>`
- Pastikan seluruh resource unik:
  - project name
  - service name
  - router/ingress
  - secret names
  - volumes

### Phase 2. Deploy schema dan functions
- Deploy schema/fungsi dari repo `manef-db`.
- Jalankan codegen bila diperlukan setelah koneksi deployment baru aktif.
- Verifikasi query/mutation publik utama bisa dipanggil tanpa error routing.

### Phase 3. Data migration
- Tentukan apakah migration data diperlukan.
- Jika ya:
  - freeze write sementara pada jendela cutover
  - export data dari deployment lama
  - import ke deployment baru
  - lakukan count check dan sample check

### Phase 4. Application cutover
- Update runtime env:
  - `HOSTED_URL=https://gg.<YOUR_DOMAIN>`
  - `NEXTAUTH_URL=https://gg.<YOUR_DOMAIN>`
  - `NEXT_PUBLIC_CONVEX_URL=https://dbgg.<YOUR_DOMAIN>`
  - `CONVEX_SERVER_URL=` kosongkan di production kecuali perlu override sementara
- Pastikan frontend hanya memakai endpoint backend baru.
- Redeploy frontend.
- Smoke test login, dashboard load, query, mutation, dan alur invite/session.

### Phase 5. Stabilization
- Monitor 24 jam pertama.
- Pantau error rate, auth flow, dan mutation failure.
- Tunda decommission stack lama sampai hasil observasi stabil.

## Risiko Utama

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Env frontend salah | App mengarah ke backend yang salah | Verifikasi `NEXT_PUBLIC_CONVEX_URL` dan `HOSTED_URL` sebelum deploy. |
| Data tidak lengkap saat migrasi | Missing record / auth inconsistency | Freeze write, lakukan count + sampling checks. |
| Secret reuse dengan stack shared | Cross-environment contamination | Gunakan secret names baru dan inventory terpisah. |

## Deliverables
- `docs/SEPARATION_PLAN.md`
- `docs/CUTOVER_RUNBOOK.md`
- `docs/ROLLBACK_RUNBOOK.md`
- `docs/VALIDATION_CHECKLIST.md`

## Keputusan Go/No-Go
Go untuk cutover hanya jika:
- backend baru sehat
- env production sudah siap
- validasi data lulus
- rollback steps sudah diuji secara administratif
