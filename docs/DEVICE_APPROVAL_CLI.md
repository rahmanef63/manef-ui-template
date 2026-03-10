# Device Approval CLI

Gunakan CLI ini di VPS untuk melihat device yang masih `pending`, lalu
`approve` atau `revoke` tanpa login ke dashboard.

Repo: `manef-ui`
Script: [scripts/device-approval.mjs](/home/rahman/projects/manef-ui/scripts/device-approval.mjs)

## Cara kerja

CLI ini memanggil endpoint auth app berikut:

- `GET /api/auth/device/pending`
- `POST /api/auth/device/approve`
- `POST /api/auth/device/revoke`

Request ditandatangani dengan `OPENCLAW_SHARED_SECRET`, jadi tidak perlu cookie
admin browser. Ini sengaja dipakai untuk operasional VPS.

## Sumber env

Urutan lookup:

1. `--env-file`
2. `AUTH_APP_ENV_FILE`
3. `/etc/dokploy/applications/openclaw-dashbaord-manef-obeant/code/.env`
4. `.env.local`
5. `.env`

Variabel yang dipakai:

- `OPENCLAW_SHARED_SECRET`
- `AUTH_APP_URL` atau `HOSTED_URL` atau `NEXTAUTH_URL`

## Contoh

Lihat pending device:

```bash
cd /home/rahman/projects/manef-ui
npm run auth:devices:list
```

Approve device:

```bash
cd /home/rahman/projects/manef-ui
npm run auth:devices:approve -- jw7f3c7w4t8xg1xk8q7h9n1r6d7k5m2a
```

Revoke device:

```bash
cd /home/rahman/projects/manef-ui
npm run auth:devices:revoke -- jw7f3c7w4t8xg1xk8q7h9n1r6d7k5m2a
```

Pakai actor khusus:

```bash
node scripts/device-approval.mjs approve <deviceId> \
  --actor openclaw:operator:manual:vps
```

Output `list` menampilkan:

- `deviceId`
- email user
- label device
- IP terakhir
- waktu terakhir terlihat

## Catatan

- `GET /api/auth/device/pending` sekarang menerima service-auth HMAC yang sama
  dengan endpoint approve/revoke.
- n8n tidak wajib. Kalau nanti ingin otomasi, n8n cukup memanggil command atau
  endpoint yang sama.
