// ==========================================
// GAME DATA — Quizzy Mini Games v2.0
// ==========================================

// =========================
// 1. DILEMA HARIAN (14 soal)
// =========================
export const DAILY_DILEMMAS = [
  {
    id: 'dilemma-1',
    question: 'Pilih mana yang lebih baik untuk masa depanmu?',
    optionA: { text: 'Gaji besar tapi pekerjaan sangat membuat stres', emoji: '💰', color: '#f59e0b', mockPercentage: 35 },
    optionB: { text: 'Gaji pas-pasan tapi hati tenang dan jam kerja normal', emoji: '🧘', color: '#3b82f6', mockPercentage: 65 },
    insight: 'Pilihan ini menunjukkan apakah kamu lebih didorong oleh pencapaian eksternal (ambisi) atau kesejahteraan internal (peace of mind). Mayoritas tipe perasa (Feeling) memilih opsi B.'
  },
  {
    id: 'dilemma-2',
    question: 'Kalau ada teman yang bau badan, apa yang kamu lakukan?',
    optionA: { text: 'Bilang langsung jujur walau mungkin dia tersinggung', emoji: '🗣️', color: '#ef4444', mockPercentage: 42 },
    optionB: { text: 'Diam saja atau ngasih kode halus (kasih parfum)', emoji: '🤫', color: '#8b5cf6', mockPercentage: 58 },
    insight: 'Ini menguji gaya komunikasimu: Langsung (Direct) vs Menjaga Harmoni (Diplomatic). Tipe Thinker cenderung memilih A, sedangkan Feeler memilih B.'
  },
  {
    id: 'dilemma-3',
    question: 'Kamu dikasih waktu 1 tahun libur tanpa kerja. Apa yang kamu pilih?',
    optionA: { text: 'Keliling dunia sendirian dan eksplorasi budaya baru', emoji: '✈️', color: '#06b6d4', mockPercentage: 47 },
    optionB: { text: 'Belajar skill baru dari rumah dan bangun proyek sampingan', emoji: '💻', color: '#a855f7', mockPercentage: 53 },
    insight: 'Tipe Extrovert dan Sensing cenderung memilih pengalaman langsung (A), sementara Introvert dan Intuitive memilih pengembangan internal (B).'
  },
  {
    id: 'dilemma-4',
    question: 'Sahabatmu selingkuh. Pasangannya bertanya padamu, apa yang kamu lakukan?',
    optionA: { text: 'Jujur bilang yang sebenarnya, itu haknya untuk tahu', emoji: '⚖️', color: '#22c55e', mockPercentage: 38 },
    optionB: { text: 'Tidak ikut campur, itu urusan mereka berdua', emoji: '🙈', color: '#f97316', mockPercentage: 62 },
    insight: 'Dilema klasik antara keadilan (Justice) dan loyalitas (Loyalty). Tipe Judging cenderung memilih A karena memegang prinsip, sementara tipe Perceiving lebih fleksibel.'
  },
  {
    id: 'dilemma-5',
    question: 'Kamu bisa memilih satu superpower. Pilih mana?',
    optionA: { text: 'Bisa membaca pikiran semua orang', emoji: '🧠', color: '#ec4899', mockPercentage: 31 },
    optionB: { text: 'Bisa menghentikan waktu sesuka hati', emoji: '⏱️', color: '#6366f1', mockPercentage: 69 },
    insight: 'Membaca pikiran (A) menunjukkan ketertarikan pada pemahaman sosial — tipikal Feeler dan Intuitive. Menghentikan waktu (B) menunjukkan keinginan kontrol dan efisiensi — tipikal Thinker.'
  },
  {
    id: 'dilemma-6',
    question: 'Di kantor baru, kamu lebih suka...',
    optionA: { text: 'Langsung kenalan dan ngobrol akrab dengan semua orang', emoji: '🤝', color: '#f59e0b', mockPercentage: 44 },
    optionB: { text: 'Observasi dulu dari jauh, pelan-pelan baru buka diri', emoji: '👀', color: '#3b82f6', mockPercentage: 56 },
    insight: 'Ini adalah indikator paling jelas dari spektrum Extraversion vs Introversion. Keduanya valid — yang satu recharge lewat interaksi, yang lain lewat ketenangan.'
  },
  {
    id: 'dilemma-7',
    question: 'Deadline besok pagi. Tugas belum selesai. Kamu...',
    optionA: { text: 'Begadang sampai selesai, apapun yang terjadi', emoji: '🌙', color: '#ef4444', mockPercentage: 55 },
    optionB: { text: 'Tidur dulu, bangun subuh, kerjakan dengan kepala segar', emoji: '😴', color: '#22c55e', mockPercentage: 45 },
    insight: 'Tipe Judging biasanya tidak sampai di posisi ini (sudah selesai duluan!). Tipe Perceiving sering di sini dan pilihan mereka menunjukkan strategi coping masing-masing.'
  },
  {
    id: 'dilemma-8',
    question: 'Kamu menemukan dompet berisi uang banyak di jalan. Tidak ada yang lihat.',
    optionA: { text: 'Ambil uangnya — rezeki nomplok!', emoji: '💸', color: '#f97316', mockPercentage: 18 },
    optionB: { text: 'Cari pemiliknya atau serahkan ke polisi', emoji: '🏛️', color: '#3b82f6', mockPercentage: 82 },
    insight: 'Pilihan moral klasik. Mayoritas memilih B (secara survei), tapi dalam praktik nyata, hasilnya lebih beragam. Ini disebut Social Desirability Bias — kecenderungan menjawab sesuai harapan sosial.'
  },
  {
    id: 'dilemma-9',
    question: 'Kamu dikritik keras oleh bos di depan rekan kerja. Reaksimu?',
    optionA: { text: 'Langsung klarifikasi dan bela diri di tempat', emoji: '🔥', color: '#ef4444', mockPercentage: 34 },
    optionB: { text: 'Diam dulu, proses di dalam, baru bicara empat mata nanti', emoji: '🧊', color: '#6366f1', mockPercentage: 66 },
    insight: 'Tipe Thinking-Extrovert cenderung langsung membela diri (A). Tipe Feeling-Introvert memilih memproses emosi dulu (B). Keduanya punya kekuatan masing-masing.'
  },
  {
    id: 'dilemma-10',
    question: 'Kamu punya kesempatan pindah ke luar negeri. Tapi harus tinggalkan keluarga.',
    optionA: { text: 'Pergi — ini kesempatan yang mungkin tidak datang dua kali', emoji: '🌏', color: '#06b6d4', mockPercentage: 40 },
    optionB: { text: 'Tetap di sini — keluarga lebih penting dari apapun', emoji: '🏠', color: '#ec4899', mockPercentage: 60 },
    insight: 'Ini menguji value hierarchy-mu: Achievement vs Belonging. Tidak ada jawaban benar — hanya preferensi yang berbeda.'
  },
  {
    id: 'dilemma-11',
    question: 'Saat liburan, kamu lebih suka...',
    optionA: { text: 'Tempat ramai penuh hiburan dan aktivitas seru', emoji: '🎢', color: '#f59e0b', mockPercentage: 43 },
    optionB: { text: 'Tempat sunyi, alam terbuka, jauh dari keramaian', emoji: '🏔️', color: '#22c55e', mockPercentage: 57 },
    insight: 'Preferensi liburan sering mencerminkan bagaimana seseorang me-recharge energi. Extrovert cenderung A, Introvert cenderung B — tapi banyak ambivert yang suka keduanya!'
  },
  {
    id: 'dilemma-12',
    question: 'Kamu diminta memimpin proyek besar di kantor. Tapi kamu belum yakin kompeten.',
    optionA: { text: 'Terima — belajar sambil jalan, nanti juga bisa', emoji: '🚀', color: '#a855f7', mockPercentage: 58 },
    optionB: { text: 'Tolak — lebih baik jujur daripada gagal di tengah jalan', emoji: '🛑', color: '#ef4444', mockPercentage: 42 },
    insight: 'Ini terkait Growth Mindset vs Fixed Mindset. Orang dengan growth mindset melihat tantangan sebagai peluang belajar, bukan ancaman.'
  },
  {
    id: 'dilemma-13',
    question: 'Temanmu curhat soal masalahnya. Kamu akan...',
    optionA: { text: 'Langsung kasih solusi dan saran praktis', emoji: '💡', color: '#f97316', mockPercentage: 37 },
    optionB: { text: 'Dengerin aja dulu, validasi perasaannya', emoji: '🤗', color: '#ec4899', mockPercentage: 63 },
    insight: 'Tipe Thinking cenderung langsung ke solusi (A) — mereka menunjukkan perhatian lewat tindakan. Tipe Feeling lebih ke empati (B) — mereka tahu kadang yang dibutuhkan hanya didengar.'
  },
  {
    id: 'dilemma-14',
    question: 'Kamu bisa hidup di era manapun. Pilih mana?',
    optionA: { text: 'Masa depan 100 tahun lagi — teknologi canggih!', emoji: '🤖', color: '#06b6d4', mockPercentage: 61 },
    optionB: { text: 'Zaman Renaissance — seni, filosofi, dan penemuan!', emoji: '🎨', color: '#a855f7', mockPercentage: 39 },
    insight: 'Tipe Sensing-Thinking cenderung memilih masa depan (A) karena tertarik pada kemajuan. Tipe Intuitive-Feeling cenderung ke Renaissance (B) karena menghargai ekspresi dan makna.'
  }
];

// ==============================
// 2. SWIPE CARDS (20 kartu)
// ==============================
export const SWIPE_CARDS = [
  { id: 'sc-1', emoji: '📚', title: 'Membaca buku di kafe sendirian', type: 'introvert' },
  { id: 'sc-2', emoji: '🎤', title: 'Karaoke heboh bareng teman-teman', type: 'extrovert' },
  { id: 'sc-3', emoji: '📅', title: 'Membuat jadwal detail untuk liburan', type: 'judging' },
  { id: 'sc-4', emoji: '🎒', title: 'Pergi liburan dadakan tanpa rencana', type: 'perceiving' },
  { id: 'sc-5', emoji: '🧩', title: 'Membahas teori konspirasi / hal filosofis', type: 'intuitive' },
  { id: 'sc-6', emoji: '🛠️', title: 'Membongkar dan memperbaiki barang rusak', type: 'sensing' },
  { id: 'sc-7', emoji: '💖', title: 'Menjadi pendengar curhat yang baik', type: 'feeling' },
  { id: 'sc-8', emoji: '⚖️', title: 'Memberi solusi logis saat teman curhat', type: 'thinking' },
  { id: 'sc-9', emoji: '🎭', title: 'Menonton film sendirian di bioskop', type: 'introvert' },
  { id: 'sc-10', emoji: '🥳', title: 'Jadi MC di acara ulang tahun teman', type: 'extrovert' },
  { id: 'sc-11', emoji: '📝', title: 'Bikin to-do list sebelum mulai hari', type: 'judging' },
  { id: 'sc-12', emoji: '🎲', title: 'Ambil keputusan berdasarkan feeling saat itu', type: 'perceiving' },
  { id: 'sc-13', emoji: '🔮', title: 'Membayangkan hidup 10 tahun ke depan', type: 'intuitive' },
  { id: 'sc-14', emoji: '🍳', title: 'Masak resep yang sudah sering dibuat dan selalu berhasil', type: 'sensing' },
  { id: 'sc-15', emoji: '🥺', title: 'Ikut sedih saat teman cerita masalahnya', type: 'feeling' },
  { id: 'sc-16', emoji: '📊', title: 'Menganalisis data sebelum mengambil keputusan', type: 'thinking' },
  { id: 'sc-17', emoji: '🌌', title: 'Menikmati kesunyian malam hari', type: 'introvert' },
  { id: 'sc-18', emoji: '💬', title: 'Diskusi seru di grup chat sampai malam', type: 'extrovert' },
  { id: 'sc-19', emoji: '🎯', title: 'Selalu tepat waktu di setiap janji', type: 'judging' },
  { id: 'sc-20', emoji: '🌊', title: 'Hidup mengalir aja, nanti juga beres', type: 'perceiving' }
];

// ================================
// 3. SWIPE VIBE ARCHETYPES (8 hasil)
// ================================
export const VIBE_ARCHETYPES = {
  'peaceful-dreamer': {
    title: 'The Peaceful Dreamer',
    emoji: '🌊',
    desc: 'Kamu lagi di vibe tenang dan penuh imajinasi. Dunia dalam pikiranmu lebih menarik dari yang di luar.',
    traits: ['introvert', 'intuitive', 'feeling'],
    tip: 'Ambil waktu untuk journaling atau menggambar hari ini.'
  },
  'bold-strategist': {
    title: 'The Bold Strategist',
    emoji: '⚡',
    desc: 'Energi kamu lagi tinggi dan otak lagi encer! Hari yang pas untuk bikin rencana besar.',
    traits: ['extrovert', 'thinking', 'judging'],
    tip: 'Manfaatkan momentum ini untuk mengeksekusi ide yang sudah lama tertunda.'
  },
  'creative-rebel': {
    title: 'The Creative Rebel',
    emoji: '🎭',
    desc: 'Kamu lagi nggak mau diatur dan pengen ekspresif. Ide-ide liar lagi berterbangan di kepalamu.',
    traits: ['introvert', 'intuitive', 'perceiving'],
    tip: 'Eksplorasi sesuatu yang baru — tulis puisi, coba resep baru, atau gambar sesuatu.'
  },
  'social-butterfly': {
    title: 'The Social Butterfly',
    emoji: '✨',
    desc: 'Vibe kamu lagi ceria, hangat, dan pengen ketemu banyak orang! Sebarkan energi positifmu.',
    traits: ['extrovert', 'feeling', 'perceiving'],
    tip: 'Hubungi teman lama atau ajak seseorang ngopi bareng.'
  },
  'meticulous-architect': {
    title: 'The Meticulous Architect',
    emoji: '📐',
    desc: 'Otak kamu lagi rapi banget. Hari yang sempurna untuk mengorganisir hidup dan bikin sistem.',
    traits: ['introvert', 'thinking', 'judging'],
    tip: 'Rapikan meja kerja, bikin spreadsheet, atau susun rencana mingguan.'
  },
  'adventurous-spirit': {
    title: 'The Adventurous Spirit',
    emoji: '🏄',
    desc: 'Jiwa petualangmu lagi menyala! Kamu pengen pengalaman baru dan sensasi seru.',
    traits: ['extrovert', 'sensing', 'perceiving'],
    tip: 'Coba tempat makan baru, olahraga outdoor, atau road trip spontan.'
  },
  'empathetic-anchor': {
    title: 'The Empathetic Anchor',
    emoji: '🤗',
    desc: 'Kamu lagi jadi tempat curhat terbaik. Hati kamu terbuka lebar untuk memahami orang lain.',
    traits: ['extrovert', 'feeling', 'judging'],
    tip: 'Cek kabar teman-temanmu — mungkin ada yang butuh pendengar hari ini.'
  },
  'observer': {
    title: 'The Cool Observer',
    emoji: '🧊',
    desc: 'Kamu lagi di mode chill dan mengamati dari pinggir. Kadang memang butuh jadi penonton.',
    traits: [],
    tip: 'Nikmati hari tanpa tekanan — nonton series, makan enak, atau rebahan.'
  }
};

// ==============================
// 4. WOULD YOU RATHER (12 soal)
// ==============================
export const WOULD_YOU_RATHER = [
  {
    id: 'wyr-1',
    question: 'Mending mana?',
    optionA: { text: 'Selalu kedinginan sepanjang hidup', emoji: '🥶' },
    optionB: { text: 'Selalu kepanasan sepanjang hidup', emoji: '🥵' },
    funFact: 'Riset menunjukkan orang yang tinggal di negara dingin cenderung lebih produktif, tapi orang di negara tropis lebih bahagia secara emosional!'
  },
  {
    id: 'wyr-2',
    question: 'Mending mana?',
    optionA: { text: 'Bisa terbang tapi cuma 1 meter di atas tanah', emoji: '🦅' },
    optionB: { text: 'Bisa bernapas di bawah air tapi cuma 5 menit', emoji: '🐠' },
    funFact: 'Menurut survei, 72% orang memilih terbang! Keinginan terbang berkaitan dengan kebutuhan kebebasan menurut psikologi humanistik Maslow.'
  },
  {
    id: 'wyr-3',
    question: 'Mending mana?',
    optionA: { text: 'Hidup tanpa musik selamanya', emoji: '🔇' },
    optionB: { text: 'Hidup tanpa film dan series selamanya', emoji: '📺' },
    funFact: 'Musik mengaktifkan reward center di otak (dopamine release) lebih cepat dibanding visual media. Itu sebabnya kebanyakan orang memilih mempertahankan musik!'
  },
  {
    id: 'wyr-4',
    question: 'Mending mana?',
    optionA: { text: 'Selalu tahu kapan seseorang berbohong', emoji: '🤥' },
    optionB: { text: 'Selalu tahu apa yang sedang dipikirkan orang tentangmu', emoji: '💭' },
    funFact: 'Menurut studi psikologi, orang rata-rata mendeteksi kebohongan hanya 54% akurat — hampir sama seperti menebak koin!'
  },
  {
    id: 'wyr-5',
    question: 'Mending mana?',
    optionA: { text: 'Makan makanan yang sama setiap hari tapi gratis', emoji: '🍕' },
    optionB: { text: 'Makan apapun yang kamu mau tapi harus bayar 2x lipat', emoji: '🍽️' },
    funFact: 'Fenomena \"choice overload\" menunjukkan terlalu banyak pilihan justru membuat kita kurang puas dengan keputusan kita!'
  },
  {
    id: 'wyr-6',
    question: 'Mending mana?',
    optionA: { text: 'Bisa bicara semua bahasa di dunia', emoji: '🗣️' },
    optionB: { text: 'Bisa bermain semua alat musik di dunia', emoji: '🎸' },
    funFact: 'Ada 7.000+ bahasa di dunia, tapi hanya sekitar 200 yang punya lebih dari 1 juta penutur. Sementara alat musik ada 1.500+ jenis!'
  },
  {
    id: 'wyr-7',
    question: 'Mending mana?',
    optionA: { text: 'Punya ingatan sempurna (tidak pernah lupa apapun)', emoji: '🧠' },
    optionB: { text: 'Bisa melupakan kenangan buruk sesuka hati', emoji: '🧹' },
    funFact: 'Hyperthymesia (ingatan sempurna) benar-benar ada! Tapi penderitanya sering mengalami stres karena tidak bisa melupakan hal menyakitkan.'
  },
  {
    id: 'wyr-8',
    question: 'Mending mana?',
    optionA: { text: 'Jadi sangat terkenal tapi selalu diawasi publik', emoji: '📸' },
    optionB: { text: 'Jadi kaya raya tapi tidak ada yang tahu', emoji: '💎' },
    funFact: 'Paradox of Fame: 80% selebriti melaporkan bahwa ketenaran membawa lebih banyak stres dibanding kebahagiaan.'
  },
  {
    id: 'wyr-9',
    question: 'Mending mana?',
    optionA: { text: 'Selalu stuck di macet 2 jam sehari', emoji: '🚗' },
    optionB: { text: 'Selalu harus bangun jam 4 pagi setiap hari', emoji: '⏰' },
    funFact: 'Studi di UK menunjukkan commuting lebih dari 1 jam menurunkan wellbeing setara dengan pengurangan gaji 40%!'
  },
  {
    id: 'wyr-10',
    question: 'Mending mana?',
    optionA: { text: 'Tidak bisa pakai smartphone selama setahun', emoji: '📱' },
    optionB: { text: 'Tidak bisa makan makanan favorit selama setahun', emoji: '🚫' },
    funFact: 'Nomophobia (takut tanpa HP) mempengaruhi 66% populasi global. Rata-rata orang mengecek HP-nya 96x sehari!'
  },
  {
    id: 'wyr-11',
    question: 'Mending mana?',
    optionA: { text: 'Hidup di dunia Harry Potter', emoji: '🧙' },
    optionB: { text: 'Hidup di dunia Marvel', emoji: '🦸' },
    funFact: 'Preferensi dunia fiksi sering mencerminkan kebutuhan psikologis: Harry Potter = belonging & identity, Marvel = power & justice.'
  },
  {
    id: 'wyr-12',
    question: 'Mending mana?',
    optionA: { text: 'Tahu tanggal kematianmu sendiri', emoji: '📆' },
    optionB: { text: 'Tahu cara kematianmu tapi bukan kapan', emoji: '❓' },
    funFact: 'Studi di psikologi eksistensial menunjukkan bahwa awareness of mortality justru bisa meningkatkan meaningfulness dalam hidup (Terror Management Theory).'
  }
];

// ==============================
// 5. TEBAK KEPRIBADIAN (6 skenario)
// ==============================
export const GUESS_SCENARIOS = [
  {
    id: 'gs-1',
    title: 'Si Misterius di Kelas',
    descriptions: [
      'Selalu duduk di pojok belakang dan menulis di jurnal kecil',
      'Kalau ditanya pendapat, jawabannya dalam dan filosofis',
      'Sering melamun tapi nilai ujiannya bagus-bagus'
    ],
    correctAnswer: 'INFP',
    options: ['INFP', 'ESTJ', 'ESTP', 'ISTJ'],
    explanation: 'INFP dikenal sebagai \"The Mediator\" — introvert yang idealis, kreatif, dan sering tenggelam dalam dunia batin mereka. Jurnal dan lamunan adalah ciri khas mereka!'
  },
  {
    id: 'gs-2',
    title: 'Sang Ketua OSIS',
    descriptions: [
      'Selalu punya rencana dan timeline untuk setiap proyek',
      'Tidak ragu menegur teman yang tidak disiplin',
      'Sering ambil keputusan cepat dan tegas di rapat'
    ],
    correctAnswer: 'ENTJ',
    options: ['INFP', 'ENTJ', 'ISFP', 'ENFP'],
    explanation: 'ENTJ adalah \"The Commander\" — pemimpin alami yang tegas, efisien, dan berorientasi pada hasil. Mereka memimpin dengan logika dan visi yang jelas.'
  },
  {
    id: 'gs-3',
    title: 'Si Petualang Spontan',
    descriptions: [
      'Tiba-tiba mengajak road trip tanpa rencana di hari Jumat malam',
      'Selalu jadi yang paling seru dan energik di grup',
      'Kalau ada masalah, langsung cari solusi praktis di tempat'
    ],
    correctAnswer: 'ESTP',
    options: ['INTJ', 'INFJ', 'ESTP', 'ISFJ'],
    explanation: 'ESTP adalah \"The Entrepreneur\" — spontan, energik, dan hidup di momen sekarang. Mereka action-oriented dan pandai membaca situasi.'
  },
  {
    id: 'gs-4',
    title: 'Si Pendengar Setia',
    descriptions: [
      'Semua orang curhat ke dia karena merasa dimengerti',
      'Sering mengalah demi menjaga keharmonisan kelompok',
      'Ingat detail kecil tentang teman-temannya (ulang tahun, makanan favorit)'
    ],
    correctAnswer: 'ISFJ',
    options: ['ENTP', 'ISFJ', 'INTJ', 'ESTP'],
    explanation: 'ISFJ adalah \"The Defender\" — setia, perhatian, dan penuh kasih. Mereka mengingat detail tentang orang lain karena benar-benar peduli.'
  },
  {
    id: 'gs-5',
    title: 'Si Debater Handal',
    descriptions: [
      'Senang sekali berdebat tentang topik apapun, kadang hanya untuk seru-seruan',
      'Punya 10 ide bisnis di kepalanya tapi belum eksekusi satupun',
      'Sering challenge opini orang lain dengan pertanyaan \"Tapi gimana kalau...?\"'
    ],
    correctAnswer: 'ENTP',
    options: ['ISFJ', 'ISTJ', 'ENTP', 'INFJ'],
    explanation: 'ENTP adalah \"The Debater\" — cerdas, kreatif, dan senang mengeksplorasi ide. Mereka berdebat bukan untuk menang, tapi untuk menemukan kebenaran.'
  },
  {
    id: 'gs-6',
    title: 'Si Perfeksionis Diam-Diam',
    descriptions: [
      'Menghabiskan waktu berjam-jam menyempurnakan presentasi yang orang lain anggap sudah bagus',
      'Punya visi besar tentang masa depan dan rencana detail untuk mencapainya',
      'Jarang bicara di grup, tapi kalau bicara, semua orang diam dan mendengarkan'
    ],
    correctAnswer: 'INTJ',
    options: ['ESFP', 'INTJ', 'ENFP', 'ISFP'],
    explanation: 'INTJ adalah \"The Architect\" — strategis, perfeksionis, dan visioner. Mereka berbicara hanya ketika punya sesuatu yang benar-benar bermakna untuk disampaikan.'
  }
];
