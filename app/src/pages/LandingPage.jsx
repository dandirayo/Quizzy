import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  // If already logged in, skip landing page and go to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`${styles.heroContent} fade-up`}>
          <div className={styles.badge}>✨ Temukan Potensi Aslimu</div>
          <h1 className={styles.title}>
            Bukan Sekadar Kuis,<br />
            Ini <span className={styles.gradientText}>DNA Psikologismu</span>
          </h1>
          <p className={styles.subtitle}>
            Jelajahi berbagai tes kepribadian berstandar psikologi, temukan teman dengan *vibe* yang cocok, dan bangun Kartu Identitas Psikologismu sekarang.
          </p>
          <div className={styles.ctaGroup}>
            <Link to="/register" className={`btn btn-primary ${styles.ctaBtn}`}>
              Mulai Petualangan &rarr;
            </Link>
            <Link to="/login" className={`btn btn-secondary ${styles.ctaBtn}`}>
              Sudah Punya Akun
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={`${styles.sectionTitle} fade-up`}>Kenapa Quizzy?</h2>
        <div className={styles.grid}>
          <div className={`${styles.featureCard} fade-up`} style={{ animationDelay: '0.1s' }}>
            <div className={styles.featureIcon}>🧠</div>
            <h3 className={styles.featureTitle}>10+ Kuis Psikologi</h3>
            <p className={styles.featureDesc}>
              Mulai dari MBTI, Attachment Style, hingga Big Five. Ketahui kelebihan dan area pertumbuhanmu secara detail.
            </p>
          </div>
          
          <div className={`${styles.featureCard} fade-up`} style={{ animationDelay: '0.2s' }}>
            <div className={styles.featureIcon}>🤝</div>
            <h3 className={styles.featureTitle}>Cek Kecocokan</h3>
            <p className={styles.featureDesc}>
              Tambahkan teman dan bandingkan DNA Psikologis kalian. Apakah kalian partner yang serasi atau justru saling melengkapi?
            </p>
          </div>

          <div className={`${styles.featureCard} fade-up`} style={{ animationDelay: '0.3s' }}>
            <div className={styles.featureIcon}>🎮</div>
            <h3 className={styles.featureTitle}>Mini Games Seru</h3>
            <p className={styles.featureDesc}>
              Selesaikan Dilema Harian atau mainkan Swipe Kartu Karakter untuk melihat *vibe* kamu hari ini bersama komunitas.
            </p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Quizzy. Dibuat untuk refleksi diri yang lebih menyenangkan.</p>
      </footer>
    </div>
  );
}
