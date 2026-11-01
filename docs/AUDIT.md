# Audit repositori Quizzy

Tanggal pemeriksaan: 1 November 2026  
Ruang lingkup: seluruh `docs/`, konfigurasi build/deploy, route, data layer, migrasi Supabase, engine kuis, mini-game, dan prototipe Blind Chat.

## Kesimpulan

Fondasi frontend cukup rapi dan build produksi berhasil. Hambatan utama bukan tampilan, melainkan batas yang kabur antara demo dan produksi. Dokumentasi sebelumnya menggambarkan Supabase, realtime chat, route protection, deduplikasi cloud, serta deployment port 80 seolah sudah selesai. Kode belum mendukung klaim tersebut.

Urutan yang paling masuk akal: benahi integritas data Supabase, pisahkan demo session dari autentikasi, perbaiki bug game, lalu bangun backend Blind Chat. Jangan mengerjakan polish realtime sebelum model keamanan dan moderasinya jelas.

## Temuan prioritas

### P0 — harus selesai sebelum mode Supabase dipakai

1. **ID hasil kuis tidak cocok dengan skema.** `db.js` membuat ID string `res-...`; migrasi mensyaratkan UUID. Insert Supabase akan gagal. Biarkan database membuat UUID atau gunakan `crypto.randomUUID()`.
2. **Deduplikasi cloud belum ada.** Jalur lokal melakukan update, tetapi jalur Supabase selalu insert. Tambahkan `UNIQUE (user_id, quiz_id)` lalu gunakan `upsert(..., { onConflict: 'user_id,quiz_id' })`.
3. **Login lokal bukan autentikasi.** Password diabaikan dan identitas baru dibuat saat login tidak cocok. Pertahankan hanya sebagai mode demo yang ditandai jelas dan pastikan mode ini tidak pernah aktif pada deployment publik.
4. **Blind Chat belum memiliki kontrol keamanan.** Tidak ada backend, RLS, blokir/lapor, rate limit, moderasi, batas umur, atau kebijakan retensi. Jangan mengiklankannya sebagai chat anonim realtime sebelum kontrol minimum tersedia.

### P1 — perbaikan sebelum rilis publik

1. **Bug persentase “Mending Mana?”.** `Number('wyr-1')` menghasilkan `NaN`, sehingga persentase dan lebar bar tidak valid. Gunakan indeks, hash string, atau angka yang diparsing dari suffix ID.
2. **Route guard tidak digunakan.** `ProtectedRoute` diimpor tetapi tidak membungkus route. Tentukan route yang memang harus privat; jangan hanya mengubah label dokumentasi.
3. **Status simpan menyesatkan.** `QuizEngine` menampilkan banner berhasil untuk pengguna login meski proses simpan dapat gagal; state `savedToDb` justru tidak dipakai. UI perlu status `saving`, `saved`, dan `error`.
4. **Deployment tidak konsisten.** Compose memakai `5051:80`; panduan lama menyebut `80:80`. Workflow memakai `/var/www/apps/Quizzy` dan `docker-compose`, sementara panduan memakai path lain dan `docker compose`.
5. **Workflow belum aman terhadap kegagalan rilis.** Tidak ada revision pin, health check, timeout, atau rollback. `git pull` langsung di server juga dapat gagal bila worktree kotor.
6. **Tidak ada test otomatis.** Perhitungan kuis, deduplikasi, auth, dan route kritis belum terlindungi regression test.

### P2 — kualitas dan pemeliharaan

1. Lint menghasilkan 29 warning, termasuk dependency hook yang hilang, state update di effect, variabel tak terpakai, dan escape string yang tidak perlu.
2. `docs/website-flow.html` dan `app/public/flow.html` identik tetapi disimpan dua kali. Ini mudah menjadi drift.
3. `app/README.md` masih README bawaan Vite dan tidak menjelaskan setup Quizzy.
4. Bundle JavaScript produksi sekitar 408 kB sebelum gzip. Belum mendesak, tetapi route-level lazy loading akan membantu ketika fitur bertambah.
5. Kuis tidak menyimpan `instrument_version` atau `scoring_version`; hasil lama sulit diaudit setelah pertanyaan berubah.
6. Beberapa angka UI adalah data palsu yang tidak diberi label, misalnya “24 orang sedang online” dan hasil komunitas mini-game.

## Audit Blind Chat

Implementasi saat ini melakukan hal berikut:

- membuat room ID acak di browser setelah timer;
- memilih profil seed sebagai lawan bicara;
- menyimpan pesan hanya di state React;
- menghasilkan balasan bot dengan `setTimeout`;
- menyetujui reveal secara otomatis setelah 2,5 detik;
- tidak memakai nilai `roomId` untuk mengambil atau memvalidasi room.

Konsekuensinya, reload halaman menghilangkan percakapan dan dapat menampilkan identitas fallback. Dua pengguna tidak pernah benar-benar terhubung.

Backend yang layak perlu matchmaking atomik di server, membership room, RLS, idempotency, status koneksi dengan grace period, retensi, rate limit, serta alur blokir/lapor. Detail desain ada di dokumen `chat-feature/`.

## Audit skema Supabase

Hal yang sudah baik:

- foreign key memakai `ON DELETE CASCADE`;
- RLS diaktifkan pada tiga tabel;
- profil publik membatasi field yang diambil di data layer;
- relasi pertemanan mencegah requester dan addressee yang sama.

Hal yang perlu diperbaiki:

- tambahkan constraint unik hasil kuis;
- tambahkan `WITH CHECK` pada policy update, bukan hanya `USING`;
- batasi transisi status friendship agar requester tidak dapat menyetujui permintaannya sendiri;
- normalisasi pasangan pertemanan agar A→B dan B→A tidak bisa menjadi dua row berbeda;
- validasi panjang dan format username di database, bukan hanya di klien;
- tambahkan kebijakan insert profil bila pembuatan profil tidak selalu melalui trigger;
- uji semua policy dengan dua user berbeda dan user anonim.

## Audit dokumentasi

Perubahan yang dilakukan dalam audit ini:

- menghapus klaim “100% siap”, “realtime”, dan “protected” yang belum didukung kode;
- menyamakan port Docker dengan konfigurasi aktual;
- memisahkan kondisi saat ini dari target arsitektur;
- menambahkan risiko keselamatan dan moderasi untuk chat anonim;
- mengganti bahasa promosi dan istilah campuran yang tidak perlu dengan instruksi singkat;
- menambahkan index dokumentasi dan aturan pemeliharaan.

## Rencana upgrade yang disarankan

### Milestone 1 — fondasi yang dapat dipercaya

- Perbaiki ID dan upsert hasil kuis Supabase.
- Perbaiki persentase Mending Mana?.
- Gunakan status simpan yang jujur di UI.
- Tentukan dan terapkan route privat.
- Tambahkan unit test untuk tiga algoritma kuis dan data layer.
- Selesaikan warning lint yang berkaitan dengan correctness.

### Milestone 2 — rilis yang dapat diulang

- Selaraskan runbook dan workflow pada satu path serta satu sintaks Compose.
- Tambahkan health endpoint atau pemeriksaan HTTP setelah deploy.
- Gunakan tag image atau commit SHA agar rollback mungkin dilakukan.
- Tambahkan HTTPS dan security headers di reverse proxy.
- Ganti README bawaan Vite dengan setup proyek.

### Milestone 3 — Blind Chat MVP

- Terapkan skema dan fungsi matchmaking atomik.
- Tambahkan realtime message dan room state.
- Terapkan RLS serta pengujian akses silang.
- Tambahkan blokir, lapor, rate limit, dan retensi.
- Uji reload, dua tab, reconnect, race condition, dan partner disconnect.
- Hapus label “demo” hanya setelah dua akun nyata lolos end-to-end test.

## Bukti verifikasi

```text
npm run lint   -> selesai, 29 warning
npm run build  -> berhasil, 104 modul ditransformasi
```

Belum ada bukti test otomatis, koneksi Supabase aktif, atau deploy VPS yang sehat. Ketiganya harus dicatat terpisah ketika benar-benar diverifikasi.
