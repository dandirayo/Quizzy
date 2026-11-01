import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './LoginPage.module.css';

const AVATAR_SEEDS = [
  'pixel_coder',
  'cyber_dreamer',
  'star_pilot',
  'mind_voyager',
  'galaxy_spark',
  'neon_quest',
  'aurora_glow',
  'zen_master'
];

const RegisterPage = () => {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('male'); // 'male', 'female', 'other'
  const [avatarSeed, setAvatarSeed] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { register, loginWithGoogle, loading } = useAuth();
  const navigate = useNavigate();

  // Compute live avatar URL based on seed or username
  const effectiveSeed = avatarSeed || (username.trim() ? username.trim() : (gender === 'female' ? 'dea_female' : 'dendi_male'));
  const currentAvatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${effectiveSeed}`;

  const handleRandomAvatar = () => {
    const randomItem = AVATAR_SEEDS[Math.floor(Math.random() * AVATAR_SEEDS.length)] + '_' + Math.floor(Math.random() * 999);
    setAvatarSeed(randomItem);
  };

  const handleUsernameChange = (val) => {
    // Only lowercase, digits, and underscores
    const cleaned = val.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(cleaned);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!displayName.trim()) {
      setErrorMsg('Silakan masukkan nama lengkap atau panggilanmu.');
      return;
    }

    if (!username.trim() || username.trim().length < 3) {
      setErrorMsg('Username minimal harus 3 karakter.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password minimal harus 6 karakter.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi password tidak cocok dengan password.');
      return;
    }

    try {
      await register(
        email.trim(),
        password,
        username.trim(),
        displayName.trim(),
        gender,
        currentAvatarUrl
      );

      setSuccessMsg(`Akun @${username} berhasil dibuat! Mengalihkan ke Beranda... 🎉`);
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 900);
    } catch (err) {
      setErrorMsg(err.message || 'Pendaftaran gagal. Silakan coba lagi.');
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await loginWithGoogle();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Pendaftaran dengan Google gagal.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={`card ${styles.loginCard} fade-up`} style={{ maxWidth: '460px' }}>
        <div className={styles.header}>
          <div className={styles.icon}>✨</div>
          <h1 className={styles.title}>Buat Akun Baru</h1>
          <p className={styles.subtitle}>
            Daftar untuk menyimpan Kartu Identitas Psikologismu, ikut mini games, dan terhubung dengan teman!
          </p>
        </div>

        {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}
        {successMsg && <div className={styles.successAlert}>{successMsg}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Avatar Preview */}
          <div className={styles.avatarPreviewBox}>
            <img
              src={currentAvatarUrl}
              alt="Avatar Preview"
              className={styles.avatarImg}
            />
            <div className={styles.avatarControls}>
              <div className={styles.avatarLabel}>Model Avatar Profil</div>
              <button
                type="button"
                onClick={handleRandomAvatar}
                className={styles.avatarChangeBtn}
              >
                <span>🎲</span> Ganti Model Acak
              </button>
            </div>
          </div>

          {/* Nama Lengkap / Panggilan */}
          <div className={styles.formGroup}>
            <label htmlFor="displayName">Nama Lengkap / Panggilan</label>
            <input
              type="text"
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="contoh: Dandi Rayo"
              required
              className={styles.input}
            />
          </div>

          {/* Username */}
          <div className={styles.formGroup}>
            <label htmlFor="username">Pilih Username (@)</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              placeholder="contoh: dandirayo"
              required
              minLength={3}
              maxLength={24}
              className={styles.input}
            />
            <span className={styles.inputHint}>
              Hanya huruf kecil, angka, dan _ (tanpa spasi). Profilmu: quizzy/profile/{username ? `@${username}` : '@username'}
            </span>
          </div>

          {/* Email */}
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

          {/* Gender / Vibe Selector */}
          <div className={styles.formGroup}>
            <label>Identitas / Gender</label>
            <div className={styles.genderSelector}>
              <button
                type="button"
                className={`${styles.genderOption} ${gender === 'male' ? styles.genderOptionActive : ''}`}
                onClick={() => setGender('male')}
              >
                <span className={styles.genderIcon}>👨</span>
                <span>Cowo</span>
              </button>
              <button
                type="button"
                className={`${styles.genderOption} ${gender === 'female' ? styles.genderOptionActive : ''}`}
                onClick={() => setGender('female')}
              >
                <span className={styles.genderIcon}>👩</span>
                <span>Cewe</span>
              </button>
              <button
                type="button"
                className={`${styles.genderOption} ${gender === 'other' ? styles.genderOptionActive : ''}`}
                onClick={() => setGender('other')}
              >
                <span className={styles.genderIcon}>✨</span>
                <span>Bebas</span>
              </button>
            </div>
          </div>

          {/* Password */}
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                minLength={6}
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

          {/* Konfirmasi Password */}
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Konfirmasi Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password di atas"
                required
                className={`${styles.input} ${styles.passwordInput}`}
              />
              <button
                type="button"
                className={styles.passwordToggleBtn}
                onClick={() => setShowConfirmPassword(prev => !prev)}
                aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Lihat password'}
                title={showConfirmPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {confirmPassword.length > 0 && (
              <div className={`${styles.matchIndicator} ${password === confirmPassword ? styles.matchSuccess : styles.matchError}`}>
                {password === confirmPassword ? '✅ Password cocok' : '❌ Password belum cocok'}
              </div>
            )}
          </div>

          <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
            {loading ? 'Mendaftarkan Akun...' : 'Daftar Akun Baru 🚀'}
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
