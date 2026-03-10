# Environment Matrix
## `manef-ui` and `manef-db`

Updated: 2026-03-10

Tujuan dokumen ini adalah memisahkan dengan jelas env mana yang milik frontend
`manef-ui`, mana yang milik backend `manef-db`, dan mana yang hanya milik proxy
Docker `ggdb.rahmanef.com`.

## 1. Frontend repo: `manef-ui`

Repo: `rahmanef63/manef-ui`
Domain: `https://gg.rahmanef.com`

### Wajib di `.env.example` / `.env.local`

| Variable | Wajib | Dipakai di | Tujuan |
| --- | --- | --- | --- |
| `HOSTED_URL` | ya | Docker/runtime deploy | Base URL frontend |
| `NEXTAUTH_URL` | ya | Docker/runtime deploy | Base URL NextAuth |
| `NEXT_PUBLIC_CONVEX_URL` | ya | client + deploy | Endpoint backend `manef-db` |
| `AUTH_SECRET` | ya | `auth.ts` | Secret NextAuth |
| `AUTH_TRUST_HOST` | ya | `auth.ts` | Trust host untuk Auth.js |
| `AUTH_DEVICE_SALT` | ya | `lib/auth/device.ts` | Salt fingerprint device |
| `OPENCLAW_SHARED_SECRET` | opsional jika flow aktif | `lib/auth/openclaw.ts` | Verifikasi HMAC OpenClaw |
| `OPENCLAW_ALLOWED_CLOCK_SKEW_SECONDS` | opsional jika flow aktif | `lib/auth/openclaw.ts` | Toleransi timestamp HMAC |
| `OPENCLAW_NONCE_TTL_SECONDS` | opsional jika flow aktif | `lib/auth/openclaw.ts` | TTL nonce HMAC |
| `OPENCLAW_WORKFLOW_URL` | opsional jika flow aktif | `lib/auth/openclaw.ts` | Endpoint workflow OpenClaw |

### Wajib di `docker-compose.yml`

Sama dengan daftar runtime di atas:
- `HOSTED_URL`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_CONVEX_URL`
- `AUTH_SECRET`
- `AUTH_TRUST_HOST`
- `AUTH_DEVICE_SALT`
- `OPENCLAW_SHARED_SECRET`
- `OPENCLAW_ALLOWED_CLOCK_SKEW_SECONDS`
- `OPENCLAW_NONCE_TTL_SECONDS`
- `OPENCLAW_WORKFLOW_URL`

### Tidak lagi milik `manef-ui`

Variable berikut jangan lagi dijadikan source of truth di frontend:
- `AUTH_ADMIN_EMAIL`
- `AUTH_ADMIN_PASSWORD`
- `AUTH_ADMIN_NAME`
- `AUTH_ADMIN_ROLES`
- `RESEND_API_KEY`
- `OVERRIDE_INVITE_EMAIL`
- `CONVEX_DEPLOYMENT`
- `CONVEX_DEPLOY_KEY`

Catatan:
- `.env.local` lokal Anda masih boleh menyimpan variable legacy untuk referensi,
  tetapi runtime `manef-ui` saat ini tidak membutuhkannya.

## 2. Backend repo: `manef-db`

Repo: `rahmanef63/manef-db`
Domain: `https://ggdb.rahmanef.com`

### Wajib di backend/Convex env

| Variable | Wajib | Dipakai di | Tujuan |
| --- | --- | --- | --- |
| `HOSTED_URL` | ya | invite email action | Link balik ke frontend `gg.rahmanef.com` |
| `AUTH_ADMIN_EMAIL` | ya | auth bootstrap | Email admin bootstrap |
| `AUTH_ADMIN_PASSWORD` | ya | auth bootstrap | Password bootstrap |
| `AUTH_ADMIN_NAME` | ya | auth bootstrap | Nama admin bootstrap |
| `AUTH_ADMIN_ROLES` | ya | auth bootstrap | Role admin bootstrap |
| `RESEND_API_KEY` | opsional | invite email action | Kirim email invite |
| `OVERRIDE_INVITE_EMAIL` | opsional | invite email action | Override email invite untuk testing |

### Tempat menyimpan env backend

Env backend ini harus tersedia di:
- `.env.example` sebagai dokumentasi
- Convex deployment env / host env backend saat runtime

## 3. Docker proxy repo: `manef-db/docker-compose.yml`

Container proxy hanya butuh env ini:

| Variable | Wajib | Tujuan |
| --- | --- | --- |
| `PUBLIC_DB_DOMAIN` | ya | Host public untuk proxy, default `ggdb.rahmanef.com` |
| `UPSTREAM_CONVEX_URL` | ya | Upstream actual Convex deployment |

Penting:
- proxy Docker **tidak** menjalankan auth bootstrap atau invite email
- jadi `AUTH_ADMIN_*`, `HOSTED_URL`, `RESEND_API_KEY` bukan milik container proxy
- env tersebut milik backend Convex runtime

## 4. Domain mapping final

| Komponen | Repo | Domain |
| --- | --- | --- |
| Frontend | `manef-ui` | `gg.rahmanef.com` |
| Backend/public endpoint | `manef-db` | `ggdb.rahmanef.com` |

## 5. Ringkas keputusan

- `manef-ui` menyimpan env frontend dan auth edge/runtime saja.
- `manef-db` menyimpan env backend/auth bootstrap/invite email.
- `manef-db/docker-compose.yml` hanya menyimpan env proxy domain/upstream.
