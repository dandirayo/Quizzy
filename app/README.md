# Quizzy 🧠✨

Platform kuis kepribadian interaktif, refleksi psikologis, mini games santai, dan perbandingan kecocokan karakter bersama teman.

---

## 🚀 Fitur Utama

1. **Kuis Psikologi Komprehensif**
   - MBTI (16 Tipe Kepribadian)
   - RIASEC (Minat Karir & Vokasional)
   - Big Five Personality
   - Attachment Style (Gaya Kelekatan Emosional)
   - Enneagram & DISC
2. **4 Mini Games Interaktif**
   - *Daily Dilemma*: Refleksi skenario moral & psikologis harian.
   - *Personality Swipe*: Swipe kartu preferensi cepat.
   - *Mending Mana? (Would You Rather)*: Pilihan preferensi dengan komparasi persentase komunitas.
   - *Tebak Kepribadian*: Quiz tebak karakter berdasarkan skenario perilaku.
3. **Sosial & Komunitas**
   - Kartu Identitas Psikologis profil terpadu.
   - Pencarian teman terdaftar secara dinamis.
   - Permintaan pertemanan (Kirim, Terima, Tolak, Hapus).
   - *Compare Mode*: Analisis kecocokan kepribadian berdampingan dengan teman.
   - *Blind Chat (Simulasi AI Bot)*: Eksplorasi obrolan anonim berbasis tipe kepribadian.

---

## 🛠️ Tech Stack & Arsitektur

- **Frontend:** React 19, Vite 8, React Router v7, CSS Modules + Vanilla CSS Variables
- **Security:** SHA-256 client hashing (`crypto.subtle`), Sanitized Data Layer, Row Level Security (RLS)
- **Database/Backend Support:**
  - *Mode Lokal:* `localStorage` dengan auto-sanitasi data sensitif dan per-browser storage.
  - *Mode Cloud:* Supabase (PostgreSQL Auth & PostgREST Database dengan RLS policies).
- **Deployment:**
  - GitHub Pages (`https://dandirayo.github.io/Quizzy/`) via GitHub Actions.
  - Docker Compose + Nginx Alpine di VPS (port `127.0.0.1:5051:80` dengan reverse proxy).

---

## 💻 Panduan Menjalankan Lokal

```bash
# 1. Masuk ke direktori app
cd app

# 2. Pasang dependensi
npm ci

# 3. Jalankan automated test
npm test

# 4. Jalankan linter
npm run lint

# 5. Jalankan server dev
npm run dev
```

Aplikasi dapat diakses di `http://localhost:7766/`.

---

## 🔐 Konfigurasi Supabase (Opsional untuk Online Multiplayer)

Buat file `.env` di folder `app/`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Jalankan skrip migrasi database di SQL Editor Supabase:
`app/supabase/migrations/001_initial_schema.sql`.

Untuk menghubungkan ke GitHub Pages, tambahkan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` ke **Settings > Secrets and variables > Actions > Repository secrets**.

---

## 🧪 Testing & Quality Assurance

```bash
# Jalankan unit test suite
npm test

# Jalankan oxlint
npm run lint

# Jalankan build verifikasi
npm run build
```
