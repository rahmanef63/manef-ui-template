# analyze-feature

Analisis feature module di manef-ui untuk struktur, pola Convex, dan kelengkapan implementasi.

Gunakan agent `feature-validator` untuk analisis lengkap.

## Usage

```
/analyze-feature {feature-name}
```

## Yang Dicek

1. Struktur file (index.tsx, komponen, hooks)
2. Pola import Convex (harus gunakan `appApi` pattern)
3. Workspace context (`useOpenClawNavigator`)
4. Zod validation untuk form inputs
5. Loading dan error states
6. Tidak ada MOCK_* data
7. Tidak ada hardcoded IDs

## Contoh Analisis Manual

```bash
# Lihat semua file di feature
ls -la /home/rahman/projects/manef-ui/features/{feature-name}/

# Cek pola import
grep -r "appApi\|useAppQuery\|useAppMutation" \
  /home/rahman/projects/manef-ui/features/{feature-name}/

# Cek apakah ada MOCK_* tersisa
grep -r "MOCK_" /home/rahman/projects/manef-ui/features/{feature-name}/

# Cek Convex domain yang digunakan
grep -r "appApi.features." /home/rahman/projects/manef-ui/features/{feature-name}/
```

## Feature yang Sudah Valid (Per 2026-03-13)
- agents — live data, edit UI, registration status
- sessions — live data
- channels — live data dengan workspace bindings
- config — live data dengan write-through
- crons — fully wired (enable/disable/run/remove/create)
- logs — live data
- instances — empty state (bukan fallback MOCK)
