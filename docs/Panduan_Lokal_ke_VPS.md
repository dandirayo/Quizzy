# Menjalankan dan merilis Quizzy

Panduan ini mengikuti konfigurasi yang ada di repositori pada 1 November 2026. Nilai host, username SSH, dan secret tidak ditulis di sini; simpan semuanya di GitHub Actions Secrets atau runbook privat.

## Prasyarat lokal

- Node.js 20 atau versi yang kompatibel dengan Vite 8
- npm
- Git
- Docker dengan Compose plugin, jika ingin menguji image produksi

## Menjalankan aplikasi lokal

```powershell
cd C:\Users\ASUS\Documents\GitHub\Quizzy\app
npm install
npm run dev
```

Buka:

- aplikasi: `http://localhost:7766/`
- peta alur: `http://localhost:7766/flow.html`

Server dev memakai `--host 0.0.0.0`, sehingga dapat diakses dari perangkat satu jaringan melalui IP laptop. Jangan membuka port ini ke internet.

Tanpa environment Supabase, aplikasi berjalan dalam **mode demo lokal**. Data tersimpan di browser dan login lokal tidak memverifikasi password. Mode ini bukan pengganti autentikasi produksi.

## Environment Supabase

Buat `app/.env.local` bila ingin menguji Supabase:

```dotenv
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Anon key memang dipakai di browser dan harus dilindungi oleh RLS. Jangan pernah menaruh service-role key di variable `VITE_*`.

Mode Supabase belum layak dipakai sebelum temuan P0 di [AUDIT.md](./AUDIT.md) selesai, khususnya ketidaksesuaian UUID dan deduplikasi hasil kuis.

## Pemeriksaan sebelum commit

Jalankan dari `app/`:

```powershell
npm run lint
npm run build
```

Build yang berhasil hanya membuktikan bundling selesai. Tetap uji secara manual:

- login/register pada mode yang akan dirilis;
- satu kuis dari setiap jenis scoring;
- penyimpanan dan pembaruan hasil;
- profil, pertemanan, dan compare;
- tampilan 360 px, 768 px, dan desktop;
- direct navigation ke route SPA setelah refresh.

Saat audit terakhir, build berhasil dan lint menghasilkan 29 warning. Blind Chat masih demo.

## Menguji image produksi

`docker-compose.yml` memetakan host port `5051` ke port `80` container:

```powershell
docker compose up -d --build
docker compose ps
```

Buka `http://localhost:5051/`. Periksa log bila container tidak sehat:

```powershell
docker compose logs --tail 200 quizzy
```

Hentikan stack setelah pengujian:

```powershell
docker compose down
```

## Menyimpan perubahan

Periksa perubahan sebelum commit. Jangan memakai `git add .` secara buta jika worktree berisi file lokal atau secret.

```powershell
git status --short
git diff
git add app docs .github
git commit -m "docs: align architecture and deployment notes"
git push origin main
```

Sesuaikan file yang di-stage dengan perubahan yang memang ingin dirilis.

## Persiapan VPS

Contoh workflow saat ini mengharapkan repositori sudah tersedia di:

```text
/var/www/apps/Quizzy
```

Gunakan user deploy non-root dengan akses minimum ke direktori aplikasi dan Docker. Pasang reverse proxy/TLS di depan port `5051`, atau ubah mapping Compose secara sengaja jika arsitektur server berbeda.

Secret GitHub Actions yang dibutuhkan workflow:

| Secret | Isi |
| --- | --- |
| `VPS_HOST` | hostname atau IP VPS |
| `VPS_USERNAME` | user deploy non-root |
| `VPS_SSH_KEY` | private key khusus deployment |
| `VPS_PORT` | port SSH |

Jangan menggunakan password root di langkah deployment otomatis.

## Deployment manual

Gunakan nilai host dan user dari runbook privat:

```bash
ssh deploy@your-host
cd /var/www/apps/Quizzy
git status --short
git pull --ff-only origin main
cd app
docker compose up -d --build --remove-orphans
docker compose ps
curl --fail http://127.0.0.1:5051/
```

`git pull --ff-only` mencegah merge tak disengaja di server. Jika `git status` tidak bersih, hentikan deployment dan periksa perubahan; jangan menghapusnya secara otomatis.

## Deployment otomatis

Workflow `.github/workflows/deploy.yml` saat ini menjalankan SSH setelah push ke `main`. Sebelum mengandalkannya untuk produksi, perbaiki hal berikut:

1. gunakan `docker compose` secara konsisten;
2. tambahkan `set -euo pipefail` pada script;
3. gunakan `git pull --ff-only` atau checkout commit SHA yang dikirim workflow;
4. tambahkan health check HTTP setelah container hidup;
5. simpan image/revision sebelumnya untuk rollback;
6. batasi environment GitHub dengan approval jika deployment bersifat produksi.

## Rollback

Workflow saat ini belum menyediakan rollback otomatis. Prosedur minimum adalah mencatat commit terakhir yang sehat, checkout commit tersebut di server, rebuild, lalu menjalankan health check. Jangan memakai `git reset --hard` pada server tanpa memastikan tidak ada perubahan yang perlu disimpan.

## Database dan migrasi

Migrasi Supabase berada di `app/supabase/migrations/`. Blind Chat belum memiliki migration. Menambahkan PostgreSQL biasa ke Compose tidak otomatis menyediakan Supabase Auth, RLS API, atau Realtime; komponen tersebut harus dipasang dan dioperasikan secara terpisah jika memilih self-hosted Supabase.

Sebelum menjalankan migration di produksi:

- buat backup;
- uji pada project staging;
- review policy RLS dengan beberapa role;
- tentukan rollback schema/data;
- jangan menjalankan service-role key di frontend.

## Pemeriksaan setelah rilis

- endpoint publik memakai HTTPS;
- halaman utama dan direct route mengembalikan status sukses;
- asset terbaru termuat, bukan cache lama;
- login dan satu operasi tulis berhasil;
- log Nginx/container tidak menunjukkan error berulang;
- versi/commit yang dirilis tercatat;
- tidak ada `.env`, key, atau credential dalam bundle dan repositori.
