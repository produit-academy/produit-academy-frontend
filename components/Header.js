import { useState, useEffect } from 'react';
import styles from './Header.module.css';
import Image from 'next/image';
import Link from 'next/link';

const decodeToken = (token) => {
  try { return JSON.parse(atob(token.split('.')[1])); } catch (e) { return null; }
};

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setUser(decodeToken(token));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    window.location.href = '/login';
  };

  const dashboardUrl = user?.is_staff ? '/admin/dashboard' : '/student/dashboard';

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContent}`}>
        <div className={styles.logo}>
          <Link href="/" passHref>
              <Image src="/logo.png" alt="Produit Academy Logo" width={40} height={40} priority />
          </Link>
          <span className={styles.logoText}>Produit Academy</span>
        </div>

        <nav>
          <Link href="/#features" passHref>Features</Link>
          <Link href="/#courses" passHref>Courses</Link>
          <Link href="/#contact" passHref>Contact</Link>
        </nav>

        <div className={styles.authButtons}>
          {user ? (
            <>
              <Link href="/profile" passHref><button className={styles.loginBtn}>Profile</button></Link>
              <Link href={dashboardUrl} passHref><button className={styles.loginBtn}>Dashboard</button></Link>
              <button onClick={handleLogout} className={styles.signupBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" passHref><button className={styles.loginBtn}>Login</button></Link>
              <Link href="/signup" passHref><button className={styles.signupBtn}>SignUp</button></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}