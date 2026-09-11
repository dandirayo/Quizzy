import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.container}>
          {/* Brand Logo */}
          <div className={styles.left}>
            <Link to={isAuthenticated ? "/dashboard" : "/"} className={styles.logo} onClick={() => setMobileOpen(false)}>
              <span className={styles.logoIcon}>🧠</span>
              <span className={styles.logoText}>Quizzy</span>
            </Link>
          </div>

          {/* Desktop Center Navigation Links */}
          <div className={styles.center}>
            <NavLink
              to="/dashboard"
              className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
              end
            >
              Beranda
            </NavLink>
            <a
              href="/dashboard#mini-games"
              className={styles.navLink}
            >
              Mini Games
            </a>
            <NavLink
              to="/friends"
              className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
            >
              Teman
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
            >
              Kartu Profil
            </NavLink>
          </div>

          {/* Right Area (Desktop Auth & Mobile Toggle) */}
          <div className={styles.right}>
            {isAuthenticated && user ? (
              <div className={`${styles.userMenu} ${styles.desktopOnly}`}>
                <Link to="/profile" className={styles.userProfileLink}>
                  <img
                    src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
                    alt={user.display_name}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--card2)' }}
                  />
                  <span className={styles.username}>@{user.username}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: '34px' }}
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className={styles.desktopOnly}>
                <Link
                  to="/login"
                  className="btn btn-primary"
                  style={{ padding: '6px 14px', fontSize: '0.85rem', minHeight: '34px' }}
                >
                  Masuk
                </Link>
              </div>
            )}

            {/* Mobile Toggle Button with Animated Lines */}
            <button
              type="button"
              className={`${styles.mobileMenuBtn} ${mobileOpen ? styles.menuOpen : ''}`}
              onClick={() => setMobileOpen(prev => !prev)}
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
            >
              <div className={styles.hamburgerIcon}>
                <span className={styles.hamburgerLine}></span>
                <span className={styles.hamburgerLine}></span>
                <span className={styles.hamburgerLine}></span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Backdrop Overlay */}
      <div
        className={`${styles.mobileBackdrop} ${mobileOpen ? styles.open : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Mobile Slide-down Drawer */}
      <div className={`${styles.mobileDrawer} ${mobileOpen ? styles.open : ''}`}>
        <div className={styles.mobileNavLinks}>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => isActive ? `${styles.mobileNavLink} ${styles.active}` : styles.mobileNavLink}
            end
          >
            <span>🧩</span> Beranda
          </NavLink>
          <a
            href="/dashboard#mini-games"
            className={styles.mobileNavLink}
            onClick={() => setMobileOpen(false)}
          >
            <span>🎮</span> Mini Games
          </a>
          <NavLink
            to="/friends"
            className={({ isActive }) => isActive ? `${styles.mobileNavLink} ${styles.active}` : styles.mobileNavLink}
          >
            <span>🤝</span> Teman & Komunitas
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => isActive ? `${styles.mobileNavLink} ${styles.active}` : styles.mobileNavLink}
          >
            <span>📇</span> Kartu Identitas Psikologis
          </NavLink>
        </div>

        {/* Mobile User Profile or Auth Buttons */}
        <div className={styles.mobileUserSection}>
          {isAuthenticated && user ? (
            <>
              <div className={styles.mobileUserInfo}>
                <img
                  src={user.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`}
                  alt={user.display_name}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--card2)' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user.display_name}</div>
                  <div style={{ color: 'var(--accent2)', fontSize: '0.8rem' }}>@{user.username}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                <Link to="/profile" className="btn btn-secondary" style={{ flex: 1, fontSize: '0.85rem' }}>
                  Lihat Profil
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-secondary"
                  style={{ color: '#f87171', fontSize: '0.85rem' }}
                >
                  Keluar
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-primary" style={{ flex: 1 }}>
                Masuk
              </Link>
              <Link to="/register" className="btn btn-secondary" style={{ flex: 1 }}>
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
