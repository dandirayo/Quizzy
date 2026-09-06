import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './FriendsPage.module.css';

const FriendsPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={`card ${styles.authPrompt} fade-up`}>
          <h2 className={styles.promptTitle}>Teman</h2>
          <p className={styles.promptDesc}>
            Login untuk melihat aktivitas teman-temanmu dan membandingkan hasil kuis.
          </p>
          <Link to="/login" className="btn btn-primary">Masuk Sekarang</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Teman</h1>
        <p className={styles.subtitle}>Cari teman dan bandingkan kepribadian kalian</p>
      </header>

      <div className={styles.searchSection}>
        <input 
          type="text" 
          placeholder="Cari username teman..." 
          className={styles.searchInput}
        />
        <button className="btn btn-primary">Cari</button>
      </div>

      <div className={`card ${styles.contentCard} fade-up`}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🤝</div>
          <h3>Belum Ada Teman</h3>
          <p>Mulai cari teman dengan memasukkan username mereka di atas.</p>
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
