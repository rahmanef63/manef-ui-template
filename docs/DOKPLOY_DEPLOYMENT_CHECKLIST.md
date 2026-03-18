# Dokploy Deployment Checklist
## `manef-ui` + `manef-db`

Updated: 2026-03-10

Dokumen ini adalah checklist praktis untuk deploy dua repo berikut:

- frontend: `rahmanef63/manef-ui`
- backend/proxy: `rahmanef63/manef-db`

Domain target:

- frontend: `https://gg.<YOUR_DOMAIN>`
- backend/public endpoint: `https://dbgg.<YOUR_DOMAIN>`

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
2. Deploy `manef-db` proxy untuk `dbgg.<YOUR_DOMAIN>`.
3. Verifikasi `dbgg.<YOUR_DOMAIN>` hidup.
4. Deploy `manef-ui`.
5. Verifikasi `gg.<YOUR_DOMAIN>` mengarah ke `dbgg.<YOUR_DOMAIN>`.

## 3. Deploy `manef-db`

Repo: `rahmanef63/manef-db`

Yang dideploy dari repo ini saat ini adalah proxy Docker, bukan database
Convex itu sendiri.

### Env Dokploy untuk app `manef-db`

| Variable | Wajib | Nilai contoh |
| --- | --- | --- |
| `PUBLIC_DB_DOMAIN` | ya | `dbgg.<YOUR_DOMAIN>` |
| `UPSTREAM_CONVEX_URL` | ya | `https://<actual-convex-endpoint>` |

### Penting

- Jika app `manef-db` dibuat di Dokploy dengan mode `Dockerfile`, set
  `Domains -> Container Port = 8080`.
- Jangan mengandalkan label Traefik di `manef-db/docker-compose.yml` untuk app
  Dokploy mode `Dockerfile`; routing aktif datang dari konfigurasi domain
  Dokploy.
- Tanpa `UPSTREAM_CONVEX_URL`, proxy tidak berguna.
- Jika `UPSTREAM_CONVEX_URL` mengarah ke `https://...convex.cloud`, pastikan
  image `manef-db` yang terdeploy sudah membawa fix SNI/`Host` upstream.
  Tanpa itu, container bisa `healthy` tetapi request publik tetap `502`.
- Env `AUTH_ADMIN_*`, `HOSTED_URL`, `RESEND_API_KEY`, `OVERRIDE_INVITE_EMAIL`
  bukan milik container proxy.
- Env backend tersebut harus ada di runtime/deployment Convex backend.

### Validasi `manef-db`

1. Domain `dbgg.<YOUR_DOMAIN>` sudah attach ke app `manef-db`.
2. TLS aktif.
3. Health check proxy hidup.
4. Request ke `dbgg.<YOUR_DOMAIN>` benar-benar diteruskan ke upstream Convex.

## 4. Deploy `manef-ui`

Repo: `rahmanef63/manef-ui`

### Env Dokploy untuk app `manef-ui`

| Variable | Wajib | Nilai contoh |
| --- | --- | --- |
| `HOSTED_URL` | ya | `https://gg.<YOUR_DOMAIN>` |
| `NEXTAUTH_URL` | ya | `https://gg.<YOUR_DOMAIN>` |
| `NEXT_PUBLIC_CONVEX_URL` | ya | `https://dbgg.<YOUR_DOMAIN>` |
| `CONVEX_SERVER_URL` | opsional | kosongkan atau samakan dengan `NEXT_PUBLIC_CONVEX_URL` |
| `CONVEX_AUTH_AUDIENCE` | ya | `manef-ui` |
| `CONVEX_AUTH_PRIVATE_KEY` | ya | `<RSA private key PEM atau base64 PEM lengkap>` |
| `AUTH_SECRET` | ya | `<strong random secret>` |
| `AUTH_TRUST_HOST` | ya | `true` |
| `AUTH_DEVICE_SALT` | ya | `<random salt>` |
| `OPENCLAW_SHARED_SECRET` | opsional | `<shared secret if flow enabled>` |
| `OPENCLAW_ALLOWED_CLOCK_SKEW_SECONDS` | opsional | `300` |
| `OPENCLAW_NONCE_TTL_SECONDS` | opsional | `300` |
| `OPENCLAW_WORKFLOW_URL` | opsional | `<workflow url>` |
| `APP_IMAGE` | opsional | override image tag |

Catatan format key frontend:

- `CONVEX_AUTH_PRIVATE_KEY` memang wajib untuk arsitektur auth saat ini.
  `manef-ui` menerbitkan JWT browser untuk Convex, dan `manef-db` memverifikasi
  JWT itu via provider `customJwt` + JWKS dari `gg.<YOUR_DOMAIN>`.
- `Deployment URL`, `HTTP Actions URL`, dan `CONVEX_DEPLOY_KEY` dari Convex
  tidak menggantikan `CONVEX_AUTH_PRIVATE_KEY`. Value tersebut dipakai untuk
  endpoint backend, HTTP actions, dan deploy/admin workflow, bukan untuk
  menandatangani token user browser.
- Untuk menghindari key PEM kepotong di UI Dokploy, format paling aman untuk
  `CONVEX_AUTH_PRIVATE_KEY` adalah `base64 -w 0 private-key.pem`.
- Format yang lebih aman lagi untuk UI Dokploy yang sering memotong value panjang
  adalah `base64 DER PKCS8` satu baris:

```bash
openssl pkcs8 -topk8 -nocrypt -in private-key.pem -outform DER | base64 -w 0
```

- Jika route `/.well-known/jwks.json` mengembalikan `convex_auth_unavailable`,
  cek dulu apakah hasil decode env masih punya `BEGIN PRIVATE KEY` dan
  `END PRIVATE KEY` lengkap.

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

### Env backend/runtime untuk `manef-db`

Jika `manef-db` masih memakai Convex Cloud, env ini harus ada di deployment Convex:

| Variable | Wajib | Nilai contoh |
| --- | --- | --- |
| `HOSTED_URL` | ya | `https://gg.<YOUR_DOMAIN>` |
| `CONVEX_AUTH_AUDIENCE` | ya | `manef-ui` |

Catatan:

- `manef-db` sekarang mengandalkan custom JWT issuer dari `manef-ui` di
  `https://gg.<YOUR_DOMAIN>/api/convex-auth`
- issuer diambil dari `HOSTED_URL`, jadi Anda tidak perlu set `CONVEX_AUTH_ISSUER`
- setelah mengubah `convex/auth.config.ts`, Anda wajib jalankan `npm run deploy:ci`
  di repo `manef-db`; redeploy container saja tidak cukup

## 5. Smoke test setelah kedua app hidup

### Backend

1. `dbgg.<YOUR_DOMAIN>` resolve.
2. Tidak ada error routing upstream.

### Frontend

1. `gg.<YOUR_DOMAIN>/login` terbuka.
2. Login berhasil.
3. Dashboard termuat.
4. Query ke backend berhasil.
5. Mutation non-destruktif berhasil.
6. Tidak ada request frontend ke endpoint shared lama.

## 6. Definition of ready

Deployment dianggap siap dipakai jika:

- Dokploy sudah punya GitHub provider aktif
- `manef-db` hidup di `dbgg.<YOUR_DOMAIN>`
- `manef-ui` hidup di `gg.<YOUR_DOMAIN>`
- frontend memakai `NEXT_PUBLIC_CONVEX_URL=https://dbgg.<YOUR_DOMAIN>`
- smoke test lulus
