# Blind Chat: product requirements

Status: **prototipe antarmuka**. Belum ada matchmaking, pesan realtime, atau reveal antarpengguna.

## Masalah yang ingin diselesaikan

Hasil kuis Quizzy saat ini berhenti pada profil pribadi. Blind Chat memberi pengguna cara singkat untuk berbicara dengan orang lain berdasarkan preferensi tipe MBTI, tanpa membuka identitas sejak awal.

MBTI hanya dipakai sebagai filter percakapan dan pemantik obrolan. Sistem tidak boleh menyebut hasilnya sebagai prediksi kecocokan ilmiah.

## Pengguna sasaran

- Pengguna terdaftar yang ingin mencoba percakapan satu lawan satu.
- Pengguna yang bersedia mengikuti aturan komunitas dan batas umur layanan.
- Pengguna yang memahami bahwa anonimitas awal bukan jaminan keamanan atau kerahasiaan mutlak.

## Lingkup MVP

1. Pengguna memilih satu tipe MBTI atau opsi bebas.
2. Sistem memasukkan pengguna ke antrean dan membuat satu match secara atomik.
3. Hanya dua anggota room yang dapat membaca atau mengirim pesan.
4. Identitas awal dibatasi pada tipe MBTI dan avatar anonim.
5. Identitas profil baru terlihat setelah kedua anggota memberi persetujuan.
6. Pengguna dapat keluar, memblokir, dan melaporkan lawan bicara.
7. Sistem membatasi spam dan menghapus data sesuai kebijakan retensi.

## Di luar MVP

- Group chat, file, gambar, audio, dan panggilan.
- Riwayat lintas room atau inbox permanen.
- Rekomendasi pasangan berbasis “kecocokan psikologis”.
- Add friend langsung dari room.
- Enkripsi end-to-end.

## Aturan produk

- Satu user hanya boleh berada pada satu antrean atau satu room aktif.
- Match harus memenuhi preferensi kedua pihak, bukan hanya pencari pertama.
- Reveal bersifat per-room, dapat dibatalkan sebelum persetujuan kedua, dan tidak boleh membuka email atau data privat.
- Keluar dari room menutup kemampuan mengirim pesan. Reconnect singkat boleh memakai grace period.
- Block mencegah kedua akun dipasangkan lagi.
- Report menyimpan bukti minimum yang diperlukan untuk moderasi; retensinya harus dijelaskan kepada pengguna.

## Keamanan minimum

Fitur tidak boleh dirilis publik sebelum tersedia:

- autentikasi nyata;
- RLS dan pengujian akses silang;
- block, report, rate limit, dan spam throttling;
- batas panjang pesan dan validasi payload;
- aturan komunitas, kebijakan retensi, dan jalur moderasi;
- keputusan eksplisit mengenai umur minimum pengguna.

## Metrik awal

| Metrik | Definisi |
| --- | --- |
| Match rate | Persentase pencarian yang memperoleh room dalam batas waktu yang ditentukan |
| Median wait time | Median waktu dari masuk antrean sampai room dibuat |
| Conversation start rate | Persentase room dengan pesan dari kedua anggota |
| Report rate | Jumlah report per 1.000 room; dipantau bersama hasil review, bukan ditekan tanpa konteks |
| Reveal rate | Persentase room dengan persetujuan reveal dari kedua pihak |

Target numerik ditetapkan setelah baseline nyata tersedia. Angka simulasi tidak dihitung sebagai metrik produk.

## Acceptance criteria MVP

- Dua akun berbeda dapat match, bertukar pesan, reload, dan melanjutkan room yang sama.
- Akun ketiga tidak dapat membaca room melalui REST maupun realtime subscription.
- Dua request matchmaking bersamaan tidak menghasilkan room ganda.
- Reveal satu pihak tidak membuka identitas siapa pun.
- Block dan report tetap tercatat setelah room ditutup.
- Pengguna yang disconnect menerima perilaku yang konsisten sesuai grace period.
