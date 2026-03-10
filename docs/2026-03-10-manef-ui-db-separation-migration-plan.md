# Migration Plan + Prompt Agent Coding
## Pemisahan DB/Convex `manef-ui` dari stack shared (`gg` / OpenClaw)

Updated: 2026-03-10
Owner: Manef

---

## Tujuan
Memastikan `manef-ui` punya backend Convex terpisah agar tidak konflik/corrupt dengan stack lain.

### Target arsitektur (final)
- Frontend: `manef.rahmanef.com` *(atau `ui.rahmanef.com`, pilih satu)*
- Convex API (manef-ui): `api.manef.rahmanef.com`
- Convex Dashboard (manef-ui): `db.manef.rahmanef.com`

### Yang **tidak boleh** lagi untuk `manef-ui`
- `api.rahmanef.com`
- `db.rahmanef.com`

---

## Constraint Kritis
1. Jangan modifikasi stack GG/OpenClaw existing kecuali read-only observasi.
2. Semua resource manef-ui harus unik (project name, router, service, volume, secrets).
3. No destructive migration by default.
4. Wajib punya rollback runbook.

---

## Deliverables Wajib Agent
1. `docs/SEPARATION_PLAN.md`
2. `docs/CUTOVER_RUNBOOK.md`
3. `docs/ROLLBACK_RUNBOOK.md`
4. `docs/VALIDATION_CHECKLIST.md`
5. Compose/env terpisah untuk Convex manef-ui
6. Update runtime env frontend agar pakai endpoint Convex baru

Status dokumen per 2026-03-10:
- `docs/SEPARATION_PLAN.md` siap
- `docs/CUTOVER_RUNBOOK.md` siap
- `docs/ROLLBACK_RUNBOOK.md` siap
- `docs/VALIDATION_CHECKLIST.md` siap
- Compose/env terpisah: belum dikerjakan di repo ini
- Runtime env frontend ke endpoint baru: belum dikerjakan di repo ini

---

## Discovery Repo Saat Ini

### Temuan penting
1. Tidak ditemukan hardcoded `api.rahmanef.com` atau `db.rahmanef.com` di source app runtime.
2. Runtime frontend masih bergantung pada env `NEXT_PUBLIC_CONVEX_URL` dan `CONVEX_DEPLOYMENT`.
3. Ada fallback hardcoded ke deployment Convex cloud lama:
   - file: `shared/providers/ConvexClientProvider.tsx`
   - nilai: `https://proficient-cricket-724.convex.cloud`
4. Container web meneruskan env Convex dari runtime:
   - file: `docker-compose.yml`
   - variables: `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL`
5. Template env saat ini masih netral:
   - file: `.env.example`
   - variables Convex belum diisi

### Implikasi operasional
- Risiko terbesar saat ini bukan domain shared lama, tetapi fallback ke deployment cloud lama jika env production tidak benar.
- Cutover final tidak aman jika fallback tersebut masih dibiarkan aktif.
- Karena repo ini belum punya compose/service Convex self-hosted terpisah, provisioning backend baru masih pekerjaan infra di luar dokumen ini.

---

## Fase Eksekusi

### Phase 0 — Discovery
- Inventaris semua env + hardcoded URL yang menunjuk endpoint shared.
- Buat tabel: variable -> source -> file pemakaian.

Output discovery yang sudah tervalidasi di repo:

| Variable / dependency | Source | File pemakaian | Status |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_CONVEX_URL` | env runtime | `.env.example`, `docker-compose.yml`, `shared/providers/ConvexClientProvider.tsx` | aktif |
| `CONVEX_DEPLOYMENT` | env runtime | `.env.example`, `docker-compose.yml` | aktif |
| Hardcoded fallback Convex URL | kode | `shared/providers/ConvexClientProvider.tsx` | harus dihapus/ditutup |
| `api.rahmanef.com` | pencarian repo | tidak ditemukan di runtime app | tidak aktif di source code |
| `db.rahmanef.com` | pencarian repo | tidak ditemukan di runtime app | tidak aktif di source code |

### Phase 1 — Provisioning Terpisah
- Buat stack Convex baru khusus manef-ui.
- Domain router terpisah (`api.manef...`, `db.manef...`).
- Secret dan volume harus baru (no reuse).

### Phase 2 — Deploy Schema/Functions
- Deploy schema/function manef-ui ke instance baru.
- Verifikasi function publik resolve normal.

### Phase 3 — Data Migration (opsional, jika ada data penting)
- Freeze write sementara atau dual-write terbatas.
- Export/import data.
- Integrity checks (count + sampling + logical checks).

### Phase 4 — Cutover
- Ubah `NEXT_PUBLIC_CONVEX_URL` ke `https://api.manef.rahmanef.com`.
- Redeploy frontend.
- Smoke test auth/query/mutation.
- Tutup fallback hardcoded deployment lama agar app fail fast jika env salah.

### Phase 5 — Stabilization
- Monitor 24 jam.
- Setelah aman, decommission stack lama secara bertahap.

---

## Definition of Done
- `manef-ui` full jalan di Convex instance terpisah.
- Tidak ada request `manef-ui` ke endpoint shared lama.
- Tidak ada fallback runtime ke deployment Convex lama.
- GG/OpenClaw tetap sehat.
- Dokumen runbook + rollback lengkap.

---

## Prompt Siap Pakai untuk Agent Coding

```text
Konteks: Kamu hanya punya konteks project manef-ui. Tugasmu memisahkan DB/Convex manef-ui agar tidak konflik dengan gg.rahmanef.com dan OpenClaw.

Source of truth:
- docs/2026-03-10-manef-ui-db-separation-migration-plan.md

Tujuan final:
- manef-ui pakai endpoint baru:
  - api.manef.rahmanef.com
  - db.manef.rahmanef.com
- tidak ada dependency runtime ke api.rahmanef.com/db.rahmanef.com

Aturan:
1) Jangan sentuh stack GG/OpenClaw selain observasi read-only.
2) Semua nama resource unik (router, volume, secret, project name).
3) Jangan aksi destruktif tanpa backup + rollback.

Deliverables wajib:
- docs/SEPARATION_PLAN.md
- docs/CUTOVER_RUNBOOK.md
- docs/ROLLBACK_RUNBOOK.md
- docs/VALIDATION_CHECKLIST.md
- config deploy/env terpisah untuk Convex manef-ui
- update env+kode manef-ui agar endpoint baru dipakai penuh

Format update progress:
- perubahan file
- dampak
- verifikasi
- risiko
- langkah berikutnya

Mulai dari discovery inventory, lanjut provisioning, migration, cutover, dan validasi.
```
