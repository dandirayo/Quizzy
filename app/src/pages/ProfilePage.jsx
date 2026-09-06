import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={`card ${styles.authPrompt} fade-up`}>
          <h2 className={styles.promptTitle}>Kartu Identitas Psikologis</h2>
          <p className={styles.promptDesc}>
            Login untuk melihat profil psikologismu dan riwayat kuis yang telah kamu kerjakan.
          </p>
          <Link to="/login" className="btn btn-primary">Masuk Sekarang</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Kartu Identitas Psikologis</h1>
        <p className={styles.subtitle}>Profil dari {user.username}</p>
      </header>

      <div className={`card ${styles.profileCard} fade-up`}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📇</div>
          <h3>Belum Ada Data</h3>
          <p>Kamu belum menyelesaikan kuis apapun. Ayo mulai perjalanan mengenali dirimu!</p>
          <Link to="/" className="btn btn-primary">Mulai Kuis</Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
