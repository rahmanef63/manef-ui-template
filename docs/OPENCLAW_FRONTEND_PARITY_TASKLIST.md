# OpenClaw Frontend Parity Tasklist

Updated: 2026-03-11

Dokumen ini melacak pekerjaan `manef-ui` agar makin dekat dengan frontend resmi
OpenClaw, tetapi tetap berjalan di arsitektur `Next.js + Convex`.

Source of truth referensi:

- OpenClaw Control UI
- OpenClaw Dashboard
- OpenClaw Agents
- OpenClaw Multi-Agent Routing

Definisi selesai untuk setiap task frontend:

1. halaman bisa membaca data live dari `manef-db`, bukan mock/fallback statis
2. aksi UI memicu mutation/action backend yang benar
3. setelah write berhasil, UI membaca kembali state yang sama dari database
4. state database tersebut berasal dari atau termirror dengan data runtime
   OpenClaw
5. hard refresh browser tetap menampilkan state yang sama

Task dianggap belum selesai jika salah satu kondisi berikut masih terjadi:

- UI masih memakai `MOCK_*`
- UI menampilkan fallback hardcoded ketika DB kosong padahal runtime OpenClaw
  punya data
- write hanya mengubah Convex tetapi tidak termirror ke runtime OpenClaw
- write hanya mengubah runtime tetapi DB tidak ikut sinkron

## Global rules

- [ ] Hapus semua `MOCK_*` dari halaman operasional OpenClaw:
  `agents`, `sessions`, `channels`, `instances`, `logs`, `config`.
- [ ] Semua halaman OpenClaw harus punya tiga state eksplisit:
  `loading`, `empty-live`, `error`.
- [ ] Semua halaman OpenClaw harus memakai scope aktif dari navigator:
  root workspace atau sub-workspace.
- [ ] Semua write path harus menampilkan hasil read-after-write dari Convex.
- [ ] Semua refresh button harus memanggil action backend yang benar, bukan
  `setTimeout` visual saja.

## Navigator and scope

- [ ] Jadikan navigator OpenClaw sebagai source of truth seluruh halaman
  operasional.
- [ ] Scope root harus mewakili contact/account workspace.
- [ ] Scope child harus mewakili sub-agent atau sub-workspace bila ada.
- [ ] Seluruh route dashboard harus mengambil filter dari `selectedScope`.
- [ ] Hilangkan fallback ke workspace legacy untuk halaman OpenClaw-only.

Definition of done:

- `WorkspaceSwitcher` selalu menampilkan root yang sama setelah reload
- child switcher hanya muncul bila root punya child
- pindah scope mengubah query data di halaman OpenClaw
- tidak ada flicker label ke workspace legacy

## Agents

Status saat ini:

- UI sudah memfilter `agentIds`
- backend action deploy/run masih mock

Tasks:

- [ ] Tampilkan daftar agent live dari Convex tanpa fallback statis.
- [ ] Tambahkan kolom/section berikut per agent:
  `agentId`, `name`, `type`, `owner`, `status`, `workspace path`,
  `bound channels`, `last seen`, `session count`.
- [ ] Tambahkan detail panel agent untuk melihat metadata OpenClaw:
  `agentDir`, `bindings`, `config`, `owner profile`.
- [ ] Tombol deploy agent harus memanggil backend nyata, bukan generator random.
- [ ] Tombol run agent harus memanggil operasi backend nyata atau dinonaktifkan
  sampai backend siap.
- [ ] Tampilkan parent-child relationship antar agent bila agent punya sub-agent.
- [ ] Scope agent harus mengikuti navigator:
  root menampilkan semua agent turunannya, child menampilkan agent child itu saja.

Definition of done:

- daftar agent identik dengan data `agents` di Convex
- agent yang muncul di runtime OpenClaw juga muncul di UI setelah sync
- create/update/delete agent tercermin di DB lalu kembali terbaca di UI
- tidak ada agent card yang berasal dari dummy data

## Sessions

- [ ] Hilangkan `MOCK_SESSIONS`.
- [ ] Tampilkan session live dari Convex sesuai `selectedScope.agentIds`.
- [ ] Tambahkan filter live:
  `channel`, `agent`, `status`, `session key`, `user token`.
- [ ] Tambahkan detail panel session:
  `message count`, `first message`, `last activity`, `canonical session key`.
- [ ] Tombol refresh harus memanggil action backend sinkronisasi session.
- [ ] Tampilkan empty state live bila agent memang belum punya session.

Definition of done:

- daftar session sama dengan data hasil mirror runtime OpenClaw
- session yang baru muncul di runtime ikut muncul di UI setelah sync
- perubahan status/session summary terbaca kembali dari DB

## Channels

- [ ] Hilangkan ketergantungan utama pada `CHANNEL_CONFIGS` fallback.
- [ ] Tampilkan seluruh channel/account live dari Convex.
- [ ] Tambahkan informasi binding channel -> agent.
- [ ] Tampilkan status yang benar:
  `configured`, `running`, `linked`, `connected`, `mode`,
  `last start`, `last connect`, `last error`.
- [ ] Tambahkan operasi write nyata:
  create channel, update config, relink binding, delete channel.
- [ ] Tambahkan indikator apakah channel termirror dari Gateway/OpenClaw runtime.

Definition of done:

- channel di UI sama dengan record `channels` di DB
- perubahan channel dari backend/runtime tampil di UI tanpa edit manual
- update channel dari UI terbaca ulang dari DB dan runtime

## Nodes and exec approvals

- [ ] Tampilkan daftar node live dari DB.
- [ ] Tampilkan binding agent -> node.
- [ ] Tampilkan `exec approvals` per host + agent.
- [ ] Tambahkan write UI nyata untuk approval config:
  `securityMode`, `askMode`, `allowList`, `denyList`.
- [ ] Tambahkan refresh nyata dari runtime gateway.

Definition of done:

- node list identik dengan `nodes` table
- approval yang diubah dari UI terbaca kembali dari DB
- setelah sync runtime, UI menampilkan approval yang sama

## Logs

- [ ] Hilangkan `MOCK_LOGS`.
- [ ] Tampilkan log live dari `gatewayLogs`.
- [ ] Tambahkan filter:
  `level`, `source`, `search text`, `time range`.
- [ ] Tombol refresh harus memanggil backend fetch log nyata.
- [ ] Tampilkan indikator jika log saat ini hanya snapshot DB lama.

Definition of done:

- log yang tampil berasal dari DB, bukan konstanta frontend
- fetch ulang log mengubah isi tabel bila ada data runtime baru
- hard refresh tidak mengembalikan user ke data dummy

## Skills

- [ ] Tampilkan seluruh skill live dari DB.
- [ ] Tambahkan write UI untuk enable/disable skill.
- [ ] Tambahkan status source:
  `bundled`, `custom`, `runtime-discovered`.
- [ ] Tambahkan refresh nyata dari runtime OpenClaw.

Definition of done:

- daftar skill sama dengan `skills` table
- toggle enabled/disabled terbaca ulang dari DB
- sync runtime memperbarui daftar skill tanpa edit manual frontend

## Config

- [ ] Hilangkan `MOCK_SETTINGS`.
- [ ] Tampilkan config entries live dari DB per category.
- [ ] Tambahkan form edit yang sesuai category:
  `auth`, `channels`, `agents`, `environment`, `runtime`.
- [ ] Tombol reload config harus memanggil backend nyata.
- [ ] Tandai field yang belum didukung write-through ke runtime.

Definition of done:

- config panel tidak lagi bergantung pada konstanta mock
- edit config menghasilkan perubahan di DB
- setelah reload/sync, UI membaca nilai yang sama kembali

## Crons

- [ ] Tampilkan daftar job dan run history live.
- [ ] Tambahkan aksi nyata:
  enable, disable, trigger manual, edit schedule.
- [ ] Tambahkan badge source:
  `db`, `runtime`, `mirrored`.

Definition of done:

- cron jobs yang tampil sama dengan DB
- trigger/edit menghasilkan read-after-write yang konsisten
- bila runtime berubah, DB dan UI ikut berubah setelah sync

## Usage

- [ ] Pertahankan scope-aware usage yang sudah ada.
- [ ] Tambahkan verifikasi bahwa usage benar-benar berasal dari agent yang aktif
  di scope.
- [ ] Tambahkan breakdown by `agent`, `channel`, `date`.

Definition of done:

- usage root scope adalah agregasi semua child agent
- usage child scope hanya menampilkan child yang dipilih
- nilai usage dapat ditelusuri kembali ke `usageRecords`

## Admin visibility

- [ ] Admin harus bisa melihat seluruh root/contact workspace.
- [ ] Admin harus bisa berpindah ke child scope user/sub-agent.
- [ ] Label sidebar/user context harus mengikuti scope aktif.
- [ ] Hilangkan asumsi bahwa satu user hanya punya satu workspace legacy.

Definition of done:

- admin melihat semua owner yang ada di `userProfiles`
- setiap root menampilkan child/sub-agent yang sesuai `workspaceTrees`
- halaman scope-aware berubah saat admin pindah root atau child

## Validation checklist per release

- [ ] Login sebagai admin.
- [ ] Ganti root workspace.
- [ ] Ganti child workspace bila ada.
- [ ] Verifikasi `Agents` berubah sesuai scope.
- [ ] Verifikasi `Sessions` berubah sesuai scope.
- [ ] Verifikasi `Channels` hanya menampilkan data live.
- [ ] Verifikasi `Nodes` dan `Exec Approvals` bisa read/write.
- [ ] Verifikasi `Logs` dan `Skills` bukan dummy data.
- [ ] Hard refresh dan pastikan state tetap konsisten.

## Blockers that must be resolved in manef-db

- [ ] API create/update/delete agent masih mock
- [ ] refresh actions `channels/nodes/logs/skills/config` masih stub
- [ ] binding channel -> agent belum jadi source of truth penuh
- [ ] mirror runtime OpenClaw ke Convex belum lengkap untuk semua tabel
