import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await login(emailOrUsername, password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Login gagal. Periksa username/email dan password.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Login dengan Google gagal.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={`card ${styles.loginCard} fade-up`}>
        <div className={styles.header}>
          <div className={styles.icon}>🧠</div>
          <h1 className={styles.title}>Masuk ke Quizzy</h1>
          <p className={styles.subtitle}>
            Buka Kartu Identitas Psikologismu dan hubungkan profil dengan teman!
          </p>
        </div>

        {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email atau Username (@)</label>
            <input
              type="text"
              id="email"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="nama@email.com atau username"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password akunmu"
                required
                className={`${styles.input} ${styles.passwordInput}`}
              />
              <button
                type="button"
                className={styles.passwordToggleBtn}
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? 'Memproses Masuk...' : 'Masuk ke Akun 🚀'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>atau</span>
        </div>

        <button type="button" onClick={handleGoogleLogin} className={`btn btn-secondary ${styles.googleBtn}`}>
          <span className={styles.googleIcon}>G</span>
          Masuk dengan Google
        </button>

        <p className={styles.registerPrompt}>
          Belum punya akun?{' '}
          <Link to="/register" className={styles.registerLink}>
            Daftar Akun Baru di sini ✨
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
