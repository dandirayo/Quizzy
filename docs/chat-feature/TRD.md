# Technical Requirements Document (TRD): Blind Chat Quizzy 🛠️

## 1. Teknologi Tambahan (Tech Stack)
Saat ini Quizzy menggunakan React 19 + Vite. Untuk fitur chat, aplikasi harus naik level dengan menambahkan:
- **Backend & Realtime Database:** Supabase atau Appwrite Cloud. Keduanya memiliki fitur *WebSockets* (Realtime) bawaan yang wajib untuk fitur chat.
- **State Management:** React Context (untuk menyimpan status *room* aktif dan daftar pesan, sehingga data tidak ter-reset jika pengguna berpindah tab/halaman sementara).

## 2. Arsitektur Real-time (WebSockets)
- Tidak menggunakan teknik *polling* (menarik data tiap beberapa detik) karena membebani server dan tidak instan.
- Backend (Supabase/Appwrite) akan membuka jalur komunikasi WebSocket.
- Aplikasi klien (React) akan melakukan *subscribe* ke tabel `chat_messages` (mendengarkan event INSERT) dan tabel `chat_rooms` (mendengarkan event UPDATE).

## 3. Sistem Pencarian (Matchmaking)
- Klien melakukan INSERT ke tabel `chat_queue`.
- Klien mendengarkan perubahan pada tabel `chat_rooms` di mana ID mereka menjadi `user1_id` atau `user2_id`.
- **Matchmaking Engine:** Idealnya menggunakan *Database Trigger* atau *Edge Function* di server yang berjalan setiap ada user baru masuk antrean. Jika tidak memungkinkan (terlalu rumit), kita akan menggunakan *Optimistic Client-side Matchmaking* (klien yang mencari kecocokannya sendiri lalu membuat room).

## 4. Keamanan & Performa (Constraints)
- **Privasi:** Terapkan Row Level Security (RLS) di database. User hanya bisa membaca pesan di `room_id` tempat mereka berada. Tidak boleh sembarang query *select all messages*.
- **Kapasitas Penyimpanan:** Database gratis memiliki batas (Supabase free tier: 500MB). Kita tidak boleh menyimpan history chat selamanya.
- **Auto-Cleanup:** Akan dibuat *Cron Job* (jadwal otomatis) di backend untuk menghapus data `chat_rooms` dan `chat_messages` yang sudah lebih dari 24 jam ditutup.

## 5. Fallback & Edge Cases
- **User Disconnect:** Jika pengguna menutup browser (disconnect), sistem akan menandai *room* menjadi status "closed", dan memberi tahu lawan bicaranya "Lawan bicara telah keluar".
- **Empty Queue:** Jika tidak ada orang di antrean, UI akan terus menampilkan radar pencarian. Klien dapat membatalkan pencarian kapan saja.
