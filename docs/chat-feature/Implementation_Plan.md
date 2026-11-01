# Blind Chat: implementation plan

## Kondisi awal

Yang sudah ada:

- lobby dan pilihan MBTI;
- state pencarian dengan radar dan timer;
- room UI, composer, bubble pesan, dan tombol reveal;
- simulasi match, balasan bot, dan reveal otomatis.

Yang belum ada:

- tabel chat dan migration;
- matchmaking server-side;
- realtime message;
- pemulihan room setelah reload;
- RLS chat;
- block, report, rate limit, moderasi, dan cleanup.

## Fase 0 — prasyarat

- [ ] Putuskan umur minimum dan aturan komunitas.
- [ ] Tetapkan field profil yang boleh dibuka saat reveal.
- [ ] Tetapkan retensi pesan dan bukti report.
- [ ] Pastikan autentikasi Supabase serta hasil kuis sudah stabil.
- [ ] Tambahkan label demo pada UI saat backend belum aktif.

Selesai ketika keputusan produk tersebut terdokumentasi dan dapat diterjemahkan menjadi constraint serta copy UI.

## Fase 1 — skema dan keamanan

- [ ] Tambahkan migration untuk queue, room, participant, message, block, dan report.
- [ ] Tambahkan constraint satu queue/room aktif per user.
- [ ] Buat RLS untuk participant dan non-participant.
- [ ] Buat test policy untuk user A, B, C, dan anonymous.
- [ ] Buat cleanup job dan monitoring kegagalannya.

Selesai ketika user C gagal membaca room A–B melalui REST dan realtime, sementara A/B hanya mendapat field yang diizinkan.

## Fase 2 — matchmaking

- [ ] Implementasikan RPC/Edge Function yang atomik dan idempotent.
- [ ] Terapkan kompatibilitas preferensi dua arah dan block list.
- [ ] Tangani cancel-versus-match race.
- [ ] Tangani dua tab dan retry network.
- [ ] Tambahkan timeout serta status queue.

Selesai ketika load test konkurensi tidak menghasilkan room ganda atau participant lebih dari dua.

## Fase 3 — room dan pesan

- [ ] Ambil room dari server berdasarkan `roomId`, bukan `location.state`.
- [ ] Tambahkan fetch histori dan subscription realtime.
- [ ] Gunakan `client_message_id` untuk deduplikasi retry.
- [ ] Tampilkan status sending/sent/failed.
- [ ] Implementasikan leave, reconnect, dan grace period.

Selesai ketika dua browser dapat chat, reload, reconnect, dan menutup room tanpa kehilangan state atau membuat pesan ganda.

## Fase 4 — reveal dan keselamatan

- [ ] Simpan consent masing-masing participant.
- [ ] Pastikan data identitas tidak dikirim sebelum double consent.
- [ ] Tambahkan cancel consent sebelum persetujuan kedua.
- [ ] Implementasikan block dan report.
- [ ] Tambahkan rate limit dan batas payload.
- [ ] Siapkan halaman atau alat review moderator minimum.

Selesai setelah pengujian akses membuktikan single consent tidak membocorkan identitas dan block mencegah rematch.

## Fase 5 — observability dan peluncuran

- [ ] Tambahkan metrik queue, match, delivery, disconnect, block, dan report.
- [ ] Tambahkan alert untuk error rate dan cleanup failure.
- [ ] Uji aksesibilitas, reduced motion, keyboard, dan mobile viewport.
- [ ] Jalankan pilot terbatas dengan feature flag.
- [ ] Review hasil moderasi sebelum memperluas akses.

## Test minimum

- unit: kompatibilitas preferensi, state transition, dan validasi payload;
- integration: RPC matchmaking, constraint, RLS, dan cleanup;
- end-to-end: match, cancel, chat, reload, reconnect, reveal, leave, block, report;
- concurrency: dua tab, retry request, dan beberapa kandidat masuk bersamaan;
- abuse: spam, payload terlalu panjang, room enumeration, dan akses user ketiga.
