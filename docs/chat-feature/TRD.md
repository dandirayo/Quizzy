# Blind Chat: technical design

Status: target arsitektur. Source saat ini masih simulasi di `ChatLobbyPage.jsx` dan `ChatRoomPage.jsx`.

## Keputusan utama

- Gunakan Supabase agar konsisten dengan dependency dan migrasi yang sudah ada.
- Matchmaking dijalankan di server melalui database function atau Edge Function. Klien tidak boleh memilih lawan atau membuat room sendiri.
- PostgreSQL menyimpan state yang perlu diaudit; Supabase Realtime mendistribusikan perubahan.
- React state menyimpan tampilan sementara. State room yang penting harus dapat dipulihkan setelah reload.

## Alur matchmaking

1. Klien memanggil fungsi `join_chat_queue(target_mbti, request_id)`.
2. Fungsi memvalidasi autentikasi, profil MBTI, block list, dan room aktif.
3. Dalam transaksi yang sama, fungsi mengunci kandidat antrean tertua yang kompatibel dengan `FOR UPDATE SKIP LOCKED`.
4. Jika ada kandidat, fungsi menghapus kedua row antrean dan membuat room beserta dua participant.
5. Jika belum ada kandidat, fungsi menyimpan atau memperbarui row antrean user.
6. Klien subscribe pada row antreannya atau event room yang hanya dapat dibaca user tersebut.

`request_id` membuat operasi idempotent ketika klien retry. Constraint database tetap menjadi pertahanan utama terhadap match ganda.

## Pesan

- Klien melakukan insert ke `chat_messages`; database mengambil `sender_id` dari `auth.uid()` melalui function atau RLS yang ketat.
- Payload awal hanya teks UTF-8 dengan batas panjang yang eksplisit.
- Urutan memakai `created_at` dan ID monotonic/sequence; timestamp klien tidak dipercaya.
- Realtime event dipakai untuk kecepatan, tetapi reload selalu mengambil histori room dari database.
- Optimistic UI harus menandai status `sending`, `sent`, dan `failed` dengan `client_message_id` untuk deduplikasi retry.

## Reveal

Setiap participant memiliki `reveal_consented_at`. Profil baru ditampilkan jika dua timestamp terisi. Klien tidak boleh menerima nama/avatar lawan sebelum kondisi ini terpenuhi; menyembunyikan data yang sudah dikirim ke browser bukan kontrol keamanan.

View atau RPC `get_chat_room` sebaiknya hanya mengembalikan identitas penuh ketika persetujuan kedua pihak sudah tercatat.

## Presence dan disconnect

WebSocket putus tidak selalu berarti pengguna sengaja keluar. Gunakan heartbeat/presence dan grace period, misalnya 30–60 detik. Aksi “Keluar” menutup room segera; koneksi putus baru menutup room setelah grace period lewat.

## Kontrol akses

- Semua tabel mengaktifkan RLS.
- Queue hanya dapat dibaca pemilik row; pencarian kandidat hanya dilakukan function `SECURITY DEFINER` yang dibatasi.
- Room dan message hanya dapat dibaca participant.
- User hanya dapat mengirim sebagai dirinya sendiri ke room aktif yang diikutinya.
- Persetujuan reveal hanya dapat diperbarui pada row participant milik sendiri.
- Report dapat dibuat pelapor, tetapi hanya role moderator/service yang dapat membaca isi laporan.

Setiap policy harus diuji dengan user A, user B, user C, dan anonymous role.

## Abuse prevention

- batas pesan per user dan per room;
- cooldown join/leave untuk mencegah queue churn;
- batas panjang dan frekuensi pesan;
- block list diperiksa saat matchmaking;
- report menyimpan alasan, message reference, dan snapshot minimum;
- log moderasi terpisah dari data analitik umum.

## Observability

Catat event terstruktur tanpa isi pesan mentah jika tidak diperlukan:

- queue joined/cancelled/expired;
- match created;
- room closed beserta alasan;
- send failure dan reconnect;
- block/report;
- latency matchmaking dan delivery.

Jangan mencatat token, email, atau isi percakapan ke log aplikasi.

## Kegagalan yang harus ditangani

- retry request yang sama;
- dua tab dari user yang sama;
- kandidat keluar saat transaksi berjalan;
- reload langsung pada `/chat/:roomId`;
- event realtime terlambat atau terduplikasi;
- token kedaluwarsa saat chat aktif;
- room sudah ditutup ketika pesan dikirim;
- partner disconnect lalu reconnect dalam grace period.
