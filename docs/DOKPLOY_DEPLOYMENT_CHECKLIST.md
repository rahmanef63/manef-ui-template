# Dokploy Deployment Checklist
## `manef-ui` + `manef-db`

Updated: 2026-03-10

Dokumen ini adalah checklist praktis untuk deploy dua repo berikut:

- frontend: `rahmanef63/manef-ui`
- backend/proxy: `rahmanef63/manef-db`

Domain target:

- frontend: `https://gg.rahmanef.com`
- backend/public endpoint: `https://dbgg.rahmanef.com`

## 1. Fix error `Github Provider not found`

Jika Dokploy menampilkan:

```text
Initializing deployment
Error: Github Provider not found
```

artinya build belum mulai sama sekali. Dokploy gagal menemukan koneksi GitHub
provider untuk app tersebut.

Checklist perbaikan:

1. Buka `Dokploy -> Settings -> Source Providers` atau `Git Providers`.
2. Pastikan provider GitHub ada dan statusnya aktif.
3. Pastikan provider itu punya akses ke repo:
   - `rahmanef63/manef-db`
   - `rahmanef63/manef-ui`
4. Jika repo private, pastikan GitHub App / PAT provider memang diberi akses ke repo itu.
5. Edit app di Dokploy lalu pilih ulang GitHub provider + repo.
6. Jika app dibuat sebelum provider benar, recreate app dengan provider yang benar.

## 2. Urutan deploy yang benar

1. Siapkan upstream backend/Convex terlebih dulu.
2. Deploy `manef-db` proxy untuk `dbgg.rahmanef.com`.
3. Verifikasi `dbgg.rahmanef.com` hidup.
4. Deploy `manef-ui`.
5. Verifikasi `gg.rahmanef.com` mengarah ke `dbgg.rahmanef.com`.

## 3. Deploy `manef-db`

Repo: `rahmanef63/manef-db`

Yang dideploy dari repo ini saat ini adalah proxy Docker, bukan database
Convex itu sendiri.

### Env Dokploy untuk app `manef-db`

| Variable | Wajib | Nilai contoh |
| --- | --- | --- |
| `PUBLIC_DB_DOMAIN` | ya | `dbgg.rahmanef.com` |
| `UPSTREAM_CONVEX_URL` | ya | `https://<actual-convex-endpoint>` |

### Penting

- Tanpa `UPSTREAM_CONVEX_URL`, proxy tidak berguna.
- Env `AUTH_ADMIN_*`, `HOSTED_URL`, `RESEND_API_KEY`, `OVERRIDE_INVITE_EMAIL`
  bukan milik container proxy.
- Env backend tersebut harus ada di runtime/deployment Convex backend.

### Validasi `manef-db`

1. Domain `dbgg.rahmanef.com` sudah attach ke app `manef-db`.
2. TLS aktif.
3. Health check proxy hidup.
4. Request ke `dbgg.rahmanef.com` benar-benar diteruskan ke upstream Convex.

## 4. Deploy `manef-ui`

Repo: `rahmanef63/manef-ui`

### Env Dokploy untuk app `manef-ui`

| Variable | Wajib | Nilai contoh |
| --- | --- | --- |
| `HOSTED_URL` | ya | `https://gg.rahmanef.com` |
| `NEXTAUTH_URL` | ya | `https://gg.rahmanef.com` |
| `NEXT_PUBLIC_CONVEX_URL` | ya | `https://dbgg.rahmanef.com` |
| `CONVEX_SERVER_URL` | opsional | kosongkan atau samakan dengan `NEXT_PUBLIC_CONVEX_URL` |
| `AUTH_SECRET` | ya | `<strong random secret>` |
| `AUTH_TRUST_HOST` | ya | `true` |
| `AUTH_DEVICE_SALT` | ya | `<random salt>` |
| `OPENCLAW_SHARED_SECRET` | opsional | `<shared secret if flow enabled>` |
| `OPENCLAW_ALLOWED_CLOCK_SKEW_SECONDS` | opsional | `300` |
| `OPENCLAW_NONCE_TTL_SECONDS` | opsional | `300` |
| `OPENCLAW_WORKFLOW_URL` | opsional | `<workflow url>` |
| `APP_IMAGE` | opsional | override image tag |

### Tidak perlu di Dokploy `manef-ui`

Jangan jadikan ini source of truth di frontend:

- `AUTH_ADMIN_EMAIL`
- `AUTH_ADMIN_PASSWORD`
- `AUTH_ADMIN_NAME`
- `AUTH_ADMIN_ROLES`
- `RESEND_API_KEY`
- `OVERRIDE_INVITE_EMAIL`
- `CONVEX_DEPLOYMENT`
- `CONVEX_DEPLOY_KEY`

## 5. Smoke test setelah kedua app hidup

### Backend

1. `dbgg.rahmanef.com` resolve.
2. Tidak ada error routing upstream.

### Frontend

1. `gg.rahmanef.com/login` terbuka.
2. Login berhasil.
3. Dashboard termuat.
4. Query ke backend berhasil.
5. Mutation non-destruktif berhasil.
6. Tidak ada request frontend ke endpoint shared lama.

## 6. Definition of ready

Deployment dianggap siap dipakai jika:

- Dokploy sudah punya GitHub provider aktif
- `manef-db` hidup di `dbgg.rahmanef.com`
- `manef-ui` hidup di `gg.rahmanef.com`
- frontend memakai `NEXT_PUBLIC_CONVEX_URL=https://dbgg.rahmanef.com`
- smoke test lulus
