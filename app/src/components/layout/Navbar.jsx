import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>🧠</span>
            <span className={styles.logoText}>Quizzy</span>
          </Link>
        </div>

        <div className={styles.center}>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
            end
          >
            Kuis
          </NavLink>
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
            Profil
          </NavLink>
        </div>

        <div className={styles.right}>
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <span className={styles.username}>{user.username}</span>
              <button onClick={logout} className="btn btn-secondary">Keluar</button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">Masuk</Link>
          )}
          
          <button className={styles.mobileMenuBtn}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
