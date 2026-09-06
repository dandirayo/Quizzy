export const QUIZ_CATALOG = {
  // ==========================================
  // 1. MBTI QUIZ (16 Tipe Kepribadian)
  // ==========================================
  mbti: {
    type: 'mbti',
    title: 'Tes Kepribadian MBTI',
    shortTitle: 'Tes MBTI',
    emoji: '🦉',
    colors: ['#7c3aed', '#ec4899'],
    subtitle: 'Temukan salah satu dari 16 tipe kepribadian Myers-Briggs dan kenali kekuatan serta gaya komunikasimu.',
    note: 'Jawablah sejujur mungkin berdasarkan dirimu saat ini, bukan apa yang kamu anggap "ideal". Tidak ada tipe kepribadian yang lebih baik dari yang lain.',
    dimensions: {
      EI: { name: 'Energi (E / I)', preview: 'Extrovert vs Introvert', color: '#3b82f6' },
      SN: { name: 'Informasi (S / N)', preview: 'Sensing vs Intuition', color: '#22c55e' },
      TF: { name: 'Keputusan (T / F)', preview: 'Thinking vs Feeling', color: '#ef4444' },
      JP: { name: 'Gaya Hidup (J / P)', preview: 'Judging vs Perceiving', color: '#eab308' }
    },
    questions: [
      // E/I
      { dimension: 'EI', dir: 'A', text: 'Saya merasa berenergi setelah menghabiskan waktu di keramaian atau pesta.' },
      { dimension: 'EI', dir: 'B', text: 'Saya lebih suka menghabiskan akhir pekan sendirian atau dengan sedikit orang dekat.' },
      { dimension: 'EI', dir: 'A', text: 'Saya mudah memulai percakapan dengan orang yang baru dikenal.' },
      { dimension: 'EI', dir: 'B', text: 'Saya butuh waktu sendiri untuk memulihkan energi setelah bersosialisasi.' },
      { dimension: 'EI', dir: 'A', text: 'Saya cenderung berpikir sambil berbicara, bukan memikirkannya dulu.' },
      { dimension: 'EI', dir: 'A', text: 'Saya senang menjadi pusat perhatian dalam suatu kelompok.' },
      { dimension: 'EI', dir: 'B', text: 'Saya lebih suka mendengarkan daripada berbicara dalam diskusi kelompok.' },
      // S/N
      { dimension: 'SN', dir: 'A', text: 'Saya lebih percaya pada fakta dan pengalaman konkret daripada teori abstrak.' },
      { dimension: 'SN', dir: 'B', text: 'Saya sering memikirkan kemungkinan dan makna tersembunyi di balik sesuatu.' },
      { dimension: 'SN', dir: 'A', text: 'Saya lebih suka instruksi yang jelas dan langkah demi langkah.' },
      { dimension: 'SN', dir: 'B', text: 'Saya lebih tertarik pada ide-ide baru daripada detail praktis.' },
      { dimension: 'SN', dir: 'A', text: 'Saya fokus pada apa yang nyata dan terjadi saat ini.' },
      { dimension: 'SN', dir: 'B', text: 'Saya suka berimajinasi tentang masa depan dan kemungkinan yang belum terjadi.' },
      { dimension: 'SN', dir: 'A', text: 'Saya lebih percaya pengalaman langsung daripada intuisi atau firasat.' },
      // T/F
      { dimension: 'TF', dir: 'A', text: 'Saya membuat keputusan berdasarkan logika, bukan perasaan.' },
      { dimension: 'TF', dir: 'B', text: 'Perasaan orang lain sangat memengaruhi keputusan yang saya ambil.' },
      { dimension: 'TF', dir: 'A', text: 'Saya lebih menghargai kejujuran yang blak-blakan daripada basa-basi yang menyenangkan.' },
      { dimension: 'TF', dir: 'B', text: 'Saya lebih mengutamakan harmoni dibanding memenangkan sebuah argumen.' },
      { dimension: 'TF', dir: 'A', text: 'Saya menganalisis situasi secara objektif sebelum bertindak.' },
      { dimension: 'TF', dir: 'B', text: 'Saya mudah berempati dan ikut merasakan emosi orang lain.' },
      { dimension: 'TF', dir: 'A', text: 'Kritik terhadap pekerjaan saya lebih saya lihat sebagai fakta, bukan serangan pribadi.' },
      // J/P
      { dimension: 'JP', dir: 'A', text: 'Saya suka membuat rencana matang sebelum melakukan sesuatu.' },
      { dimension: 'JP', dir: 'B', text: 'Saya lebih suka bersikap fleksibel dan spontan daripada terikat jadwal.' },
      { dimension: 'JP', dir: 'A', text: 'Saya merasa tidak nyaman jika pekerjaan belum selesai sebelum tenggat waktu.' },
      { dimension: 'JP', dir: 'B', text: 'Saya sering menunda keputusan untuk tetap membuka banyak pilihan.' },
      { dimension: 'JP', dir: 'A', text: 'Ruang kerja dan hidup saya cenderung terorganisir dan rapi.' },
      { dimension: 'JP', dir: 'B', text: 'Saya menikmati mengerjakan sesuatu secara mendadak tanpa rencana detail.' },
      { dimension: 'JP', dir: 'A', text: 'Saya lebih suka menyelesaikan satu tugas sepenuhnya sebelum pindah ke tugas lain.' }
    ],
    profiles: {
      INTJ: { name: 'The Architect', emoji: '🏛️', title: 'INTJ — The Architect', tagline: 'Perencana strategis dengan visi jauh ke depan', insight: 'Kamu pemikir mandiri dan strategis yang menyukai sistem, logika, dan efisiensi jangka panjang.', tip: 'Latihlah kesabaran saat orang lain butuh waktu lebih lama untuk memahami ide-idemu.' },
      INTP: { name: 'The Logician', emoji: '🔬', title: 'INTP — The Logician', tagline: 'Penjelajah ide dengan rasa ingin tahu tanpa batas', insight: 'Kamu inovatif dan haus pengetahuan mendalam, suka membongkar pola dan mengeksplorasi teori.', tip: 'Imbangi eksplorasi ide dengan eksekusi nyata pada langkah pertama.' },
      ENTJ: { name: 'The Commander', emoji: '👑', title: 'ENTJ — The Commander', tagline: 'Pemimpin tegas yang berani mengambil keputusan', insight: 'Kamu pemimpin alami yang tegas, strategis, dan berorientasi pada pencapaian target nyata.', tip: 'Beri ruang bagi perasaan rekan kerja untuk membangun loyalitas yang tulus.' },
      ENTP: { name: 'The Debater', emoji: '💡', title: 'ENTP — The Debater', tagline: 'Pemikir cerdas yang mencintai perdebatan ide', insight: 'Kamu kreatif, cepat beradaptasi, dan senang melihat sudut pandang yang tidak biasa.', tip: 'Pilihlah 1-2 ide prioritas dan selesaikan hingga tuntas sebelum meloncat ke hal baru.' },
      INFJ: { name: 'The Advocate', emoji: '🦉', title: 'INFJ — The Advocate', tagline: 'Idealis tenang dengan wawasan mendalam tentang manusia', insight: 'Kamu memiliki empati mendalam yang dipadukan dengan prinsip kuat untuk membawa kebaikan.', tip: 'Jangan lupa menjaga batasan diri agar tidak mengalami kelelahan emosional (burnout).' },
      INFP: { name: 'The Mediator', emoji: '🌸', title: 'INFP — The Mediator', tagline: 'Jiwa puitis yang setia pada nilai-nilai pribadinya', insight: 'Kamu tulus, kreatif, dan digerakkan oleh kompas moral pribadi yang sangat mendalam.', tip: 'Ubah ide-ide idealismu menjadi rutinitas kecil yang bisa dikerjakan setiap hari.' },
      ENFJ: { name: 'The Protagonist', emoji: '🌟', title: 'ENFJ — The Protagonist', tagline: 'Pemimpin karismatik yang menginspirasi orang lain', insight: 'Kamu hangat dan peka membaca dinamika kelompok, mampu memotivasi orang menuju visi bersama.', tip: 'Ingat bahwa kamu tidak bertanggung jawab menyelesaikan masalah semua orang.' },
      ENFP: { name: 'The Campaigner', emoji: '✨', title: 'ENFP — The Campaigner', tagline: 'Jiwa bebas yang antusias dan penuh imajinasi', insight: 'Kamu penuh energi, melihat banyak kemungkinan, dan mampu menyalakan semangat orang sekitar.', tip: 'Gunakan sistem pencatatan sederhana agar ide brilianmu tidak tercecer.' },
      ISTJ: { name: 'The Logistician', emoji: '📋', title: 'ISTJ — The Logistician', tagline: 'Praktis dan bertanggung jawab, dapat diandalkan', insight: 'Kamu teliti, setia pada janji, dan bekerja sistematis demi hasil yang stabil dan rapi.', tip: 'Buka ruang untuk eksperimen cara baru meskipun cara lama masih berjalan.' },
      ISFJ: { name: 'The Defender', emoji: '🛡️', title: 'ISFJ — The Defender', tagline: 'Pelindung setia yang hangat dan penuh perhatian', insight: 'Kamu penuh dedikasi merawat harmoni dan kebutuhan orang-orang tercinta di belakang layar.', tip: 'Belajarlah mengatakan "tidak" dengan sopan untuk melindungi energimu sendiri.' },
      ESTJ: { name: 'The Executive', emoji: '📊', title: 'ESTJ — The Executive', tagline: 'Pengatur ulung yang menjunjung tinggi ketertiban', insight: 'Kamu terorganisir, praktis, dan handal mengarahkan orang dan proyek ke garis akhir.', tip: 'Dengarkan masukan alternatif sebelum memutuskan jalan keluar secara mutlak.' },
      ESFJ: { name: 'The Consul', emoji: '🤝', title: 'ESFJ — The Consul', tagline: 'Penggerak sosial yang peduli dan penuh perhatian', insight: 'Kamu perekat komunitas yang ramah, selalu siap membantu, dan merawat hubungan akrab.', tip: 'Nilai dirimu tidak ditentukan hanya oleh persetujuan atau pujian orang lain.' },
      ISTP: { name: 'The Virtuoso', emoji: '🔧', title: 'ISTP — The Virtuoso', tagline: 'Pengrajin praktis yang ahli memecahkan masalah', insight: 'Kamu tenang, logis, dan tanggap menyelesaikan masalah teknis atau krisis secara langsung.', tip: 'Sampaikan alasan logismu saat kamu memutuskan untuk mengambil jarak sejenak.' },
      ISFP: { name: 'The Adventurer', emoji: '🎨', title: 'ISFP — The Adventurer', tagline: 'Seniman fleksibel yang menikmati keindahan hidup', insight: 'Kamu lembut, memiliki rasa estetika kuat, dan menikmati momen nyata dengan penuh penghayatan.', tip: 'Komunikasikan kebutuhan pribadimu secara terbuka alih-alih memendamnya.' },
      ESTP: { name: 'The Entrepreneur', emoji: '⚡', title: 'ESTP — The Entrepreneur', tagline: 'Pribadi enerjik yang berani mengambil risiko', insight: 'Kamu spontan, berani bertindak di lapangan, dan lincah memanfaatkan peluang yang ada.', tip: 'Pertimbangkan konsekuensi jangka panjang sebelum melompat ke tantangan baru.' },
      ESFP: { name: 'The Entertainer', emoji: '🎉', title: 'ESFP — The Entertainer', tagline: 'Penghibur spontan yang mencintai kehidupan', insight: 'Kamu ceria, bersemangat, dan membawa keceriaan ke setiap ruangan yang kamu masuki.', tip: 'Sisihkan waktu khusus untuk mengevaluasi komitmen dan rencana masa depanmu.' }
    },
    sources: [
      { label: 'Myers, I. B. & McCaulley, M. H. — Manual: A Guide to the Development and Use of MBTI' },
      { label: 'The Myers & Briggs Foundation', url: 'https://www.myersbriggs.org' },
      { label: 'Quiz reflektif edukatif; bukan pengganti penilaian psikologis klinis resmi.' }
    ]
  },

  // ==========================================
  // 2. ATTACHMENT STYLE QUIZ
  // ==========================================
  attachment: {
    type: 'attachment',
    title: 'Tes Attachment Style',
    shortTitle: 'Tes Attachment',
    emoji: '💗',
    colors: ['#ec4899', '#f43f5e'],
    subtitle: 'Kenali gaya kelekatan emosionalmu dalam hubungan asmara dan pertemanan dekat.',
    note: 'Attachment style menggambarkan pola rasa aman dan kecemasanmu dalam hubungan intim. Ini adalah spektrum yang bisa bertumbuh seiring waktu.',
    dimensions: {
      ANX: { name: 'Anxiety', preview: 'Kecemasan akan ditinggalkan / butuh validasi', color: '#ec4899' },
      AVO: { name: 'Avoidance', preview: 'Kemandirian berlebih / menjaga jarak emosional', color: '#8b5cf6' }
    },
    questions: [
      // Anxiety (12)
      { dimension: 'ANX', dir: 'A', text: 'Saya khawatir pasangan/orang dekat saya tidak benar-benar mencintai saya.' },
      { dimension: 'ANX', dir: 'A', text: 'Saya sering butuh kepastian berulang kali bahwa saya dicintai.' },
      { dimension: 'ANX', dir: 'A', text: 'Saya cemas saat pasangan/sahabat lama tidak membalas pesan saya.' },
      { dimension: 'ANX', dir: 'B', text: 'Saya merasa tenang meski hubungan sedang tidak "sempurna".' },
      { dimension: 'ANX', dir: 'A', text: 'Saya takut orang yang saya sayangi akan meninggalkan saya.' },
      { dimension: 'ANX', dir: 'A', text: 'Saya sering memikirkan hubungan saya secara berlebihan.' },
      { dimension: 'ANX', dir: 'B', text: 'Saya percaya diri bahwa saya layak dicintai apa adanya.' },
      { dimension: 'ANX', dir: 'A', text: 'Saya mudah cemburu atau merasa terancam oleh kedekatan pasangan dengan orang lain.' },
      { dimension: 'ANX', dir: 'A', text: 'Saya butuh validasi terus-menerus dari orang terdekat untuk merasa aman.' },
      { dimension: 'ANX', dir: 'B', text: 'Saya tidak mudah panik walau hubungan sedang renggang sementara.' },
      { dimension: 'ANX', dir: 'A', text: 'Saya sering merasa lebih dekat dengan pasangan dibanding sebaliknya.' },
      { dimension: 'ANX', dir: 'A', text: 'Konflik kecil dalam hubungan membuat saya sangat cemas akan berakhirnya hubungan itu.' },
      // Avoidance (12)
      { dimension: 'AVO', dir: 'A', text: 'Saya merasa tidak nyaman ketika orang lain terlalu dekat secara emosional.' },
      { dimension: 'AVO', dir: 'A', text: 'Saya lebih suka menyelesaikan masalah sendiri daripada bergantung pada orang lain.' },
      { dimension: 'AVO', dir: 'B', text: 'Saya nyaman berbagi perasaan terdalam dengan orang yang saya percaya.' },
      { dimension: 'AVO', dir: 'A', text: 'Saya cenderung menjaga jarak emosional meski dalam hubungan dekat.' },
      { dimension: 'AVO', dir: 'A', text: 'Saya sulit mempercayai orang lain sepenuhnya.' },
      { dimension: 'AVO', dir: 'B', text: 'Saya merasa nyaman bergantung pada pasangan/sahabat saat butuh dukungan.' },
      { dimension: 'AVO', dir: 'A', text: 'Saya lebih memilih kemandirian daripada keintiman yang terlalu dalam.' },
      { dimension: 'AVO', dir: 'A', text: 'Saya cenderung menutup diri ketika orang lain mencoba mendekat secara emosional.' },
      { dimension: 'AVO', dir: 'B', text: 'Saya mudah mengungkapkan kasih sayang secara terbuka.' },
      { dimension: 'AVO', dir: 'A', text: 'Saya merasa "terkekang" ketika hubungan menjadi terlalu intens.' },
      { dimension: 'AVO', dir: 'B', text: 'Saya percaya bahwa bergantung pada orang lain adalah hal yang wajar dan sehat.' },
      { dimension: 'AVO', dir: 'A', text: 'Saya lebih fokus pada pencapaian pribadi daripada membangun kedekatan emosional.' }
    ],
    profiles: {
      secure: {
        name: 'Secure Attachment',
        emoji: '💗',
        title: 'Secure Attachment',
        tagline: 'Nyaman dengan kedekatan maupun kemandirian',
        insight: 'Kamu cenderung merasa aman dalam hubungan — nyaman dekat dengan orang lain sekaligus nyaman menjadi diri sendiri tanpa kecemasan berlebih.',
        tip: 'Pertahankan komunikasi terbuka dan tetaplah jadi ruang aman bagi pasangan atau temanmu.'
      },
      anxious: {
        name: 'Anxious-Preoccupied',
        emoji: '🌊',
        title: 'Anxious-Preoccupied',
        tagline: 'Sangat menghargai kedekatan, tapi sering diliputi kecemasan',
        insight: 'Kamu menginginkan kedekatan yang kuat namun rentan overthinking atau khawatir tidak cukup dihargai.',
        tip: 'Latih self-soothing (menenangkan diri sendiri) sebelum mencari validasi eksternal saat gelisah.'
      },
      avoidant: {
        name: 'Dismissive-Avoidant',
        emoji: '🛶',
        title: 'Dismissive-Avoidant',
        tagline: 'Menghargai kemandirian, cenderung menjaga jarak emosional',
        insight: 'Kamu sangat mandiri dan cenderung menarik diri ketika hubungan terasa menuntut keintiman emosional.',
        tip: 'Buka ruang kerentanan sedikit demi sedikit kepada orang yang terpercaya; kedekatan tidak menghilangkan kemandirianmu.'
      },
      fearful: {
        name: 'Fearful-Avoidant',
        emoji: '🌪️',
        title: 'Fearful-Avoidant',
        tagline: 'Menginginkan kedekatan, tapi juga takut akan disakiti',
        insight: 'Kamu mengalami dinamika tarik-ulur — mendambakan keintiman namun takut akan penolakan atau luka emosional.',
        tip: 'Akui ketakutanmu tanpa menghakimi diri; pelan-pelan bangun rasa aman melalui konsistensi dan komunikasi jujur.'
      }
    },
    sources: [
      { label: 'Bowlby, J. — Attachment and Loss' },
      { label: 'Ainsworth, M. D. S. — Patterns of Attachment' },
      { label: 'Levine & Heller — Attached: The New Science of Adult Attachment' }
    ]
  },

  // ==========================================
  // 3. BIG FIVE PERSONALITY QUIZ
  // ==========================================
  bigfive: {
    title: 'Tes Kepribadian Big Five (OCEAN)',
    shortTitle: 'Big Five OCEAN',
    emoji: '🧭',
    colors: ['#7c3aed', '#06b6d4'],
    subtitle: 'Ukur lima dimensi kepribadian universal yang paling banyak diakui dalam psikologi modern.',
    note: 'Skor menunjukkan kecenderungan alaminya pada spektrum lima faktor kepribadian. Tidak ada skor yang benar atau salah.',
    dimensions: {
      O: { name: 'Openness', preview: 'Kreatif, imajinatif, rasa ingin tahu', color: '#7c3aed' },
      C: { name: 'Conscientiousness', preview: 'Disiplin, terencana, teliti', color: '#22c55e' },
      E: { name: 'Extraversion', preview: 'Ekspresif, sosial, aktif', color: '#f97316' },
      A: { name: 'Agreeableness', preview: 'Empatik, hangat, kooperatif', color: '#ec4899' },
      N: { name: 'Neuroticism', preview: 'Sensitivitas terhadap tekanan / emosi', color: '#06b6d4' }
    },
    questions: [
      { dimension: 'O', reverse: false, text: 'Saya senang mencoba ide, aktivitas, atau pengalaman baru.' },
      { dimension: 'O', reverse: false, text: 'Saya sering tertarik pada seni, desain, musik, cerita, atau hal kreatif lainnya.' },
      { dimension: 'O', reverse: false, text: 'Saya suka memikirkan kemungkinan yang belum pernah dicoba sebelumnya.' },
      { dimension: 'O', reverse: true, text: 'Saya lebih nyaman jika segala sesuatu berjalan dengan cara yang sudah biasa.' },
      { dimension: 'O', reverse: false, text: 'Saya mudah penasaran dengan topik yang tidak familiar.' },

      { dimension: 'C', reverse: false, text: 'Saya terbiasa menyelesaikan tugas yang sudah saya mulai.' },
      { dimension: 'C', reverse: false, text: 'Saya suka membuat rencana sebelum mengerjakan sesuatu yang penting.' },
      { dimension: 'C', reverse: false, text: 'Saya merasa bertanggung jawab untuk menepati janji dan tenggat waktu.' },
      { dimension: 'C', reverse: true, text: 'Saya sering menunda hal penting sampai mendekati batas waktu.' },
      { dimension: 'C', reverse: false, text: 'Saya cukup teratur dalam mengelola pekerjaan, barang, atau jadwal.' },

      { dimension: 'E', reverse: false, text: 'Saya merasa berenergi setelah bertemu atau mengobrol dengan banyak orang.' },
      { dimension: 'E', reverse: false, text: 'Saya mudah memulai percakapan dengan orang baru.' },
      { dimension: 'E', reverse: false, text: 'Saya senang terlibat dalam aktivitas kelompok.' },
      { dimension: 'E', reverse: true, text: 'Saya lebih sering menyimpan pikiran saya untuk diri sendiri.' },
      { dimension: 'E', reverse: false, text: 'Saya cenderung ekspresif saat menunjukkan antusiasme.' },

      { dimension: 'A', reverse: false, text: 'Saya mudah berempati ketika orang lain sedang kesulitan.' },
      { dimension: 'A', reverse: false, text: 'Saya berusaha menjaga hubungan tetap hangat dan saling menghargai.' },
      { dimension: 'A', reverse: false, text: 'Saya cukup percaya bahwa kebanyakan orang punya niat baik.' },
      { dimension: 'A', reverse: true, text: 'Saya mudah curiga terhadap motif orang lain.' },
      { dimension: 'A', reverse: false, text: 'Saya lebih suka bekerja sama daripada bersaing secara keras.' },

      { dimension: 'N', reverse: false, text: 'Saya mudah merasa cemas ketika menghadapi ketidakpastian.' },
      { dimension: 'N', reverse: false, text: 'Saya sering memikirkan hal buruk yang mungkin terjadi.' },
      { dimension: 'N', reverse: false, text: 'Mood saya cukup mudah berubah karena tekanan kecil.' },
      { dimension: 'N', reverse: true, text: 'Saya biasanya tetap tenang saat situasi menjadi sulit.' },
      { dimension: 'N', reverse: false, text: 'Saya mudah merasa kewalahan ketika banyak masalah datang bersamaan.' }
    ],
    profiles: {
      O: { emoji: '🎨', title: 'Open Explorer', tagline: 'Kreativitas dan rasa ingin tahu tinggi menjadi ciri utamamu.', insight: 'Kamu bersemangat mencoba hal baru dan kaya akan ide orisinal.', tip: 'Salurkan ide-ide barumu ke dalam proyek nyata yang bisa diselesaikan bertahap.' },
      C: { emoji: '🎯', title: 'Disciplined Achiever', tagline: 'Ketelitian dan keandalan menjadi fondasi kesuksesanmu.', insight: 'Kamu bertanggung jawab tinggi, menyukai keteraturan, dan tekun mengejar sasaran.', tip: 'Beri diri ruang untuk fleksibel saat rencana perlu beradaptasi.' },
      E: { emoji: '⚡', title: 'Vibrant Energizer', tagline: 'Interaksi dan aksi nyata adalah sumber energimu.', insight: 'Kamu ramah, ekspresif, dan menikmati keterlibatan dalam kegiatan bersama banyak orang.', tip: 'Sisihkan waktu jeda sejenak untuk refleksi mendalam di sela aktivitas sosial.' },
      A: { emoji: '🕊️', title: 'Empathetic Harmonizer', tagline: 'Kehangatan dan kebaikan hati membuat orang nyaman di dekatmu.', insight: 'Kamu mengutamakan kerja sama, memiliki empati tulus, dan merawat harmoni.', tip: 'Pastikan kebutuhan pribadimu tetap terpenuhi saat kamu merawat orang lain.' },
      N: { emoji: '🌊', title: 'Sensitive Sensor', tagline: 'Kepekaan mendalam terhadap emosi dan perubahan lingkungan.', insight: 'Kamu sangat peka terhadap nuansa situasi dan memiliki kesadaran risiko yang tinggi.', tip: 'Praktikkan latihan pernapasan dan grounding saat pikiran mulai terasa penuh.' }
    },
    sources: [
      { label: 'Goldberg, L. R. (1992) — The development of markers for the Big-Five factor structure' },
      { label: 'International Personality Item Pool (IPIP)', url: 'https://ipip.ori.org/' },
      { label: 'John & Srivastava — The Big Five Trait Taxonomy' }
    ]
  },

  // ==========================================
  // 4. MARRIAGE READINESS QUIZ
  // ==========================================
  marriage: {
    title: 'Cek Kesiapan Menikah',
    shortTitle: 'Kesiapan Menikah',
    emoji: '💍',
    colors: ['#0d9488', '#14b8a6'],
    subtitle: 'Refleksikan kesiapanmu dari aspek komitmen, emosi, komunikasi, finansial, peran, dan nilai hidup.',
    note: 'Hasil ini merupakan alat refleksi bersama pasangan, bukan vonis mutlak. Gunakan skor terendah sebagai bahan diskusi yang sehat.',
    dimensions: {
      Komitmen: { name: 'Komitmen', preview: 'Tekad jangka panjang & kesetiaan', color: '#0d9488' },
      Komunikasi: { name: 'Komunikasi', preview: 'Bicara jujur tanpa menyakiti', color: '#3b82f6' },
      Emosi: { name: 'Emosi', preview: 'Regulasi emosi & penerimaan', color: '#ec4899' },
      Finansial: { name: 'Finansial', preview: 'Rencana & transparansi uang', color: '#eab308' },
      Peran: { name: 'Peran', preview: 'Pembagian tugas rumah tangga', color: '#8b5cf6' },
      Nilai: { name: 'Nilai Hidup', preview: 'Keselarasan prinsip & masa depan', color: '#22c55e' }
    },
    questions: [
      { dimension: 'Komitmen', text: 'Saya memahami alasan utama saya ingin menikah.' },
      { dimension: 'Komitmen', text: 'Saya siap menjalani komitmen jangka panjang dengan pasangan dalam suka dan duka.' },
      { dimension: 'Komunikasi', text: 'Saya dan pasangan bisa membicarakan masalah tanpa saling menyakiti atau menghina.' },
      { dimension: 'Emosi', text: 'Saya mampu mengelola emosi dan tidak melampiaskan amarah saat terjadi konflik.' },
      { dimension: 'Finansial', text: 'Saya dan pasangan sudah membicarakan rencana dan keterbukaan keuangan setelah menikah.' },
      { dimension: 'Peran', text: 'Saya siap berbagi tanggung jawab rumah tangga secara adil dan realistis.' },
      { dimension: 'Emosi', text: 'Saya menerima bahwa pasangan memiliki kekurangan yang tidak selalu bisa diubah.' },
      { dimension: 'Nilai', text: 'Saya dan pasangan memiliki nilai hidup, prinsip, dan visi keluarga yang cukup sejalan.' },
      { dimension: 'Komitmen', text: 'Saya tidak memutuskan menikah hanya karena tekanan umur, keluarga, atau lingkungan.' },
      { dimension: 'Komitmen', text: 'Saya siap terus belajar dan bertumbuh bersama pasangan setelah menikah.' }
    ],
    profiles: {
      Komitmen: { emoji: '💍', title: 'Fondasi Komitmen Kuat', tagline: 'Kesiapan komitmenmu menjadi modal utama perjalanan rumah tangga.', insight: 'Kamu memiliki tekad kuat dan kesadaran bahwa pernikahan adalah perjalanan bertumbuh bersama.', tip: 'Terus diskusikan ekspektasi jangka panjang bersama pasangan secara terbuka.' },
      Komunikasi: { emoji: '🗣️', title: 'Komunikator Sehat', tagline: 'Kemampuan dialog jujurmu akan menjadi pelindung saat krisis.', insight: 'Kamu mampu menyampaikan kebutuhan tanpa merusak kehangatan hubungan.', tip: 'Latihlah teknik active listening saat pasangan sedang menyampaikan keluh kesah.' },
      Emosi: { emoji: '🌿', title: 'Kematangan Emosi', tagline: 'Regulasi emosi yang stabil menciptakan ketenangan di rumah.', insight: 'Kamu mampu menahan impuls saat tegang dan bersikap dewasa menyikapi ketidaksempurnaan.', tip: 'Jaga kebiasaan refleksi diri dan jeda sehat saat situasi memanas.' },
      Finansial: { emoji: '💰', title: 'Kesadaran Finansial', tagline: 'Keterbukaan rencana finansial memperkokoh masa depan bersama.', insight: 'Kamu realistis memahami peran stabilitas dan kesepakatan finansial dalam pernikahan.', tip: 'Sepakati pos anggaran dan dana darurat bersama sebelum melangkah.' },
      Peran: { emoji: '🤝', title: 'Kemitraan Setara', tagline: 'Kesiapan berbagi peran mewujudkan rumah tangga yang harmonis.', insight: 'Kamu memandang pernikahan sebagai tim yang saling melengkapi.', tip: 'Buat kesepakatan fleksibel tentang pembagian tugas harian.' },
      Nilai: { emoji: '🧭', title: 'Penyelarasan Nilai', tagline: 'Prinsip hidup yang sejalan menjadi kompas penunjuk arah.', insight: 'Kamu dan pasangan memiliki fondasi moral dan visi yang saling menguatkan.', tip: 'Perkuat kebiasaan berdiskusi tentang nilai-nilai penting bagi keluarga masa depanmu.' }
    },
    sources: [
      { label: 'Krisnatuti & Oktaviani — Kesiapan Menikah pada Dewasa Muda, Jurnal IKK IPB' },
      { label: 'PREPARE/ENRICH Premarital Assessment', url: 'https://www.prepare-enrich.com/' },
      { label: 'Gottman & Silver — The Seven Principles for Making Marriage Work' }
    ]
  },

  // ==========================================
  // 5. RIASEC CAREER INTERESTS
  // ==========================================
  riasec: {
    title: 'Tes Minat Karier RIASEC',
    shortTitle: 'Tes Karier',
    emoji: '🧩',
    colors: ['#3b82f6', '#06b6d4'],
    subtitle: 'Temukan tiga lingkungan kerja yang paling sesuai dengan minatmu melalui enam tema karier Holland.',
    note: 'Hasil menunjukkan kecenderungan minat, bukan menentukan satu profesi wajib. Gunakan tiga skor teratas sebagai bahan mengeksplorasi jurusan, peran, dan lingkungan kerja.',
    dimensions: {
      R: { name: 'Realistic', preview: 'Praktis dan teknis', color: '#f97316' },
      I: { name: 'Investigative', preview: 'Analitis dan penasaran', color: '#3b82f6' },
      A: { name: 'Artistic', preview: 'Kreatif dan ekspresif', color: '#a855f7' },
      S: { name: 'Social', preview: 'Membantu dan mengajar', color: '#ec4899' },
      E: { name: 'Enterprising', preview: 'Memimpin dan meyakinkan', color: '#eab308' },
      C: { name: 'Conventional', preview: 'Rapi dan sistematis', color: '#22c55e' }
    },
    questions: [
      { dimension: 'R', text: 'Saya menikmati pekerjaan yang melibatkan alat, mesin, atau kegiatan langsung.' },
      { dimension: 'R', text: 'Saya senang memperbaiki benda atau mencari cara praktis agar sesuatu berfungsi.' },
      { dimension: 'R', text: 'Saya lebih tertarik melihat hasil nyata daripada membahas konsep terlalu lama.' },
      { dimension: 'I', text: 'Saya menikmati proses menyelidiki penyebab suatu masalah.' },
      { dimension: 'I', text: 'Saya suka membaca data, menemukan pola, atau menguji sebuah dugaan.' },
      { dimension: 'I', text: 'Pertanyaan sulit membuat saya penasaran untuk mencari jawabannya.' },
      { dimension: 'A', text: 'Saya menikmati kegiatan yang memberi ruang untuk imajinasi dan ekspresi pribadi.' },
      { dimension: 'A', text: 'Saya tertarik membuat tulisan, visual, musik, konsep, atau pengalaman baru.' },
      { dimension: 'A', text: 'Saya lebih bersemangat saat tugas tidak memiliki hanya satu jawaban benar.' },
      { dimension: 'S', text: 'Saya merasa puas ketika dapat membantu orang berkembang atau memahami sesuatu.' },
      { dimension: 'S', text: 'Saya nyaman mendengarkan masalah dan memberi dukungan.' },
      { dimension: 'S', text: 'Saya tertarik pada pekerjaan yang berdampak langsung bagi orang lain.' },
      { dimension: 'E', text: 'Saya menikmati kesempatan memimpin, bernegosiasi, atau memengaruhi keputusan.' },
      { dimension: 'E', text: 'Saya bersemangat mengejar target dan menggerakkan orang menuju hasil.' },
      { dimension: 'E', text: 'Saya cukup nyaman mengambil risiko yang diperhitungkan untuk sebuah peluang.' },
      { dimension: 'C', text: 'Saya menyukai sistem, prosedur, dan informasi yang tertata jelas.' },
      { dimension: 'C', text: 'Saya teliti saat menangani jadwal, dokumen, angka, atau detail administratif.' },
      { dimension: 'C', text: 'Saya merasa nyaman jika tugas memiliki aturan dan standar keberhasilan yang jelas.' }
    ],
    profiles: {
      R: { emoji: '🛠️', title: 'Practical Builder', tagline: 'Kamu berkembang lewat tindakan, alat, dan hasil yang dapat dilihat.', insight: 'Kamu cenderung menikmati tantangan konkret dan solusi yang langsung bisa diuji.', tip: 'Eksplorasi bidang teknik, operasional, produksi, lapangan, atau pekerjaan berbasis keterampilan.' },
      I: { emoji: '🔬', title: 'Curious Investigator', tagline: 'Rasa ingin tahu dan analisis menjadi bahan bakar utamamu.', insight: 'Kamu menikmati pertanyaan rumit, data, dan proses memahami cara sesuatu bekerja.', tip: 'Coba proyek riset, data, teknologi, kesehatan, atau strategi yang menuntut analisis mendalam.' },
      A: { emoji: '🎨', title: 'Creative Explorer', tagline: 'Kamu membutuhkan ruang untuk mencipta dan mengekspresikan gagasan.', insight: 'Kebebasan bereksperimen dan menghasilkan sesuatu yang orisinal terasa penting bagimu.', tip: 'Bangun portofolio kecil di desain, konten, seni, tulisan, produk, atau bidang kreatif lain.' },
      S: { emoji: '🤲', title: 'People Supporter', tagline: 'Kamu menemukan makna lewat pertumbuhan dan kesejahteraan orang lain.', insight: 'Interaksi yang hangat dan kesempatan membantu membuat pekerjaan terasa bernilai.', tip: 'Eksplorasi pendidikan, konseling, layanan, komunitas, kesehatan, atau pengembangan manusia.' },
      E: { emoji: '📣', title: 'Bold Initiator', tagline: 'Kamu terdorong oleh peluang, pengaruh, dan hasil yang menantang.', insight: 'Kamu cenderung nyaman mengambil inisiatif dan membawa orang menuju tujuan.', tip: 'Coba penjualan, bisnis, kepemimpinan, pemasaran, negosiasi, atau pengelolaan proyek.' },
      C: { emoji: '📊', title: 'System Organizer', tagline: 'Keteraturan dan ketelitian membantumu menghasilkan kerja yang konsisten.', insight: 'Kamu menikmati struktur yang jelas, data yang rapi, dan proses yang dapat diandalkan.', tip: 'Eksplorasi keuangan, administrasi, quality assurance, analisis operasi, atau manajemen data.' }
    },
    sources: [
      { label: 'O*NET Interest Profiler — U.S. Department of Labor', url: 'https://www.onetcenter.org/IP.html' },
      { label: 'Holland, J. L. — Making Vocational Choices' }
    ]
  },

  // ==========================================
  // 6. GROWTH MINDSET
  // ==========================================
  growth: {
    title: 'Quiz Growth Mindset',
    shortTitle: 'Growth Mindset',
    emoji: '🌱',
    colors: ['#f59e0b', '#22c55e'],
    subtitle: 'Lihat bagaimana kamu merespons tantangan, masukan, kesalahan, dan proses belajar.',
    note: 'Growth mindset bukan tuntutan untuk selalu positif. Hasil ini membantu melihat pola belajar yang bisa dilatih.',
    dimensions: {
      CH: { name: 'Menyambut Tantangan', preview: 'Berani mencoba', color: '#f59e0b' },
      FB: { name: 'Terbuka pada Masukan', preview: 'Belajar dari feedback', color: '#3b82f6' },
      ER: { name: 'Belajar dari Kesalahan', preview: 'Pulih dan mengevaluasi', color: '#ec4899' },
      PR: { name: 'Percaya pada Proses', preview: 'Tekun bertumbuh', color: '#22c55e' }
    },
    questions: [
      { dimension: 'CH', text: 'Saya bersedia mencoba tugas baru meskipun belum yakin akan berhasil.' },
      { dimension: 'CH', text: 'Tantangan membuat saya ingin mencari strategi baru.' },
      { dimension: 'CH', reverse: true, text: 'Saya cenderung menghindari kegiatan yang bisa memperlihatkan kekurangan saya.' },
      { dimension: 'CH', text: 'Saya dapat memulai dari level pemula tanpa merasa malu.' },
      { dimension: 'FB', text: 'Saya bisa memisahkan kritik terhadap hasil kerja dari nilai diri saya.' },
      { dimension: 'FB', text: 'Masukan yang spesifik membantu saya melihat hal yang sebelumnya terlewat.' },
      { dimension: 'FB', reverse: true, text: 'Saya langsung defensif ketika cara kerja saya dikoreksi.' },
      { dimension: 'FB', text: 'Saya bersedia bertanya agar bisa memperbaiki hasil.' },
      { dimension: 'ER', text: 'Setelah gagal, saya mencoba memahami bagian mana yang perlu diubah.' },
      { dimension: 'ER', text: 'Kesalahan dapat memberi informasi berguna untuk percobaan berikutnya.' },
      { dimension: 'ER', reverse: true, text: 'Satu kegagalan mudah membuat saya merasa tidak berbakat.' },
      { dimension: 'ER', text: 'Saya dapat kembali mencoba setelah memberi diri waktu untuk pulih.' },
      { dimension: 'PR', text: 'Saya percaya kemampuan dapat meningkat melalui latihan yang tepat.' },
      { dimension: 'PR', text: 'Saya menghargai kemajuan kecil yang konsisten.' },
      { dimension: 'PR', reverse: true, text: 'Kalau tidak cepat mahir, saya menganggap bidang itu bukan untuk saya.' },
      { dimension: 'PR', text: 'Saya mau mengganti cara belajar ketika pendekatan lama tidak efektif.' }
    ],
    profiles: {
      CH: { emoji: '🧗', title: 'Brave Beginner', tagline: 'Kamu bertumbuh saat berani masuk ke wilayah yang belum dikuasai.', insight: 'Kesediaan mencoba membantumu mengumpulkan pengalaman nyata yang berharga.', tip: 'Pilih satu tantangan kecil dengan tingkat kesulitan sedikit di atas kemampuanmu saat ini.' },
      FB: { emoji: '🪞', title: 'Open Learner', tagline: 'Masukan menjadi cermin untuk memperbaiki arah belajarmu.', insight: 'Kamu mampu melihat feedback sebagai informasi berguna, bukan serangan personal.', tip: 'Saat meminta masukan, tanyakan satu hal spesifik yang paling perlu ditingkatkan.' },
      ER: { emoji: '🔄', title: 'Reflective Rebuilder', tagline: 'Kamu mampu mengubah kesalahan menjadi bahan untuk percobaan berikutnya.', insight: 'Kekuatanmu ada pada evaluasi dan kemampuan kembali bangkit setelah kendala.', tip: 'Setelah kendala, catat: apa yang berhasil, apa yang tidak, dan satu perbaikan konkret.' },
      PR: { emoji: '🌳', title: 'Patient Grower', tagline: 'Kamu percaya perubahan besar dibangun melalui proses yang konsisten.', insight: 'Kesabaran dan kemauan terus melatih strategi mendukung perkembangan jangka panjangmu.', tip: 'Ukur progres dari rutinitas yang bisa diulang, bukan semata hasil instan.' }
    },
    sources: [
      { label: 'Dweck, C. S. — Mindset: The New Psychology of Success' }
    ]
  },

  // ==========================================
  // 7. REGULASI EMOSI
  // ==========================================
  emotion: {
    title: 'Quiz Regulasi Emosi',
    shortTitle: 'Regulasi Emosi',
    emoji: '🌤️',
    colors: ['#f97316', '#ec4899'],
    subtitle: 'Kenali cara kamu menyadari, menenangkan, mengekspresikan, dan memulihkan diri dari emosi yang kuat.',
    note: 'Ini adalah alat refleksi kesejahteraan emosi, bukan diagnosis kondisi psikologis.',
    dimensions: {
      AW: { name: 'Kesadaran Emosi', preview: 'Mengenali perasaan', color: '#f97316' },
      SO: { name: 'Menenangkan Diri', preview: 'Mengelola intensitas', color: '#3b82f6' },
      EX: { name: 'Ekspresi Sehat', preview: 'Menyampaikan dengan aman', color: '#ec4899' },
      RC: { name: 'Pemulihan', preview: 'Kembali seimbang', color: '#22c55e' }
    },
    questions: [
      { dimension: 'AW', text: 'Saya dapat memberi nama pada emosi yang sedang saya rasakan.' },
      { dimension: 'AW', text: 'Saya mengenali perubahan tubuh ketika emosi mulai meningkat.' },
      { dimension: 'AW', reverse: true, text: 'Saya sering baru sadar sedang kesal setelah bereaksi.' },
      { dimension: 'AW', text: 'Saya dapat membedakan marah, kecewa, takut, dan lelah.' },
      { dimension: 'SO', text: 'Saya punya cara aman untuk menurunkan intensitas emosi.' },
      { dimension: 'SO', text: 'Saya dapat mengambil jeda sebelum memberi respons saat tersulut.' },
      { dimension: 'SO', reverse: true, text: 'Saat emosi kuat muncul, saya merasa tidak punya pilihan selain mengikutinya.' },
      { dimension: 'SO', text: 'Saya tahu kegiatan apa yang membantu tubuh saya merasa lebih tenang.' },
      { dimension: 'EX', text: 'Saya mampu menyampaikan perasaan tanpa merendahkan diri sendiri atau orang lain.' },
      { dimension: 'EX', text: 'Saya dapat meminta dukungan dengan cukup jelas.' },
      { dimension: 'EX', reverse: true, text: 'Saya biasanya memendam semuanya sampai akhirnya meledak atau menarik diri.' },
      { dimension: 'EX', text: 'Saya bisa mengatakan bahwa saya butuh waktu sebelum melanjutkan percakapan.' },
      { dimension: 'RC', text: 'Setelah situasi emosional, saya dapat kembali ke rutinitas secara bertahap.' },
      { dimension: 'RC', text: 'Saya memberi diri waktu untuk pulih tanpa terus menyalahkan diri.' },
      { dimension: 'RC', reverse: true, text: 'Peristiwa kecil yang tidak menyenangkan merusak seluruh hari saya.' },
      { dimension: 'RC', text: 'Saya bisa mengambil pelajaran tanpa terus mengulang kejadian di kepala.' }
    ],
    profiles: {
      AW: { emoji: '🔎', title: 'Emotion Observer', tagline: 'Kekuatanmu ada pada kemampuan membaca apa yang terjadi di dalam diri.', insight: 'Kesadaran yang baik memberi jeda antara emosi dan tindakan terburu-buru.', tip: 'Gunakan kalimat: "Saya merasa..., karena..., dan saat ini saya butuh...".' },
      SO: { emoji: '🫧', title: 'Steady Soother', tagline: 'Kamu punya kemampuan menurunkan gelombang emosi sebelum bertindak.', insight: 'Kamu dapat menciptakan ruang aman di saat tekanan emosional memuncak.', tip: 'Pertahankan 1-2 teknik pernapasan atau jeda 5 menit saat situasi tegang.' },
      EX: { emoji: '🗣️', title: 'Clear Expresser', tagline: 'Kamu mampu mengubah emosi menjadi komunikasi yang dapat dipahami.', insight: 'Ekspresi yang sehat mencegah konflik membesar dan memperjelas kebutuhanmu.', tip: 'Sampaikan fakta dan perasaan tanpa menuduh niat lawan bicara.' },
      RC: { emoji: '🌅', title: 'Gentle Recoverer', tagline: 'Kamu mampu kembali seimbang setelah melewati momen emosional berat.', insight: 'Pemulihanmu didukung oleh penerimaan diri dan kemampuan kembali melangkah.', tip: 'Buat ritual transisi singkat seperti berjalan santai atau mencuci muka setelah hari melelahkan.' }
    },
    sources: [
      { label: 'Gross, J. J. (1998) — The Emerging Field of Emotion Regulation Research' }
    ]
  },

  // ==========================================
  // 8. SOCIAL BATTERY
  // ==========================================
  social: {
    title: 'Quiz Social Battery',
    shortTitle: 'Social Battery',
    emoji: '🔋',
    colors: ['#06b6d4', '#8b5cf6'],
    subtitle: 'Temukan situasi sosial yang mengisi energimu, yang mengurasnya, dan cara pulih yang paling pas.',
    note: 'Energi sosial bersifat dinamis dan dapat berubah sesuai situasi dan rasa aman.',
    dimensions: {
      SM: { name: 'Kelompok Kecil', preview: 'Hangat dan mendalam', color: '#06b6d4' },
      CR: { name: 'Keramaian', preview: 'Ramai dan dinamis', color: '#f97316' },
      ON: { name: 'Waktu Sendiri', preview: 'Pulih lewat ruang pribadi', color: '#8b5cf6' },
      NT: { name: 'Koneksi Baru', preview: 'Energik bertemu orang', color: '#ec4899' }
    },
    questions: [
      { dimension: 'SM', text: 'Percakapan mendalam dengan satu atau dua orang terasa mengisi energi saya.' },
      { dimension: 'SM', text: 'Saya lebih mudah menjadi diri sendiri dalam kelompok kecil.' },
      { dimension: 'SM', text: 'Saya menikmati pertemuan tenang yang memberi ruang semua orang berbicara.' },
      { dimension: 'CR', text: 'Suasana ramai sering membuat saya lebih bersemangat.' },
      { dimension: 'CR', text: 'Saya menikmati acara yang melibatkan banyak orang dan aktivitas.' },
      { dimension: 'CR', reverse: true, text: 'Keramaian hampir selalu membuat saya ingin segera pulang.' },
      { dimension: 'ON', text: 'Waktu sendirian membantu saya kembali jernih setelah banyak interaksi.' },
      { dimension: 'ON', text: 'Saya membutuhkan jeda tanpa percakapan agar energi saya pulih.' },
      { dimension: 'ON', reverse: true, text: 'Saya merasa makin lelah jika harus menghabiskan waktu sendirian.' },
      { dimension: 'NT', text: 'Bertemu orang baru biasanya membuat saya penasaran dan antusias.' },
      { dimension: 'NT', text: 'Saya cukup nyaman membuka percakapan di lingkungan baru.' },
      { dimension: 'NT', reverse: true, text: 'Saya menghindari perkenalan baru meskipun situasinya terasa aman.' }
    ],
    profiles: {
      SM: { emoji: '☕', title: 'Cozy Connector', tagline: 'Koneksi kecil yang hangat adalah sumber energi sosial terbesarmu.', insight: 'Kualitas percakapan lebih berarti bagimu daripada jumlah orang di ruangan.', tip: 'Pilihlah pertemuan intim dengan teman dekat untuk mengisi kembali bateraimu.' },
      CR: { emoji: '🎊', title: 'Crowd Charger', tagline: 'Dinamika banyak orang sering membangkitkan semangatmu.', insight: 'Kamu mendapat dorongan positif dari suasana ramai dan kolaborasi ramai.', tip: 'Beri jeda istirahat singkat agar energimu tidak drop tiba-tiba.' },
      ON: { emoji: '🌙', title: 'Quiet Recharger', tagline: 'Ruang pribadi membantumu memproses hari dan memulihkan energi.', insight: 'Kesendirian yang disengaja adalah fondasi keseimbangan mentalmu.', tip: 'Jadwalkan waktu sunyi tanpa notifikasi setelah melewati acara sosial panjang.' },
      NT: { emoji: '👋', title: 'Curious Mingler', tagline: 'Orang dan lingkungan baru menyalakan rasa ingin tahumu.', insight: 'Kamu antusias menjajaki koneksi baru dan memperluas jaringan pertemanan.', tip: 'Gunakan kemampuanmu untuk menghubungkan teman-teman yang belum saling kenal.' }
    },
    sources: [
      { label: 'Cain, S. — Quiet: The Power of Introverts' }
    ]
  },

  // ==========================================
  // 9. POLA PROKRASTINASI
  // ==========================================
  procrastination: {
    title: 'Quiz Pola Prokrastinasi',
    shortTitle: 'Pola Prokrastinasi',
    emoji: '⏳',
    colors: ['#22c55e', '#3b82f6'],
    subtitle: 'Cari tahu pemicu utama penundaanmu dan langkah kecil yang paling realistis untuk mulai bergerak.',
    note: 'Menunda tugas sering kali dipicu oleh rasa cemas, tugas tidak jelas, atau energi rendah, bukan semata rasa malas.',
    dimensions: {
      PF: { name: 'Takut Tidak Sempurna', preview: 'Tertekan oleh standar', color: '#ec4899' },
      CL: { name: 'Tugas Tidak Jelas', preview: 'Sulit menentukan awal', color: '#3b82f6' },
      EN: { name: 'Energi Rendah', preview: 'Kapasitas sedang turun', color: '#f97316' },
      DS: { name: 'Mudah Terdistraksi', preview: 'Perhatian cepat berpindah', color: '#22c55e' }
    },
    questions: [
      { dimension: 'PF', text: 'Saya menunda karena khawatir hasilnya tidak cukup bagus.' },
      { dimension: 'PF', text: 'Saya sulit memulai jika belum menemukan cara terbaik.' },
      { dimension: 'PF', text: 'Standar tinggi membuat tugas terasa lebih berat daripada seharusnya.' },
      { dimension: 'PF', reverse: true, text: 'Saya nyaman membuat draf buruk sebagai langkah pertama.' },
      { dimension: 'CL', text: 'Saya menunda ketika tidak tahu langkah pertama yang harus dilakukan.' },
      { dimension: 'CL', text: 'Tugas besar terasa kabur sampai saya memecahnya menjadi bagian kecil.' },
      { dimension: 'CL', text: 'Saya kehilangan waktu karena terus menentukan prioritas.' },
      { dimension: 'CL', reverse: true, text: 'Saya mudah mengubah tugas besar menjadi tindakan berikutnya yang jelas.' },
      { dimension: 'EN', text: 'Saya sering menunda karena tubuh atau pikiran sudah kelelahan.' },
      { dimension: 'EN', text: 'Tugas sederhana terasa berat ketika jadwal saya terlalu padat.' },
      { dimension: 'EN', text: 'Saya memaksakan bekerja pada waktu ketika energi saya biasanya rendah.' },
      { dimension: 'EN', reverse: true, text: 'Saya cukup baik menyesuaikan jenis tugas dengan tingkat energi.' },
      { dimension: 'DS', text: 'Notifikasi atau aplikasi lain mudah mengalihkan saya dari tugas.' },
      { dimension: 'DS', text: 'Saya membuka banyak hal baru sebelum menyelesaikan yang sedang dikerjakan.' },
      { dimension: 'DS', text: 'Lingkungan yang ramai membuat saya sulit bertahan pada satu pekerjaan.' },
      { dimension: 'DS', reverse: true, text: 'Saya dapat melindungi waktu fokus dari gangguan yang bisa dicegah.' }
    ],
    profiles: {
      PF: { emoji: '📝', title: 'Perfectionist Delayer', tagline: 'Keinginan menghasilkan yang terbaik membuat langkah pertama terasa berat.', insight: 'Tekanan standar tinggi sering memicu penundaan.', tip: 'Tulis draf kasar 5 menit yang sengaja belum sempurna untuk memulai momentum.' },
      CL: { emoji: '🧭', title: 'Foggy Starter', tagline: 'Kamu bergerak lebih mudah saat tugas dipecah menjadi tindakan mikro.', insight: 'Ketidakjelasan rincian tugas adalah penghambat terbesarmu.', tip: 'Tulis satu tindakan fisik konkret: "buka dokumen dan tulis 3 poin utama".' },
      EN: { emoji: '🪫', title: 'Energy-Limited Planner', tagline: 'Penundaan sering menjadi sinyal bahwa energimu sedang menipis.', insight: 'Beban fisik dan mental perlu diseimbangkan dengan istirahat yang berkualitas.', tip: 'Kerjakan tugas paling menantang pada jam dengan energi terbaikmu.' },
      DS: { emoji: '📵', title: 'Distracted Jumper', tagline: 'Perhatianmu mudah terpikat oleh hal-hal yang memberi rangsangan instan.', insight: 'Lingkungan fokus akan jauh lebih membantu daripada mengandalkan niat semata.', tip: 'Gunakan teknik Pomodoro 20 menit dan jauhkan ponsel dari pandangan.' }
    },
    sources: [
      { label: 'Steel, P. (2007) — The Nature of Procrastination' }
    ]
  },

  // ==========================================
  // 10. MONEY PERSONALITY
  // ==========================================
  money: {
    title: 'Quiz Money Personality',
    shortTitle: 'Money Personality',
    emoji: '💰',
    colors: ['#eab308', '#f97316'],
    subtitle: 'Kenali kecenderunganmu saat membelanjakan, menyimpan, merencanakan, dan menikmati uang.',
    note: 'Hasil menggambarkan kebiasaan psikologis dalam mengelola uang, bukan nasihat investasi profesional.',
    dimensions: {
      SV: { name: 'Penjaga Dana', preview: 'Aman lewat simpanan', color: '#22c55e' },
      SP: { name: 'Penikmat Momen', preview: 'Uang untuk pengalaman', color: '#f97316' },
      PL: { name: 'Perencana', preview: 'Suka tujuan dan anggaran', color: '#3b82f6' },
      GV: { name: 'Pemberi', preview: 'Senang berbagi', color: '#ec4899' }
    },
    questions: [
      { dimension: 'SV', text: 'Saya merasa lebih tenang ketika memiliki dana cadangan.' },
      { dimension: 'SV', text: 'Saya cenderung mempertimbangkan kebutuhan masa depan sebelum membeli.' },
      { dimension: 'SV', reverse: true, text: 'Saya jarang memikirkan sisa uang setelah melakukan pembelian.' },
      { dimension: 'SV', text: 'Menabung memberi saya rasa aman.' },
      { dimension: 'SP', text: 'Saya senang memakai uang untuk pengalaman yang membuat hidup lebih berwarna.' },
      { dimension: 'SP', text: 'Saya cukup spontan membeli sesuatu yang terasa menyenangkan.' },
      { dimension: 'SP', text: 'Saya melihat uang sebagai alat untuk menikmati hidup saat ini.' },
      { dimension: 'SP', reverse: true, text: 'Saya hampir selalu menolak pengeluaran yang hanya bertujuan memberi kesenangan.' },
      { dimension: 'PL', text: 'Saya suka menentukan tujuan keuangan yang jelas.' },
      { dimension: 'PL', text: 'Saya ingin tahu ke mana uang saya pergi setiap bulan.' },
      { dimension: 'PL', text: 'Anggaran membantu saya mengambil keputusan dengan lebih tenang.' },
      { dimension: 'PL', reverse: true, text: 'Saya merasa pencatatan uang tidak banyak berguna.' },
      { dimension: 'GV', text: 'Saya senang menggunakan uang untuk membantu atau membahagiakan orang lain.' },
      { dimension: 'GV', text: 'Memberi hadiah terasa lebih memuaskan daripada membeli sesuatu untuk diri sendiri.' },
      { dimension: 'GV', text: 'Saya mudah menawarkan bantuan finansial kepada orang yang saya sayangi.' },
      { dimension: 'GV', reverse: true, text: 'Saya hampir tidak pernah memasukkan kegiatan berbagi dalam rencana pengeluaran.' }
    ],
    profiles: {
      SV: { emoji: '🏦', title: 'Safety Saver', tagline: 'Rasa aman dan tabungan masa depan adalah nilai utamamu.', insight: 'Kamu teliti dan berhati-hati memastikan cadangan finansialmu terlindungi.', tip: 'Sediakan pos kecil untuk menikmati hidup agar tidak timbul rasa bersalah saat rekreasi.' },
      SP: { emoji: '🎟️', title: 'Experience Spender', tagline: 'Uang adalah sarana merayakan hidup dan menciptakan kenangan.', insight: 'Kamu tidak ragu mengeluarkan dana untuk pengalaman yang membahagiakan.', tip: 'Tetapkan batas maksimal pengeluaran spontan bulanan agar masa depan tetap aman.' },
      PL: { emoji: '📒', title: 'Purposeful Planner', tagline: 'Tujuan terukur dan anggaran membuat pengelolaan uangmu tertib.', insight: 'Kamu tenang bila arus kas tercatat dan pos pengeluaran terencana jelas.', tip: 'Gunakan kategori anggaran sederhana agar pencatatan tidak terasa merepotkan.' },
      GV: { emoji: '🎁', title: 'Generous Giver', tagline: 'Berbagi dengan sesama memberi makna tertinggi pada uangmu.', insight: 'Kamu menemukan kebahagiaan saat rezeki yang kamu miliki bisa menolong orang lain.', tip: 'Pastikan kebutuhan pokok dan dana daruratmu tercukupi sebelum memberi dalam jumlah besar.' }
    },
    sources: [
      { label: 'Klontz et al. — Money Beliefs and Financial Behaviors' }
    ]
  },

  // ==========================================
  // 11. ROLE DI GRUP CHAT
  // ==========================================
  groupchat: {
    title: 'Quiz Role di Grup Chat',
    shortTitle: 'Role Grup Chat',
    emoji: '💬',
    colors: ['#f43f5e', '#8b5cf6'],
    subtitle: 'Kalau grup chat adalah sebuah tim, peran apa yang paling sering kamu mainkan?',
    note: 'Quiz hiburan santai untuk seru-seruan bersama teman-teman.',
    dimensions: {
      ST: { name: 'Pemantik Obrolan', preview: 'Selalu punya topik', color: '#f43f5e' },
      MM: { name: 'Pemasok Meme', preview: 'Menjaga suasana', color: '#f97316' },
      SR: { name: 'Pembaca Senyap', preview: 'Hadir tanpa ramai', color: '#8b5cf6' },
      MD: { name: 'Penengah Grup', preview: 'Merawat harmoni', color: '#06b6d4' }
    },
    questions: [
      { dimension: 'ST', text: 'Saya sering menjadi orang pertama yang memulai obrolan di grup.' },
      { dimension: 'ST', text: 'Kalau grup sepi, saya merasa ingin melempar topik baru.' },
      { dimension: 'ST', text: 'Saya sering mengajak anggota grup membuat rencana bersama.' },
      { dimension: 'MM', text: 'Saya punya stok meme, video, atau stiker untuk hampir setiap situasi.' },
      { dimension: 'MM', text: 'Saya suka mencairkan suasana grup dengan humor.' },
      { dimension: 'MM', text: 'Respons andalan saya sering berupa gambar, GIF, atau emoji.' },
      { dimension: 'SR', text: 'Saya membaca sebagian besar pesan meskipun jarang membalas.' },
      { dimension: 'SR', text: 'Saya baru muncul ketika ada topik yang benar-benar menarik.' },
      { dimension: 'SR', text: 'Saya merasa tetap dekat dengan grup walaupun lebih sering menyimak.' },
      { dimension: 'MD', text: 'Saya biasanya membantu meluruskan salah paham di grup.' },
      { dimension: 'MD', text: 'Saya memperhatikan jika ada anggota yang tertinggal atau tidak diajak.' },
      { dimension: 'MD', text: 'Saat obrolan memanas, saya mencoba menjaga suasana tetap nyaman.' }
    ],
    profiles: {
      ST: { emoji: '📣', title: 'The Conversation Starter', tagline: 'Grup hidup karena kamu selalu punya pintu masuk untuk ngobrol.', insight: 'Energi dan inisiatifmu membuat obrolan grup tetap aktif dan menyenangkan.', tip: 'Ajak anggota yang pendiam sesekali dengan pertanyaan ringan.' },
      MM: { emoji: '😂', title: 'The Meme Supplier', tagline: 'Kamu adalah departemen hiburan resmi di tongkrongan.', insight: 'Humormu mencairkan ketegangan dan menjaga kehangatan grup.', tip: 'Keluarkan meme terbaikmu saat topik grup mulai terasa monoton.' },
      SR: { emoji: '👀', title: 'The Silent Reader', tagline: 'Jarang terlihat, tetapi hampir selalu tahu apa yang sedang terjadi.', insight: 'Kehadiranmu tenang dan selektif, membalas saat memang ada hal penting.', tip: 'Beri reaksi emoji sesekali agar teman-teman tahu kamu tetap menyimak.' },
      MD: { emoji: '🕊️', title: 'The Group Mediator', tagline: 'Kamu menjaga grup tetap nyaman, adil, dan rukun.', insight: 'Kepekaanmu menjaga suasana grup tetap aman dari konflik yang tidak perlu.', tip: 'Ingat bahwa kamu tidak harus selalu menjadi penengah setiap saat.' }
    },
    sources: [
      { label: 'Quiz interaktif santai Quizzy' }
    ]
  }
};

export const QUIZ_CATEGORIES = [
  { id: 'all', label: 'Semua' },
  { id: 'personality', label: 'Kepribadian', quizIds: ['mbti', 'bigfive', 'attachment', 'riasec'] },
  { id: 'relationship', label: 'Asmara & Relasi', quizIds: ['attachment', 'marriage', 'groupchat'] },
  { id: 'career', label: 'Karier & Belajar', quizIds: ['riasec', 'growth', 'procrastination'] },
  { id: 'self', label: 'Pengembangan Diri', quizIds: ['growth', 'procrastination', 'bigfive', 'emotion'] },
  { id: 'emotion', label: 'Emosi & Energi', quizIds: ['emotion', 'attachment', 'social'] },
  { id: 'social', label: 'Sosial & Teman', quizIds: ['social', 'groupchat', 'attachment'] },
  { id: 'finance', label: 'Finansial', quizIds: ['money'] },
  { id: 'fun', label: 'Hiburan', quizIds: ['groupchat', 'mbti'] }
];

export const QUIZ_META = Object.entries(QUIZ_CATALOG).map(([id, quiz]) => ({
  id,
  title: quiz.title,
  shortTitle: quiz.shortTitle,
  emoji: quiz.emoji,
  subtitle: quiz.subtitle,
  colors: quiz.colors,
  questionCount: quiz.questions.length
}));
