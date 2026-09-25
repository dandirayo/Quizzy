# Product Requirements Document (PRD): Blind Chat Quizzy 💬

## 1. Latar Belakang & Tujuan (Goal)
Quizzy saat ini memiliki banyak kuis kepribadian (MBTI, Big Five, dll), namun belum ada ruang untuk interaksi sosial antar pengguna. 
Tujuan dari fitur **Blind Chat** ini adalah meningkatkan retensi dan keterlibatan pengguna (*user engagement*) dengan memungkinkan mereka berinteraksi secara anonim dengan pengguna lain berdasarkan kecocokan tipe kepribadian (MBTI).

## 2. Target Pengguna
- Pengguna yang ingin bereksperimen mengobrol dengan tipe kepribadian yang berbeda (contoh: ekstrovert penasaran ngobrol dengan introvert).
- Pengguna yang mencari teman ngobrol (*casual chat*) dengan minat psikologi yang sama.
- Pengguna yang kesepian dan butuh teman cerita secara anonim tanpa penghakiman.

## 3. Fitur Utama (Core Features)
- **Filter Pencarian:** Pengguna dapat mencari teman ngobrol secara "Acak (Bebas)" atau memilih "Tipe Kepribadian Spesifik" (misal: mencari INFJ).
- **Matchmaking Otomatis:** Sistem memasangkan dua pengguna yang sedang berada di antrean (*queue*) dengan preferensi yang cocok.
- **Blind Chat (Anonim):** Obrolan bersifat anonim di awal. Hanya menampilkan avatar monster/emoji dan tipe MBTI.
- **Reveal Profile:** Tombol persetujuan bersama (konsensual). Jika *kedua* belah pihak menekan tombol ini, nama asli dan profil lengkap mereka akan terbuka.
- **Akhiri Obrolan (Skip):** Pengguna dapat meninggalkan obrolan kapan saja dan langsung kembali ke antrean untuk mencari orang baru.

## 4. Metrik Kesuksesan (Success Metrics)
- **Daily Active Users (DAU):** Meningkat karena alasan sosial.
- **Average Session Length:** Pengguna menghabiskan waktu lebih lama di web (bertahan > 5 menit per sesi chat).
- **Match Rate:** Berapa banyak persentase pengguna di antrean yang berhasil menemukan pasangan chat dalam waktu kurang dari 1 menit.

## 5. Non-Goals (Yang Tidak Dibangun Saat Ini)
Demi menjaga fitur tetap ringan dan cepat rilis (MVP):
- Chat grup (hanya 1v1).
- Pengiriman file, gambar, atau *voice note* (hanya teks dan emoji).
- Chat persisten selamanya (riwayat chat otomatis terhapus saat room ditutup demi privasi dan menghemat kapasitas database).
- Sistem "Add Friend" langsung dari chat (akan dipertimbangkan di fase berikutnya).
