import { useState, useEffect } from 'react';
import styles from './Header.module.css';
import Image from 'next/image';
import Link from 'next/link';
import apiFetch from '../utils/api';

const decodeToken = (token) => {
  try { return JSON.parse(atob(token.split('.')[1])); } catch (e) { return null; }
};

export default function Header() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileCoursesOpen, setIsMobileCoursesOpen] = useState(false);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      setUser(decodeToken(token));
    }
  }, []);

  // Load courses for dropdown; runs once
  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiFetch('/api/branches/');
        if (res.ok) {
          const data = await res.json();
          setCourses(Array.isArray(data) ? data : []);
        }
      } catch (_) {
        // ignore; fallback to static links
      }
    };
    load();
  }, []);

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setIsMobileCoursesOpen(false);
    }
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    window.location.href = '/login';
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleMobileCourses = () => {
    setIsMobileCoursesOpen((v) => !v);
  };

  const dashboardUrl = user?.is_staff ? '/admin/dashboard' : '/student/dashboard';

  const renderCourseLinks = (onClick) => {
    if (courses && courses.length > 0) {
      return courses.slice(0, 10).map((c, idx) => {
        const slug = c.slug || c.id || idx;
        const title = c.title || c.name || 'Course';
        const href = `/courses/${slug}`;
        return (
          <Link key={`${slug}`} href={href} onClick={onClick}>{title}</Link>
        );
      });
    }
    return (
      <>
        <Link href="/courses/gate-ee" onClick={onClick}>GATE Electrical</Link>
        <Link href="/courses/gate-me" onClick={onClick}>GATE Mechanical</Link>
      </>
    );
  };

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.headerContent}`}>
          <div className={styles.logo}>
            <Link href="/" passHref>
              <Image src="/logo.png" alt="Produit Academy Logo" width={40} height={40} priority />
            </Link>
            <span className={styles.logoText}>Produit Academy</span>
          </div>

          <button className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle menu">
            <span className={isMenuOpen ? styles.open : ''}></span>
            <span className={isMenuOpen ? styles.open : ''}></span>
            <span className={isMenuOpen ? styles.open : ''}></span>
          </button>

          <nav className={styles.desktopNav}>
            <Link href="/">Home</Link>
            
            <div className={styles.dropdown}>
              <button className={styles.dropdownBtn}>
                Courses <span>&#9662;</span>
              </button>
              <div className={styles.dropdownContent}>
                {renderCourseLinks()}
                <Link href="/#courses">All Courses</Link>
              </div>
            </div>
            
            <Link href="/#features">About Us</Link>
            <Link href="/#contact">Contact Us</Link>
          </nav>

          <div className={styles.authButtons}>
            {user ? (
              <>
                <Link href="/#contact" passHref><button className={styles.enquiryBtn}>Enquiry Now</button></Link>
                <Link href="/profile" passHref><button className={styles.loginBtn}>Profile</button></Link>
                <Link href={dashboardUrl} passHref><button className={styles.loginBtn}>Dashboard</button></Link>
                <button onClick={handleLogout} className={styles.signupBtn}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/#contact" passHref><button className={styles.enquiryBtn}>Enquiry Now</button></Link>
                <Link href="/signup" passHref><button className={styles.signupBtn}>Start Learning</button></Link>
              </>
            )}
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className={styles.overlay} onClick={closeMenu}></div>
      )}

      <div className={`${styles.sidebar} ${isMenuOpen ? styles.open : ''}`}>
        <div className={styles.sidebarContent}>
          <div className={styles.sidebarHeader}>
            <Image src="/logo.png" alt="Produit Academy Logo" width={40} height={40} />
            <button className={styles.closeBtn} onClick={closeMenu}>&times;</button>
          </div>

          <nav className={styles.sidebarNav}>
            <Link href="/" onClick={closeMenu}>Home</Link>
            
            <div className={`${styles.mobileDropdown} ${isMobileCoursesOpen ? styles.open : ''}`}>
              <button className={styles.dropdownBtn} onClick={toggleMobileCourses} aria-expanded={isMobileCoursesOpen} aria-controls="mobile-courses">
                Courses <span>{isMobileCoursesOpen ? '\u25B2' : '\u25BC'}</span>
              </button>
              <div id="mobile-courses" className={`${styles.dropdownContent} ${isMobileCoursesOpen ? styles.show : ''}`}>
                {renderCourseLinks(closeMenu)}
                <Link href="/#courses" onClick={closeMenu}>All Courses</Link>
              </div>
            </div>
            
            <Link href="/#features" onClick={closeMenu}>About Us</Link>
            <Link href="/#contact" onClick={closeMenu}>Contact Us</Link>
          </nav>

          <div className={styles.sidebarButtons}>
            {user ? (
              <>
                <Link href="/#contact" passHref><button className={styles.sidebarBtn} onClick={closeMenu}>Enquiry Now</button></Link>
                <Link href="/profile" passHref><button className={styles.sidebarBtn} onClick={closeMenu}>Profile</button></Link>
                <Link href={dashboardUrl} passHref><button className={styles.sidebarBtn} onClick={closeMenu}>Dashboard</button></Link>
                <button onClick={() => { closeMenu(); handleLogout(); }} className={styles.sidebarBtnDanger}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/#contact" passHref><button className={styles.sidebarBtn} onClick={closeMenu}>Enquiry Now</button></Link>
                <Link href="/signup" passHref><button className={styles.sidebarBtnPrimary} onClick={closeMenu}>Start Learning</button></Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}