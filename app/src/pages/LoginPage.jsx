import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
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

  const handleQuickDemo = async (username) => {
    setEmailOrUsername(username);
    setPassword('demo123');
    try {
      await login(username, 'demo123');
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Login demo gagal.');
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
            <label htmlFor="email">Email atau Username</label>
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
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={styles.input}
            />
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk 🚀'}
          </button>
        </form>

        <div className={styles.demoSection}>
          <div className={styles.demoHeader}>
            <span className={styles.demoIcon}>⚡</span>
            <div>
              <div className={styles.demoTitle}>Akun Uji Coba Cepat (Demo)</div>
              <div className={styles.demoSubtitle}>Klik salah satu untuk langsung masuk dan uji coba:</div>
            </div>
          </div>
          <div className={styles.demoGrid}>
            <button
              type="button"
              className={`${styles.demoCard} ${styles.demoMale}`}
              onClick={() => handleQuickDemo('dendiz7')}
            >
              <div className={styles.demoAvatar}>👨‍💻</div>
              <div className={styles.demoMeta}>
                <div className={styles.demoName}>Dendi Pratama</div>
                <div className={styles.demoHandle}>@dendiz7</div>
                <div className={styles.demoTags}>
                  <span className={styles.tagGender}>Cowo</span>
                  <span className={styles.tagMbti}>INTJ</span>
                </div>
              </div>
              <span className={styles.demoArrow}>Masuk →</span>
            </button>

            <button
              type="button"
              className={`${styles.demoCard} ${styles.demoFemale}`}
              onClick={() => handleQuickDemo('dea33')}
            >
              <div className={styles.demoAvatar}>👩‍🎨</div>
              <div className={styles.demoMeta}>
                <div className={styles.demoName}>Dea Anindita</div>
                <div className={styles.demoHandle}>@dea33</div>
                <div className={styles.demoTags}>
                  <span className={styles.tagGender}>Cewe</span>
                  <span className={styles.tagMbti}>ENFP</span>
                </div>
              </div>
              <span className={styles.demoArrow}>Masuk →</span>
            </button>
          </div>
        </div>

        <div className={styles.divider}>
          <span>atau</span>
        </div>

        <button type="button" onClick={handleGoogleLogin} className={`btn btn-secondary ${styles.googleBtn}`}>
          <span className={styles.googleIcon}>G</span>
          Masuk dengan Google
        </button>

        <p className={styles.registerPrompt}>
          Belum punya akun? <Link to="/register" className={styles.registerLink}>Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
