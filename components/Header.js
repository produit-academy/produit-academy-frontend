import styles from './Header.module.css';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContent}`}>
        <div className={styles.logo}>
          <Link href="/" passHref>
            <Image
              src="/logo.png"
              alt="Produit Academy Logo"
              width={40}
              height={40}
              priority
            />
          </Link>
          <span className={styles.logoText}>Produit Academy</span>
        </div>

        <nav>
          <a href="#features">Features</a>
          <a href="#courses">Courses</a>
          <a href="#contact">Contact</a>
        </nav>
        
        <div className={styles.authButtons}>
          <button className={styles.loginBtn}>Login</button>
          <button className={styles.signupBtn}>SignUp</button>
        </div>
      </div>
    </header>
  );
}
