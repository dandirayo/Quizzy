# Quizzy: arsitektur dan kondisi sistem

Terakhir diverifikasi: 1 November 2026.

Dokumen ini mencatat apa yang benar-benar tersedia di repositori. Rencana yang belum diimplementasikan ditulis sebagai rencana, bukan sebagai kemampuan aplikasi.

## Ringkasan

Quizzy adalah SPA React untuk kuis kepribadian, empat mini-game, profil pengguna, pertemanan, perbandingan profil, dan prototipe Blind Chat. Aplikasi memiliki dua mode data:

- **Mode lokal** memakai `localStorage`. Mode ini cocok untuk demo di satu browser, bukan untuk autentikasi atau penyimpanan produksi.
- **Mode Supabase** aktif ketika `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` tersedia. Skema awal mencakup profil, hasil kuis, dan pertemanan. Blind Chat belum memiliki tabel atau integrasi realtime.

Mode lokal bukan cache offline untuk Supabase. Aplikasi memilih salah satu jalur saat startup; belum ada sinkronisasi dua arah atau resolusi konflik.

## Stack yang terpasang

Versi berikut diambil dari `app/package.json` dan lockfile:

| Bagian | Implementasi |
| --- | --- |
| UI | React 19.2 |
| Routing | React Router DOM 7.18 |
| Build | Vite 8.2 |
| Data cloud | Supabase JS 2.115 |
| Styling | CSS Modules dan `src/styles/global.css` |
| Pemeriksaan statis | Oxlint |
| Runtime produksi | image Node 20 untuk build, lalu Nginx Alpine |
| Port lokal | `7766` |
| Port host Docker | `5051`, diteruskan ke port `80` di container |

## Struktur utama

```text
Quizzy/
├── .github/workflows/deploy.yml
├── app/
│   ├── public/flow.html
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/AuthContext.jsx
│   │   ├── data/
│   │   ├── pages/
│   │   ├── services/{db,supabase}.js
│   │   └── App.jsx
│   ├── supabase/migrations/001_initial_schema.sql
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── nginx.conf
└── docs/
    ├── README.md
    ├── AUDIT.md
    ├── CORE.md
    ├── Panduan_Lokal_ke_VPS.md
    ├── website-flow.html
    └── chat-feature/
```

`docs/website-flow.html` dan `app/public/flow.html` saat ini identik. Keduanya harus diperbarui bersamaan sampai ada proses build yang menjadikan salah satunya sebagai sumber tunggal.

## Fitur dan status aktual

| Area | Status | Catatan |
| --- | --- | --- |
| 11 kuis | Berfungsi | Perhitungan dilakukan di klien. Hasil bersifat reflektif, bukan diagnosis psikologis. |
| Empat mini-game | Berfungsi sebagian | Build lolos, tetapi “Mending Mana?” menghasilkan persentase `NaN` karena ID string dikonversi dengan `Number()`. |
| Profil dan pertemanan lokal | Demo | Data hanya berlaku di browser yang sama. |
| Supabase profil/pertemanan | Dasar tersedia | Migrasi dan data layer ada, tetapi jalur simpan hasil kuis masih bermasalah. |
| Blind Chat | Prototipe UI | Match, jumlah pengguna online, balasan, dan persetujuan reveal semuanya disimulasikan. |
| Route protection | Belum aktif | `ProtectedRoute` ada tetapi tidak membungkus route mana pun. |
| Docker/Nginx | Build tersedia | Compose memublikasikan aplikasi pada host port `5051`. |
| CI/CD | Draft operasional | Workflow mengandalkan secret VPS dan direktori yang sudah disiapkan di server. Belum ada health check atau rollback. |

## Logika kuis

### MBTI

Tes memakai 28 pertanyaan pada empat sumbu. Jawaban bernilai `-3`, `-1`, `1`, atau `3`; arah pertanyaan dapat membalik tanda. Setiap sumbu memiliki tujuh pertanyaan, sehingga nilai absolut maksimum adalah 21. Persentase yang ditampilkan dihitung dengan:

```text
round(abs(score) / 21 * 50 + 50)
```

Nilai nol memilih sisi pertama (`E`, `S`, `T`, atau `J`). Ini adalah keputusan implementasi yang perlu disebutkan jika hasil dipakai di luar konteks hiburan.

### Attachment style

Sebanyak 24 pertanyaan membentuk skor anxiety dan avoidance. Kedua skor dinormalisasi ke 0–100, lalu dibagi pada ambang 50 menjadi empat kuadran: secure, anxious, avoidant, dan fearful.

### Kuis Likert

Kuis lain memakai skala 1–5. Pertanyaan terbalik dihitung sebagai `6 - jawaban`; rata-rata tiap dimensi kemudian dipetakan ke 0–100. Dimensi dengan skor tertinggi menjadi hasil dominan.

Tidak ada kalibrasi statistik, validasi psikometrik, atau penyimpanan versi instrumen. Jika pertanyaan atau rumus berubah, hasil lama tidak dapat ditelusuri ke versi kuis yang menghasilkannya.

## Data dan autentikasi

### Kunci lokal

| Kunci | Isi |
| --- | --- |
| `quizzy_active_user_session` | Sesi demo aktif |
| `quizzy_db_users` | Profil demo dan profil buatan pengguna |
| `quizzy_db_quiz_results` | Hasil kuis dan game |
| `quizzy_db_friendships` | Relasi pertemanan demo |
| `quizzy_{quizId}` | Hasil tamu sebelum login |
| `quizzy_dilemma_answers` | Jawaban Dilema Harian |
| `quizzy_wyr_answers` | Jawaban Mending Mana? |

Login lokal tidak memeriksa password. Identitas yang belum ada bahkan dibuat otomatis. Karena itu, label yang tepat adalah **demo session**, bukan autentikasi lokal.

### Supabase

Migrasi awal membuat `profiles`, `quiz_results`, dan `friendships` beserta sebagian kebijakan RLS. Ada dua masalah sebelum mode ini layak dipakai:

1. `saveUserQuizResult` mengirim ID seperti `res-...`, sedangkan kolom `quiz_results.id` bertipe UUID. Insert akan gagal.
2. Tabel tidak memiliki constraint unik pada `(user_id, quiz_id)`, dan jalur Supabase selalu melakukan `insert`. Perlindungan duplikasi yang ada hanya efektif di mode lokal.

Rincian dan prioritas perbaikan ada di [AUDIT.md](./AUDIT.md).

## Rute

Semua route di `src/App.jsx` saat ini publik. Beberapa halaman mengubah isi berdasarkan sesi, tetapi itu bukan route protection.

| Route | Kondisi aktual |
| --- | --- |
| `/` | Landing page |
| `/dashboard` | Katalog kuis dan game |
| `/login`, `/register` | Supabase auth atau demo session lokal |
| `/quiz/:quizId` | Kuis publik |
| `/profile`, `/profile/:username` | Tampilan dinamis sesuai sesi/username |
| `/friends` | Tampilan dinamis; bukan route terproteksi |
| `/compare/:username` | Meminta login di tingkat halaman |
| `/games/*` | Empat mini-game publik |
| `/chat` | Lobby simulasi |
| `/chat/:roomId` | Ruang chat simulasi; `roomId` belum digunakan untuk mengambil data |

## Akun demo

Mode lokal menambahkan dua profil seed:

| Username | Nama | Data awal |
| --- | --- | --- |
| `dendiz7` | Dendi Pratama | INTJ, RIASEC, Tebak Kepribadian |
| `dea33` | Dea Anindita | ENFP, secure attachment, Tebak Kepribadian |

Keduanya sudah memiliki relasi pertemanan seed. Data ini tidak otomatis tersedia di Supabase.

## Verifikasi terakhir

Perintah yang dijalankan dari `app/`:

```powershell
npm run lint
npm run build
```

Hasil pada 1 November 2026:

- build produksi berhasil;
- lint selesai tanpa error, tetapi menghasilkan 29 warning;
- belum ada test runner atau test otomatis;
- keberhasilan build tidak membuktikan alur login, RLS, realtime, atau deployment VPS.

## Batas dokumen ini

Dokumen ini tidak menyimpan password, private key, atau nilai secret. Alamat server dan kredensial operasional sebaiknya berada di secret manager atau runbook privat, bukan di repositori.
