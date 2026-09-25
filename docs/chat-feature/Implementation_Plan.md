# Implementation Plan: Blind Chat Quizzy 🚀

## Fase 1: Setup Frontend (UI Mockup) - [SELESAI ✅]
Membuat kerangka UI agar konsep desain bisa langsung dilihat dan dicoba oleh *stakeholder* (User) tanpa perlu menunggu setup backend yang rumit.
- [x] Membuat halaman `ChatLobbyPage` dengan opsi pilih MBTI.
- [x] Membuat animasi Radar pencarian menggunakan CSS.
- [x] Membuat logika simulasi antrean 3 detik (menggunakan `setTimeout`).
- [x] Membuat halaman `ChatRoomPage` lengkap dengan header profil anonim.
- [x] Membuat fungsi kirim pesan (membuat bot *dummy* untuk merespons).
- [x] Mengimplementasikan logika simulasi persetujuan "Reveal" identitas.

## Fase 2: Setup Database & Backend
Tahap ini wajib diselesaikan oleh *Project Owner* (pemilik aplikasi).
- [ ] Mendaftar ke penyedia Database (Pilih: **Supabase** atau **Appwrite**). Supabase lebih disarankan karena dokumentasi React dan Realtime-nya sangat matang.
- [ ] Menyalin URL API dan Anon Key ke dalam file `.env` di projek Quizzy.
- [ ] Membuat ketiga tabel (`chat_queue`, `chat_rooms`, `chat_messages`) sesuai struktur di *Backend Schema*.
- [ ] Menyalakan izin *Row Level Security* (RLS) di Supabase.

## Fase 3: Integrasi API
Menyambungkan UI yang sudah dibuat di Fase 1 ke Database asli (Fase 2).
- [ ] Mengganti logika simulasi di `ChatLobbyPage` dengan perintah INSERT `chat_queue`.
- [ ] Membuat pendengar (*listener*) Supabase WebSocket yang akan mengalihkan pengguna ke URL `/chat/:roomId` jika ID-nya masuk ke dalam tabel `chat_rooms`.
- [ ] Menambahkan logika *matching* (jika *queue* mendeteksi kriteria yang cocok).
- [ ] Mengubah `ChatRoomPage` agar menampilkan pesan *real-time* dari tabel `chat_messages` yang ditarik via WebSockets.
- [ ] Menambahkan *cleanup*: jika user menutup tab, status room berubah menjadi 'closed'.
