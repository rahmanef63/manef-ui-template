# check-sync

Cek status sinkronisasi antara manef-ui vendor, manef-db backend, dan OpenClaw runtime.

Gunakan agent `sync-checker` untuk menjalankan pengecekan lengkap:

```bash
# Quick health check
curl -si https://dbgg.<YOUR_DOMAIN>/version
curl -si https://gg.<YOUR_DOMAIN>
openclaw gateway status

# Check vendor sync
diff <USER_HOME>/projects/manef-db/convex/schema.ts \
     <USER_HOME>/projects/manef-ui/vendor/manef-db/convex/schema.ts

# Check pending changes
cd <USER_HOME>/projects/manef-db && git status --short convex/

# Check runtime sync timer
systemctl --user list-timers | grep manef
```

Jika ada yang stale, jalankan:
```bash
# Sync vendor
bash <USER_HOME>/projects/manef-ui/scripts/sync-vendor.sh

# Deploy jika ada schema changes
cd <USER_HOME>/projects/manef-db && npm run deploy:ci

# Manual runtime sync
cd <USER_HOME>/projects/manef-db && npm run sync:runtime
```
