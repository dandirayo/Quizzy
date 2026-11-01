# Blind Chat: perilaku antarmuka

Dokumen ini menentukan perilaku, bukan gaya visual final. UI saat ini adalah demo dan harus diberi label demikian sampai backend tersedia.

## Lobby `/chat`

Elemen minimum:

- penjelasan singkat bahwa MBTI hanya filter percakapan;
- select target: bebas atau salah satu dari 16 tipe;
- tombol `Mulai mencari`;
- tautan aturan komunitas dan privasi;
- label `Mode demo` jika data masih disimulasikan.

Jangan menampilkan “24 orang online” kecuali nilainya berasal dari presence yang nyata. Untuk demo, gunakan teks “Simulasi pencarian” tanpa angka palsu.

## State mencari

- Tampilkan durasi, target, dan tombol `Batalkan`.
- Animasi radar boleh digunakan, tetapi hormati `prefers-reduced-motion`.
- Setelah batas waktu, tawarkan lanjut menunggu, ganti target ke bebas, atau kembali.
- Tombol tidak boleh memulai request kedua selama request pertama masih berjalan.

Copy yang disarankan:

```text
Mencari teman ngobrol
Target: ENFP · 18 detik
```

Hindari “Mencari kecocokan” karena sistem hanya mencocokkan preferensi filter, bukan menilai kecocokan psikologis.

## Room `/chat/:roomId`

### Header

- tombol keluar dengan konfirmasi jika room masih aktif;
- avatar anonim, label lawan bicara, dan MBTI;
- status koneksi;
- menu berisi block dan report;
- aksi reveal dengan status yang jelas.

### Pesan

- bubble sendiri di kanan, lawan di kiri, event sistem di tengah;
- timestamp atau pengelompokan waktu yang dapat dibaca;
- status pesan `mengirim`, `terkirim`, atau `gagal`;
- tombol retry tidak membuat pesan duplikat;
- area pesan memakai live-region secara hati-hati agar screen reader tidak membacakan seluruh histori berulang kali.

### Composer

- textarea, bukan input satu baris, jika pesan dapat memuat newline;
- batas karakter terlihat saat mendekati maksimum;
- tombol kirim disabled untuk pesan kosong dan saat rate-limited;
- error tidak menghapus draft.

## Reveal

Sebelum consent pertama, tombol bertuliskan `Buka identitas`. Dialog menjelaskan field yang akan dibagikan, misalnya nama tampilan, username, dan avatar.

State yang dibutuhkan:

1. belum diminta;
2. consent saya tersimpan, menunggu lawan;
3. lawan meminta, saya belum setuju;
4. kedua pihak setuju;
5. request gagal atau room sudah tutup.

Confetti bersifat opsional dan tidak boleh menutupi informasi utama. Hormati reduced motion.

## Empty, error, dan reconnect

- Room tidak ditemukan: “Room tidak tersedia atau kamu tidak memiliki akses.”
- Token kedaluwarsa: minta login ulang tanpa menampilkan data room.
- Koneksi putus: pertahankan draft dan tampilkan status reconnect.
- Partner pergi: nonaktifkan composer dan sediakan tombol kembali ke lobby.
- Rate limit: tampilkan waktu tunggu yang nyata jika server menyediakannya.

## Mobile dan aksesibilitas

- target sentuh minimal 44×44 px;
- layout diuji pada tinggi viewport kecil dan ketika keyboard terbuka;
- fokus berpindah secara masuk akal setelah dialog atau error;
- semua tombol ikon memiliki accessible name;
- warna bukan satu-satunya penanda status;
- kontras teks dan kontrol memenuhi WCAG AA.
