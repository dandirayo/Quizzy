# Blind Chat: model data

Status: rancangan. Tabel berikut belum ada di migrasi `001_initial_schema.sql`.

Model ini memilih tabel participant terpisah agar aturan akses, consent, dan perluasan status tidak bergantung pada kolom `user1_*`/`user2_*`.

## `chat_queue`

| Kolom | Tipe | Aturan |
| --- | --- | --- |
| `user_id` | UUID | PK, FK ke `profiles.id` |
| `user_mbti` | TEXT | Check salah satu dari 16 tipe |
| `target_mbti` | TEXT | 16 tipe atau `ANY` |
| `request_id` | UUID | Unik; untuk idempotency |
| `status` | TEXT | `waiting`, `matched`, `cancelled`, `expired` |
| `joined_at` | TIMESTAMPTZ | Default `now()` |
| `expires_at` | TIMESTAMPTZ | Wajib, lebih besar dari `joined_at` |

Satu primary key per user mencegah antrean aktif ganda. Kandidat dicari dengan index pada `(status, joined_at)` dan, bila diperlukan, `(status, target_mbti, joined_at)`.

## `chat_rooms`

| Kolom | Tipe | Aturan |
| --- | --- | --- |
| `id` | UUID | PK, dibuat database |
| `status` | TEXT | `active`, `closing`, `closed` |
| `created_at` | TIMESTAMPTZ | Default `now()` |
| `closed_at` | TIMESTAMPTZ | Nullable |
| `close_reason` | TEXT | Nullable; nilai terbatas |

Room tidak menyimpan identitas pada payload publik. Keanggotaan berada di tabel participant.

## `chat_participants`

| Kolom | Tipe | Aturan |
| --- | --- | --- |
| `room_id` | UUID | FK ke `chat_rooms.id`, bagian dari PK |
| `user_id` | UUID | FK ke `profiles.id`, bagian dari PK |
| `anonymous_label` | TEXT | Label aman yang dibuat server |
| `reveal_consented_at` | TIMESTAMPTZ | Nullable |
| `joined_at` | TIMESTAMPTZ | Default `now()` |
| `left_at` | TIMESTAMPTZ | Nullable |
| `last_seen_at` | TIMESTAMPTZ | Untuk presence/grace period |

Primary key `(room_id, user_id)`. Function pembuat room harus memastikan tepat dua participant dan satu room aktif maksimal per user.

## `chat_messages`

| Kolom | Tipe | Aturan |
| --- | --- | --- |
| `id` | BIGINT identity atau UUID v7 | PK, dibuat server |
| `room_id` | UUID | FK ke `chat_rooms.id` |
| `sender_id` | UUID | Nullable untuk event sistem; FK ke `profiles.id` |
| `kind` | TEXT | `user` atau `system` |
| `content` | TEXT | Panjang 1 sampai batas yang disepakati |
| `client_message_id` | UUID | Nullable; unik per sender untuk retry |
| `created_at` | TIMESTAMPTZ | Default `now()` |

Gunakan constraint agar `kind = 'user'` selalu memiliki `sender_id`, sedangkan system event tidak berpura-pura menjadi UUID bernilai `'system'`. Index utama: `(room_id, created_at, id)`.

## `chat_blocks`

| Kolom | Tipe | Aturan |
| --- | --- | --- |
| `blocker_id` | UUID | FK profil, bagian dari PK |
| `blocked_id` | UUID | FK profil, bagian dari PK |
| `created_at` | TIMESTAMPTZ | Default `now()` |

Constraint menolak block terhadap diri sendiri. Matchmaking mengecualikan block dari kedua arah.

## `chat_reports`

| Kolom | Tipe | Aturan |
| --- | --- | --- |
| `id` | UUID | PK |
| `room_id` | UUID | FK room |
| `reporter_id` | UUID | FK profil |
| `reported_user_id` | UUID | FK profil |
| `reason` | TEXT | Enum/check terkontrol |
| `details` | TEXT | Nullable, dibatasi panjangnya |
| `message_id` | BIGINT/UUID | Nullable; FK pesan sesuai tipe ID |
| `created_at` | TIMESTAMPTZ | Default `now()` |
| `review_status` | TEXT | `open`, `reviewing`, `resolved`, `dismissed` |

## Retensi

Retensi harus berupa kebijakan produk yang eksplisit, bukan asumsi di UI. Contoh awal:

- queue kedaluwarsa: hapus setelah beberapa jam;
- pesan room normal: hapus setelah jangka waktu yang diumumkan;
- bukti report: simpan terpisah selama periode moderasi yang dibenarkan;
- metadata agregat: jangan menyimpan isi pesan.

Pekerjaan cleanup dijalankan server-side dan dipantau. Menutup room tidak otomatis berarti row langsung terhapus.

## RLS minimum

- user dapat membaca dan membatalkan queue miliknya sendiri;
- participant dapat membaca room, participant terbatas, dan pesan room-nya;
- user C tidak dapat mengetahui bahwa room A–B ada;
- insert pesan hanya diizinkan untuk participant room aktif;
- consent hanya dapat diubah oleh pemilik participant row;
- report hanya dapat dibuat oleh participant dan dibaca moderator;
- fungsi matchmaking memverifikasi `auth.uid()` dan tidak menerima `user_id` sewenang-wenang dari klien.
