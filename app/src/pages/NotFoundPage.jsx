import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <div className={`${styles.card} fade-up`}>
        <div className={styles.emoji}>🧭</div>
        <h1 className={styles.title}>404</h1>
        <h2>Halaman Tidak Ditemukan</h2>
        <p className={styles.message}>
          Sepertinya rute yang kamu cari tersesat dalam labirin kepribadian atau telah dipindahkan.
        </p>
        <div className={styles.actions}>
          <Link to="/dashboard" className="btn btn-primary">
            Kembali ke Dashboard 🏠
          </Link>
          <Link to="/games" className="btn btn-secondary">
            Coba Mini Games 🎮
          </Link>
        </div>
      </div>
    </div>
  );
}
