# Migration Plan + Prompt Agent Coding
## Pemisahan DB/Convex `manef-ui` dari stack shared (`gg` / OpenClaw)

Updated: 2026-03-10
Owner: Manef

---

## Tujuan
Memastikan `manef-ui` punya backend Convex terpisah agar tidak konflik/corrupt dengan stack lain.

### Target arsitektur (final)
- Frontend repo: `rahmanef63/manef-ui`
- Frontend domain: `gg.<YOUR_DOMAIN>`
- Backend repo: `rahmanef63/manef-db`
- Backend/public Convex endpoint: `dbgg.<YOUR_DOMAIN>`

### Yang tidak boleh lagi untuk `manef-ui`
- `api.<YOUR_DOMAIN>`
- `db.<YOUR_DOMAIN>`
- `api.manef.<YOUR_DOMAIN>`
- `db.manef.<YOUR_DOMAIN>`

---

## Constraint Kritis
1. Jangan modifikasi stack GG/OpenClaw existing kecuali read-only observasi.
2. Semua resource manef-ui harus unik.
3. No destructive migration by default.
4. Wajib punya rollback runbook.

---

## Deliverables Wajib Agent
1. `docs/SEPARATION_PLAN.md`
2. `docs/CUTOVER_RUNBOOK.md`
3. `docs/ROLLBACK_RUNBOOK.md`
4. `docs/VALIDATION_CHECKLIST.md`
5. Compose/env frontend diarahkan ke `dbgg.<YOUR_DOMAIN>`
6. Dokumentasi repo/domain dipisah jelas antara `manef-ui` dan `manef-db`

Status dokumen per 2026-03-10:
- `docs/SEPARATION_PLAN.md` siap
- `docs/CUTOVER_RUNBOOK.md` siap
- `docs/ROLLBACK_RUNBOOK.md` siap
- `docs/VALIDATION_CHECKLIST.md` siap
- Compose/env frontend ke domain backend baru: selesai di repo ini
- Runtime env frontend ke endpoint baru: selesai di repo ini
- Override server-side URL untuk local dev: selesai lewat `CONVEX_SERVER_URL`

---

## Discovery Repo Saat Ini

### Temuan penting
1. Tidak ditemukan hardcoded `api.<YOUR_DOMAIN>` atau `db.<YOUR_DOMAIN>` di source app runtime.
2. Runtime frontend client bergantung pada env `NEXT_PUBLIC_CONVEX_URL`.
3. Runtime frontend server bisa memakai `CONVEX_SERVER_URL` sebagai override jika
   `dbgg.<YOUR_DOMAIN>` belum punya TLS yang trusted di local/dev environment.
4. Ada default fallback frontend ke domain backend target:
   - file: `shared/providers/ConvexClientProvider.tsx`
   - nilai: `https://dbgg.<YOUR_DOMAIN>`
5. Container web meneruskan env Convex dari runtime:
   - file: `docker-compose.yml`
   - variable: `NEXT_PUBLIC_CONVEX_URL`, `CONVEX_SERVER_URL`
6. Template env saat ini sudah diarahkan ke backend baru:
   - file: `.env.example`
   - nilai default: `https://dbgg.<YOUR_DOMAIN>`

### Implikasi operasional
- Risiko utama sekarang adalah salah set env frontend ke domain backend yang salah.
- Tanggung jawab deployment Convex dan repo backend sudah bergeser ke `manef-db`.
- Provisioning/deploy backend bukan lagi pekerjaan di repo `manef-ui`.

---

## Fase Eksekusi

### Phase 0 - Discovery
- Inventaris semua env + hardcoded URL yang menunjuk endpoint shared.
- Buat tabel: variable -> source -> file pemakaian.

Output discovery yang sudah tervalidasi di repo:

| Variable / dependency | Source | File pemakaian | Status |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_CONVEX_URL` | env runtime | `.env.example`, `docker-compose.yml`, `shared/providers/ConvexClientProvider.tsx` | aktif |
| `CONVEX_SERVER_URL` | env runtime server | `.env.example`, `docker-compose.yml`, `lib/convex/server.ts` | opsional untuk local/dev |
| Default Convex URL | kode | `shared/providers/ConvexClientProvider.tsx` | diarahkan ke `dbgg.<YOUR_DOMAIN>` |
| `api.<YOUR_DOMAIN>` | pencarian repo | tidak ditemukan di runtime app | tidak aktif di source code |
| `db.<YOUR_DOMAIN>` | pencarian repo | tidak ditemukan di runtime app | tidak aktif di source code |

### Phase 1 - Provisioning Terpisah
- Gunakan repo `manef-db` sebagai source of truth backend.
- Expose/public route backend pada `dbgg.<YOUR_DOMAIN>`.
- Secret dan volume harus baru.

### Phase 2 - Deploy Schema/Functions
- Deploy schema/function dari repo `manef-db`.
- Verifikasi function publik resolve normal.

### Phase 3 - Data Migration
- Freeze write sementara atau dual-write terbatas jika diperlukan.
- Export/import data bila ada data penting.
- Integrity checks.

### Phase 4 - Cutover
- Ubah `NEXT_PUBLIC_CONVEX_URL` ke `https://dbgg.<YOUR_DOMAIN>`.
- Biarkan `CONVEX_SERVER_URL` kosong di production, kecuali memang perlu override sementara.
- Redeploy frontend.
- Smoke test auth/query/mutation.
- Pastikan frontend tidak lagi mengarah ke endpoint shared lama.

### Phase 5 - Stabilization
- Monitor 24 jam.
- Setelah aman, decommission stack lama secara bertahap.

---

## Definition of Done
- `manef-ui` full jalan di backend terpisah.
- Tidak ada request `manef-ui` ke endpoint shared lama.
- Dependency build lokal `file:../manef-db` masih boleh ada sementara, tapi runtime production
  tidak boleh bergantung ke checkout lokal repo backend.
- GG/OpenClaw tetap sehat.
- Dokumen runbook + rollback lengkap.

---

## Prompt Siap Pakai untuk Agent Coding

```text
Konteks: Kamu hanya punya konteks project manef-ui. Tugasmu memastikan frontend
manef-ui di gg.<YOUR_DOMAIN> memakai backend terpisah dari repo manef-db di
dbgg.<YOUR_DOMAIN>.

Source of truth:
- docs/2026-03-10-manef-ui-db-separation-migration-plan.md

Tujuan final:
- manef-ui berjalan di gg.<YOUR_DOMAIN>
- backend/public Convex endpoint ada di dbgg.<YOUR_DOMAIN>
- tidak ada dependency runtime ke api.<YOUR_DOMAIN>/db.<YOUR_DOMAIN>

Aturan:
1) Jangan sentuh stack GG/OpenClaw selain observasi read-only.
2) Semua nama resource unik.
3) Jangan aksi destruktif tanpa backup + rollback.

Deliverables wajib:
- docs/SEPARATION_PLAN.md
- docs/CUTOVER_RUNBOOK.md
- docs/ROLLBACK_RUNBOOK.md
- docs/VALIDATION_CHECKLIST.md
- update env+kode manef-ui agar endpoint baru dipakai penuh
- dokumentasikan pemisahan repo manef-ui vs manef-db
```
