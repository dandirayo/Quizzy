# Backend Schema (Database): Blind Chat Quizzy 🗄️

Kita membutuhkan database yang mendukung *WebSockets / Realtime Subscriptions* (seperti Supabase atau Appwrite). Akan ada 3 tabel baru yang akan dibuat.

## 1. Tabel `chat_queue` (Antrean Pencarian)
Digunakan sebagai antrean semantara saat user sedang "Mencari". Row dihapus begitu user match atau menekan tombol batal.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|-----------|
| `user_id` | UUID (PK) | ID user yang sedang mencari |
| `user_mbti` | VARCHAR | Tipe MBTI user tersebut (misal: "INTJ") |
| `target_mbti` | VARCHAR | Preferensi yang dicari (misal: "ENFP" atau "ANY") |
| `joined_at` | TIMESTAMPTZ | Waktu mulai mencari (digunakan untuk prioritas urutan) |

## 2. Tabel `chat_rooms` (Ruang Obrolan Aktif)
Dibuat saat algoritma *matchmaking* berhasil memasangkan dua user di tabel antrean.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|-----------|
| `id` | UUID (PK) | ID unik ruang obrolan |
| `user1_id` | UUID | ID user pertama (dianggap Host) |
| `user2_id` | UUID | ID user kedua (dianggap Guest) |
| `user1_reveal` | BOOLEAN | Apakah user 1 setuju buka identitas (Default: FALSE) |
| `user2_reveal` | BOOLEAN | Apakah user 2 setuju buka identitas (Default: FALSE) |
| `status` | VARCHAR | Status room: 'active' atau 'closed' |
| `created_at` | TIMESTAMPTZ | Waktu room terbentuk |

## 3. Tabel `chat_messages` (Isi Pesan)
Menyimpan seluruh teks percakapan dan *system events*.

| Kolom | Tipe Data | Keterangan |
|-------|-----------|-----------|
| `id` | UUID (PK) | ID unik pesan |
| `room_id` | UUID (FK) | Merujuk ke `chat_rooms.id` |
| `sender_id` | UUID (FK) | ID pengirim pesan ('system' jika pesan dari sistem) |
| `content` | TEXT | Isi pesan teks |
| `created_at` | TIMESTAMPTZ | Waktu pesan dikirim (untuk Auto-scroll ke bawah) |
