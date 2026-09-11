export const DAILY_DILEMMAS = [
  {
    id: 'dilemma-1',
    date: 'today',
    question: 'Pilih mana yang lebih baik untuk masa depanmu?',
    optionA: {
      text: 'Gaji besar tapi pekerjaan sangat membuat stres',
      emoji: '💰',
      color: '#f59e0b',
      mockPercentage: 35
    },
    optionB: {
      text: 'Gaji pas-pasan tapi hati tenang dan jam kerja normal',
      emoji: '🧘',
      color: '#3b82f6',
      mockPercentage: 65
    },
    insight: 'Pilihan ini menunjukkan apakah kamu lebih didorong oleh pencapaian eksternal (ambisi) atau kesejahteraan internal (peace of mind). Mayoritas tipe perasa (Feeling) memilih opsi B.'
  },
  {
    id: 'dilemma-2',
    date: 'yesterday',
    question: 'Kalau ada teman yang bau badan, apa yang kamu lakukan?',
    optionA: {
      text: 'Bilang langsung jujur walau mungkin dia tersinggung',
      emoji: '🗣️',
      color: '#ef4444',
      mockPercentage: 42
    },
    optionB: {
      text: 'Diam saja atau ngasih kode halus (kasih parfum)',
      emoji: '🤫',
      color: '#8b5cf6',
      mockPercentage: 58
    },
    insight: 'Ini menguji gaya komunikasimu: Langsung (Direct) vs Menjaga Harmoni (Diplomatic). Tipe Thinker cenderung memilih A, sedangkan Feeler memilih B.'
  }
];

export const SWIPE_CARDS = [
  { id: 'sc-1', emoji: '📚', title: 'Membaca buku di kafe sendirian', type: 'introvert' },
  { id: 'sc-2', emoji: '🎤', title: 'Karaoke heboh bareng teman-teman', type: 'extrovert' },
  { id: 'sc-3', emoji: '📅', title: 'Membuat jadwal detail untuk liburan', type: 'judging' },
  { id: 'sc-4', emoji: '🎒', title: 'Pergi liburan dadakan tanpa rencana', type: 'perceiving' },
  { id: 'sc-5', emoji: '🧩', title: 'Membahas teori konspirasi / hal filosofis', type: 'intuitive' },
  { id: 'sc-6', emoji: '🛠️', title: 'Membongkar dan memperbaiki barang rusak', type: 'sensing' },
  { id: 'sc-7', emoji: '💖', title: 'Menjadi pendengar curhat yang baik', type: 'feeling' },
  { id: 'sc-8', emoji: '⚖️', title: 'Memberi solusi logis saat teman curhat', type: 'thinking' }
];
