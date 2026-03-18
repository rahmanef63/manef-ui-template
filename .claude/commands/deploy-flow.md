# deploy-flow

Panduan urutan deploy yang benar untuk perubahan di manef ecosystem.

## Urutan Deploy (WAJIB diikuti)

### Jika hanya mengubah manef-ui (frontend saja):
```bash
cd <USER_HOME>/projects/manef-ui
npm run build          # Verifikasi tidak ada error
# Commit dan push → Dokploy auto-deploy
```

### Jika mengubah manef-db schema atau API:
```bash
# Step 1: Deploy manef-db ke Convex
cd <USER_HOME>/projects/manef-db
npm run deploy:ci

# Step 2: Sync vendor ke manef-ui
bash <USER_HOME>/projects/manef-ui/scripts/sync-vendor.sh

# Step 3: Verifikasi build
cd <USER_HOME>/projects/manef-ui
npm run build

# Step 4: Commit kedua repo
cd <USER_HOME>/projects/manef-db && git add -p && git commit
cd <USER_HOME>/projects/manef-ui && git add -p && git commit
```

### Jika menambah Python sync script baru:
```bash
# Step 1: Tambah script di manef-db/scripts/
# Step 2: Tambah npm script di manef-db/package.json
# Step 3: Update systemd service jika perlu
# Step 4: Test manual
python3 <USER_HOME>/projects/manef-db/scripts/sync_openclaw_{domain}_to_convex.py
# Step 5: Deploy seperti biasa
```

## Quick Deploy Checklist

- [ ] `npm run build` di manef-ui tidak ada error
- [ ] Vendor sudah di-sync setelah perubahan manef-db
- [ ] manef-db sudah di-deploy ke Convex (`deploy:ci`)
- [ ] Runtime sync masih berjalan (cek systemd timer)
- [ ] Dashboard bisa diakses di https://gg.<YOUR_DOMAIN>

## Health Check Post-Deploy

```bash
curl -si https://gg.<YOUR_DOMAIN>
curl -si https://dbgg.<YOUR_DOMAIN>/version
sudo docker ps -a | grep -i manef
openclaw gateway status
```

## Rollback

```bash
# Rollback manef-db Convex deploy (perlu login manual)
# Buka Convex dashboard dan rollback dari sana

# Rollback manef-ui (Docker)
sudo docker ps -a | grep manef-ui
# Gunakan Dokploy untuk rollback ke deployment sebelumnya
```
