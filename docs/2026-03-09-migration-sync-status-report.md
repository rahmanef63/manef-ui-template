> ⚠️ **Context freeze (2026-03-10):** Dokumen ini dibuat untuk fase dual-sync GG/shared Convex. Untuk plan terbaru pemisahan DB `manef-ui`, jadikan dokumen ini referensi historis saja. Ikuti `2026-03-10-manef-ui-db-separation-migration-plan.md` sebagai sumber utama.

# Report Status Pekerjaan — GG / Convex Sync / n8n Dual-Write

**Waktu:** 2026-03-09 17:05 UTC  
**Context:** Stabilkan `gg.rahmanef.com`, pastikan sync data terbaru masuk, lalu siapkan dual-write self-hosted + cloud tanpa cutover prematur.

---

## 1) Ringkasan Konteks (biar gak lost track)

Tujuan besar kita saat ini:
1. `db.rahmanef.com` (self-hosted) **tetap jalur utama** dulu.
2. Cloud `proficient-cricket-724` dipakai sebagai mirror/transisi, **bukan target tunggal**.
3. Semua perubahan diarahkan supaya migrasi aman, minim risiko, dan bisa diverifikasi parity sebelum auth hardening final.

Kendala utama yang bikin ribet hari ini:
- Timeout di fungsi audit berat (`SystemTimeoutError`) terutama area `messages`.
- Error format payload di n8n HTTP Request (`missing field path`).
- Banyak iterasi workflow akibat push menghasilkan workflow id baru + konflik webhook path saat aktivasi.
- Cloud belum punya function path yang sama (`sessions:upsertScoped`) jadi dual-write belum 100% fungsional untuk function itu.

---

## 2) Yang Sudah Dikerjakan (DONE)

### A. Sync data terbaru ke DB self-hosted
- Sync sessions/messages dijalankan ulang.
- Hasil nyata sempat tercatat:
  - `synced_messages=274`
  - `sessions_touched=5`
- Verifikasi session update terlihat (contoh webchat/telegram count naik), jadi update baru memang masuk (tidak mentok tanggal 8).

### B. Validasi automasi n8n existing
- Dicek: workflow backup upload memang ada dan aktif (jalur `/webhook/convex-backup-upload`).
- Webhook lama/nonaktif teridentifikasi (404 di path yang tidak aktif).

### C. Pembuatan workflow baru dual-write (self-hosted + cloud)
- Workflow dibuat untuk menerima payload generic (`path` + `args`) dan menulis ke:
  - `https://api.rahmanef.com/api/mutation`
  - `https://proficient-cricket-724.convex.cloud/api/mutation`
- Header auth diset ke format benar:
  - `Authorization: Convex <deployment|token>`

### D. Publish workflow dual-write
- Iterasi beberapa kali karena error payload/JSON n8n.
- Workflow final yang aktif sekarang:
  - **Name:** `Convex Dual Sync Mirror (selfhost + cloud)`
  - **ID aktif:** `cjoY9QWS5Xfq0ohO`
  - **Prod webhook:** `POST /webhook/convex-dual-sync`
- Trigger production berhasil dipanggil (response OK dari webhook).

### E. Perbaikan operasional manual trigger
- Dibuat script helper agar bisa trigger manual gampang dari terminal:
  - `/home/rahman/scripts/gg-manual-trigger.sh`
- Support:
  - `--path`, `--args`, `--args-file`, `--raw`, `--test`, `--url`
- Tujuan: kamu bisa manual trigger “apapun” tanpa ribet format curl panjang.

---

## 3) Yang Sudah Teruji vs Belum

### Sudah teruji
- ✅ Webhook dual-sync production bisa dipanggil.
- ✅ Write ke self-hosted berhasil (probe session muncul saat diverifikasi di self-hosted DB).

### Belum beres / masih fail
- ❌ Write ke cloud untuk function `sessions:upsertScoped` gagal logis (function tidak ada di deployment cloud):
  - `Could not find public function for 'sessions:upsertScoped'`
- Artinya pipeline jalan, tapi **function parity antar deployment belum sama**.

---

## 4) Remaining (Prioritas Lanjut)

### P1 — Samakan function contract self-hosted vs cloud
Opsi cepat:
1. Deploy function scoped yang dibutuhkan ke cloud (`sessions:upsertScoped` dst), **atau**
2. Ubah payload workflow jadi path per target:
   - `selfhostPath`
   - `cloudPath`

Rekomendasi: untuk transisi aman, pakai opsi (2) dulu supaya write tetap jalan di dua sisi meski nama function berbeda.

### P1 — Parity gate final data core
Tetap jalankan count+integrity untuk tabel inti:
- `userProfiles`, `workspaceTrees`, `agents`, `agentDelegations`, `sessions`, `messages`, `agentSessions`, `dailyNotes`, `workspaceFiles`

Catatan: untuk `messages` yang berat, lanjut pakai pendekatan ringan/sampling + snapshot compare (jangan query berat tunggal).

### P1 — Selesaikan export self-hosted yang sempat buntu
Masalah yang harus dibereskan:
- `ExportInProgress`
- TLS `self-signed certificate`

### P2 — Auth hardening (setelah parity lulus)
- Device approval E2E
- Signature/replay checks callback
- Revoke tests

### P2 — Cleanup sementara setelah stabil
- Cabut guard route sementara (`gg-route-guard.sh` + cron) setelah dual-DB realtime benar-benar stabil.

---

## 5) Backlog yang Belum Ketutup (masih open)

1. Stabilisasi upload backup besar via n8n/Drive.
2. Failover watchdog + cooldown + failback yang rapih.
3. Restore drill staging + health checks terjadwal.
4. Rotate/revoke secret yang sempat terekspos.

---

## 6) Risiko Aktif

1. **False sense of dual-write:** webhook sukses bukan berarti kedua DB sukses tulis; harus lihat body result per target.
2. **Function drift:** nama/path function beda antar deployment bikin cloud silent-fail walau HTTP level terlihat OK.
3. **Timeout audit berat:** kalau dipaksa query besar, progress validasi jadi lambat/menyesatkan.

---

## 7) Rekomendasi Eksekusi Berikutnya (urutan konkret)

1. Update workflow dual-sync agar menerima payload:
   - `selfhostPath`, `cloudPath`, `args`
2. Test 3 skenario:
   - self-host only success,
   - cloud only success,
   - both success.
3. Jalankan parity gate core (light + sampling + snapshot).
4. Setelah parity PASS, baru lanjut auth hardening final.
5. Saat stabil, nonaktifkan guard sementara dan rapikan workflow duplikat n8n.

---

## 8) Catatan Operasional Penting

- Untuk terminal, hindari multiline curl yang rawan putus argumen. Gunakan satu baris atau script `gg-manual-trigger.sh`.
- Untuk `webhook-test`, harus klik **Execute workflow** dulu di UI n8n (sekali hit).
- Untuk pemakaian normal, gunakan endpoint production `/webhook/convex-dual-sync`.

---

Report ini sengaja dibuat ringkas tapi lengkap supaya kamu bisa langsung pakai sebagai baseline koordinasi next step.