# check-sync

Cek status sinkronisasi antara manef-ui vendor, manef-db backend, dan OpenClaw runtime.

Gunakan agent `sync-checker` untuk menjalankan pengecekan lengkap:

```bash
# Quick health check
curl -si https://dbgg.rahmanef.com/version
curl -si https://gg.rahmanef.com
openclaw gateway status

# Check vendor sync
diff /home/rahman/projects/manef-db/convex/schema.ts \
     /home/rahman/projects/manef-ui/vendor/manef-db/convex/schema.ts

# Check pending changes
cd /home/rahman/projects/manef-db && git status --short convex/

# Check runtime sync timer
systemctl --user list-timers | grep manef
```

Jika ada yang stale, jalankan:
```bash
# Sync vendor
bash /home/rahman/projects/manef-ui/scripts/sync-vendor.sh

# Deploy jika ada schema changes
cd /home/rahman/projects/manef-db && npm run deploy:ci

# Manual runtime sync
cd /home/rahman/projects/manef-db && npm run sync:runtime
```
