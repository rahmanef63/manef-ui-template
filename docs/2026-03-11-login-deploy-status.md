# Login And Deploy Status

Updated: 2026-03-11

Dokumen ini merangkum status `manef-ui` saat user berhenti kerja pada malam
2026-03-11. Fokusnya adalah blocker login production dan dependency langsung ke
`manef-db`.

## Current symptoms

Gejala yang terkonfirmasi di production:

- login di `https://gg.rahmanef.com/login` gagal dengan pesan:
  `Layanan login sedang tidak tersedia`
- endpoint JWKS frontend gagal:
  `https://gg.rahmanef.com/api/convex-auth/.well-known/jwks.json` -> `500`
- endpoint token Convex auth juga gagal ketika diuji sebelumnya:
  `https://gg.rahmanef.com/api/convex-auth/token` -> `500`
- kadang muncul error:
  `Failed to find Server Action "..."`

## Verified root causes

### 1. Backend public endpoint is still down

`manef-ui` mengarah ke:

- `NEXT_PUBLIC_CONVEX_URL=https://dbgg.rahmanef.com`

Tetapi endpoint backend yang diuji dari mesin lokal masih gagal:

- `https://dbgg.rahmanef.com/version` -> `502 Bad Gateway`
- `https://dbgg.rahmanef.com/api/query` -> `502 Bad Gateway`

Artinya error login `service_unavailable` saat ini valid. Frontend memang tidak
bisa menjangkau backend auth/Convex di domain publik yang dipakai UI.

### 2. Convex browser auth bridge is not healthy yet

Frontend sekarang memakai custom JWT bridge untuk browser -> Convex:

- route JWKS: `/api/convex-auth/.well-known/jwks.json`
- route token: `/api/convex-auth/token`
- provider client: `shared/providers/ConvexClientProvider.tsx`

Jika JWKS route masih `500`, browser auth ke Convex tidak bisa jalan walaupun
session NextAuth sudah ada.

Kemungkinan utama yang harus dicek lebih dulu:

- deploy `manef-ui` belum mengambil commit terbaru
- `CONVEX_AUTH_PRIVATE_KEY` di Dokploy `manef-ui` salah format atau kosong

Patch yang sudah dibuat agar format secret lebih toleran:

- commit `64f493f` `fix(auth): accept dokploy private key formats`

Format yang didukung:

- PEM multiline biasa
- PEM satu baris dengan `\n`
- base64 dari seluruh isi PEM

### 3. Server Action mismatch is a secondary deployment issue

Error:

- `Failed to find Server Action "..."`

umumnya terjadi ketika browser/tab masih memakai bundle lama saat server sudah
berpindah ke deployment baru. Ini bukan akar masalah `service_unavailable`,
tetapi tetap perlu dibersihkan dengan redeploy stabil + hard refresh/incognito.

## Required Dokploy env for manef-ui

Nilai runtime production yang harus ada di Dokploy `manef-ui`:

```env
HOSTED_URL=https://gg.rahmanef.com
NEXTAUTH_URL=https://gg.rahmanef.com
NEXT_PUBLIC_CONVEX_URL=https://dbgg.rahmanef.com
CONVEX_SERVER_URL=
CONVEX_AUTH_AUDIENCE=manef-ui
CONVEX_AUTH_PRIVATE_KEY=<valid RSA private key PEM or base64 PEM>
AUTH_SECRET=<stable secret>
AUTH_TRUST_HOST=true
AUTH_DEVICE_SALT=<stable salt>
OPENCLAW_SHARED_SECRET=<stable secret>
OPENCLAW_ALLOWED_CLOCK_SKEW_SECONDS=300
OPENCLAW_NONCE_TTL_SECONDS=300
OPENCLAW_WORKFLOW_URL=https://ai.rahmanef.com/webhooks/auth/device-pending
```

Variable yang tidak lagi menjadi source of truth frontend:

```env
CONVEX_DEPLOYMENT
CONVEX_DEPLOY_KEY
NEXT_CONVEX_SITE_URL
AUTH_ADMIN_EMAIL
AUTH_ADMIN_PASSWORD
AUTH_ADMIN_NAME
AUTH_ADMIN_ROLES
RESEND_API_KEY
```

## Verified checks to rerun later

### Frontend auth bridge

Target hasil yang benar:

```text
GET https://gg.rahmanef.com/api/convex-auth/.well-known/jwks.json -> 200 JSON
GET https://gg.rahmanef.com/api/convex-auth/token -> 401 if logged out, 200 JSON if logged in
```

### Frontend build

Sudah diverifikasi lokal:

- `npx tsc -p tsconfig.json --noEmit` -> pass
- `pnpm run build` -> pass

## Recommended next steps

1. Pastikan `manef-db` sehat dulu di `https://dbgg.rahmanef.com/version`.
2. Redeploy `manef-ui` ke commit terbaru setelah env `CONVEX_AUTH_PRIVATE_KEY`
   dipastikan valid.
3. Uji JWKS route.
4. Baru uji login lagi.

## Current conclusion

`manef-ui` belum bisa login production bukan karena validasi kredensial, tetapi
karena dua dependency eksternal belum sehat:

- `dbgg.rahmanef.com` masih `502`
- route JWT bridge `gg.rahmanef.com/api/convex-auth/*` masih `500`
