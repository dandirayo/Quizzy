import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './LoginPage.module.css';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { register, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await register(email, password, username, displayName || username);
      navigate('/profile');
    } catch (err) {
      setErrorMsg(err.message || 'Pendaftaran gagal. Silakan coba lagi.');
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await loginWithGoogle();
      navigate('/profile');
    } catch (err) {
      setErrorMsg(err.message || 'Login dengan Google gagal.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={`card ${styles.loginCard} fade-up`}>
        <div className={styles.header}>
          <div className={styles.icon}>✨</div>
          <h1 className={styles.title}>Daftar Akun Baru</h1>
          <p className={styles.subtitle}>
            Bikin akun untuk simpan hasil kuis ke Kartu Identitas Psikologis dan add teman-temanmu!
          </p>
        </div>

        {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username (@)</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="contoh: dandirayo"
              required
              className={styles.input}
            />
            <span className={styles.inputHint}>Hanya huruf kecil, angka, dan underscore</span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="displayName">Nama Tampilan</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="contoh: Dandi Rayo"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              minLength={6}
              required
              className={styles.input}
            />
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? 'Mendaftarkan...' : 'Daftar Sekarang 🚀'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>atau</span>
        </div>

        <button type="button" onClick={handleGoogleAuth} className={`btn btn-secondary ${styles.googleBtn}`}>
          <span className={styles.googleIcon}>G</span>
          Lanjutkan dengan Google
        </button>

        <p className={styles.registerPrompt}>
          Sudah punya akun? <Link to="/login" className={styles.registerLink}>Masuk di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
