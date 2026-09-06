import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={`card ${styles.loginCard} fade-up`}>
        <h1 className={styles.title}>Masuk ke Quizzy</h1>
        
        <form onSubmit={handleSubmit} className={styles.form}>
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
              placeholder="••••••••"
              required
              className={styles.input}
            />
          </div>
          
          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
        
        <div className={styles.divider}>
          <span>atau</span>
        </div>
        
        <button className={`btn btn-secondary ${styles.googleBtn}`}>
          <span className={styles.googleIcon}>G</span>
          Masuk dengan Google
        </button>
        
        <p className={styles.registerPrompt}>
          Belum punya akun? <Link to="/register" className={styles.registerLink}>Daftar</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
