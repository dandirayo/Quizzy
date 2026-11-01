# Dokumentasi Quizzy

Mulai dari dokumen berikut:

| Dokumen | Kegunaan |
| --- | --- |
| [CORE.md](./CORE.md) | Arsitektur dan kondisi implementasi saat ini |
| [AUDIT.md](./AUDIT.md) | Temuan audit, risiko, dan urutan perbaikan |
| [Panduan_Lokal_ke_VPS.md](./Panduan_Lokal_ke_VPS.md) | Menjalankan, membangun, dan merilis aplikasi |
| [chat-feature/PRD.md](./chat-feature/PRD.md) | Batas produk Blind Chat |
| [chat-feature/TRD.md](./chat-feature/TRD.md) | Desain teknis Blind Chat |
| [chat-feature/Backend_Schema.md](./chat-feature/Backend_Schema.md) | Model data dan aturan akses Blind Chat |
| [chat-feature/Appflow.md](./chat-feature/Appflow.md) | Alur utama dan kondisi gagal Blind Chat |
| [chat-feature/UI_UX_Design.md](./chat-feature/UI_UX_Design.md) | Perilaku antarmuka dan copy |
| [chat-feature/Implementation_Plan.md](./chat-feature/Implementation_Plan.md) | Tahapan implementasi dan definition of done |
| [website-flow.html](./website-flow.html) | Peta visual; salinannya disajikan sebagai `/flow.html` |

## Aturan pemeliharaan

- Tulis status sebagai `sudah ada`, `sebagian`, atau `rencana`.
- Jangan menyebut prototipe sebagai fitur produksi.
- Klaim versi, port, route, dan skema harus dapat ditelusuri ke file di `app/`.
- Hindari alamat IP, password, private key, dan nilai secret di repositori.
- Jika `website-flow.html` berubah, sinkronkan `app/public/flow.html` atau ganti duplikasi tersebut dengan proses copy saat build.
- Perbarui tanggal verifikasi di `CORE.md` setelah lint, build, dan pemeriksaan alur utama dijalankan ulang.
