import { Link } from 'react-router-dom';
import styles from './MiniGamesPage.module.css';

const MINI_GAMES_LIST = [
  {
    id: 'dilemma',
    path: '/games/dilemma',
    emoji: '⚖️',
    title: 'Dilema Harian',
    tag: 'Eksplorasi Moral',
    stat: '14 Skenario Pilihan',
    desc: 'Dihadapkan pada dua situasi sulit yang dilematis. Tentukan sikapmu dan lihat persentase pilihan orang lain di komunitas!',
    gradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(245, 158, 11, 0.25))',
    accentColor: '#f59e0b'
  },
  {
    id: 'swipe',
    path: '/games/swipe',
    emoji: '🃏',
    title: 'Swipe Kartu Karakter',
    tag: 'Tes Vibe & Gaya',
    stat: '20 Kartu Karakter',
    desc: 'Geser ke kanan jika sesuai atau geser ke kiri jika tidak. Temukan arketipe karakter dan vibe kepribadianmu hari ini!',
    gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.25), rgba(139, 92, 246, 0.25))',
    accentColor: '#ec4899'
  },
  {
    id: 'would-you-rather',
    path: '/games/would-you-rather',
    emoji: '🤔',
    title: 'Mending Mana? (Would You Rather)',
    tag: 'Pilihan Seru',
    stat: '12 Pilihan Absurd',
    desc: 'Dua pilihan yang sama-sama menantang dan menggelitik. Pilih yang mana yang lebih kamu sanggupi!',
    gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(34, 197, 94, 0.25))',
    accentColor: '#06b6d4'
  },
  {
    id: 'guess',
    path: '/games/guess',
    emoji: '🔍',
    title: 'Tebak Kepribadian MBTI',
    tag: 'Detektif Psikologi',
    stat: '6 Studi Kasus',
    desc: 'Baca kebiasaan, respon emosional, dan tindakan seseorang dalam skenario nyata, lalu tebak tipe kepribadian MBTI-nya!',
    gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(168, 85, 247, 0.25))',
    accentColor: '#a855f7'
  }
];

export default function MiniGamesPage() {
  return (
    <div className={styles.container}>
      <div className={styles.backRow}>
        <Link to="/dashboard" className={styles.backLink}>
          ← Kembali ke Beranda Kuis
        </Link>
      </div>

      <header className={`${styles.header} fade-up`}>
        <div className={styles.badge}>🎮 Aktivitas Reflektif & Interaktif</div>
        <h1 className={styles.title}>
          Mini Games <span className={styles.gradientText}>Quizzy</span>
        </h1>
        <p className={styles.subtitle}>
          Eksplorasi sisi-sisi dirimu lewat game interaktif yang ringan, reflektif, dan seru untuk dimainkan kapan saja.
        </p>
      </header>

      <div className={styles.gamesGrid}>
        {MINI_GAMES_LIST.map((game, index) => (
          <Link
            to={game.path}
            key={game.id}
            className={`${styles.gameCard} fade-up`}
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div
              className={styles.cardGradient}
              style={{ background: game.gradient }}
            />
            
            <div className={styles.cardTop}>
              <span className={styles.gameEmoji}>{game.emoji}</span>
              <span className={styles.gameTag}>{game.tag}</span>
            </div>

            <div className={styles.cardBody}>
              <h2 className={styles.gameTitle}>{game.title}</h2>
              <p className={styles.gameDesc}>{game.desc}</p>
            </div>

            <div className={styles.cardFooter}>
              <span className={styles.gameStat}>{game.stat}</span>
              <span className={styles.playAction}>
                Mainkan Sekarang &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
