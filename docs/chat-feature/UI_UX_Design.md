# UI/UX Design: Blind Chat Quizzy 🎨

## 1. Halaman Lobby Pencarian (`/chat`)
Halaman pertama kali yang dilihat user saat membuka menu Blind Chat.
- **Tampilan Utama:** Kartu (Card) dengan tema warna ungu/pink neon khas Quizzy.
- **Kontrol Masukan (Input):**
  - Label: "Pilih target kepribadian:"
  - Dropdown: Berisi opsi "🎲 Siapa Saja (Acak)" dan ke-16 tipe MBTI yang dikelompokkan berdasarkan warna (Purple, Green, Blue, Yellow).
  - Tombol Raksasa: "🔍 Mulai Pencarian" (menggunakan gradien ungu-pink terang).
  - Teks Info: Indikator jumlah orang online (misal: "🟢 24 orang sedang online").

## 2. Status "Mencari" (Searching State)
Ketika tombol pencarian diklik, UI berganti tanpa memuat ulang halaman (*No Reload*).
- **Animasi Visual:** Animasi lingkaran radar CSS yang memutar (sweeping animation), memberikan kesan sedang "memindai" user lain.
- **Teks Informasi:** "Mencari Kecocokan...", diikuti dengan target kepribadian yang dicari (misal: "Target: Siapa Saja").
- **Waktu Pencarian:** Menampilkan teks *timer* bergulir ("Waktu mencari: 12 detik").
- **Tombol Aksi:** "Batalkan Pencarian" (tombol teks simpel agar hierarkinya lebih rendah).

## 3. Halaman Chat Room (`/chat/:roomId`)
Halaman saat dua user berhasil dihubungkan. Didesain mirip aplikasi *messenger* modern (seperti WhatsApp / Telegram).

**A. Header (Atas)**
- **Kiri:** Tombol silang "Keluar" (menggunakan konfirmasi popup "Yakin ingin pergi?").
- **Tengah:** Avatar lawan bicara (bentuk emoji Hantu 👻 di awal). Nama bertuliskan "Anonim". Di bawah nama terdapat *badge* melingkar bertuliskan tipe MBTI lawan (misal: ENFP).
- **Kanan:** Tombol "🎭 Reveal". Jika belum ditekan, tombol bersinar. Jika sudah ditekan, statusnya berubah jadi "⏳ Menunggu...".

**B. Chat Area (Tengah)**
- Kotak pesan (*Bubble chat*):
  - Pesan Sendiri: Di kanan, warna gradien ungu.
  - Pesan Lawan: Di kiri, warna abu-abu gelap dengan *outline*.
- **Pesan Sistem (System Message):** Muncul di tengah-tengah obrolan dengan *badge* kecil. Digunakan untuk notifikasi (misal: "Kamu terhubung dengan INTJ!" atau "Identitas terbuka! Lawan bicaramu adalah Dandi").

**C. Input Area (Bawah)**
- *Text Field* dengan placeholder "Ketik pesan di sini...".
- *Send Button* (Ikon pesawat kertas) dengan warna aksen ungu. Tombol berstatus *disabled* (tidak bisa ditekan) jika *text field* kosong.
