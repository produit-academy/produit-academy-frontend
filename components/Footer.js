import Link from 'next/link';
import styles from './Footer.module.css';
import Image from 'next/image';

// Footer: five-column layout with bottom bar.
// Icons are served from /public/icons/*.svg; update links as needed.
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.footerColumn}>
          <h2 className={styles.logoText}>Produit Academy</h2>
        </div>

        <div className={styles.footerColumn}>
          <h3 className={styles.footerHeading}>Categories</h3>
          <ul className={styles.footerLinks}>
            <li><Link href="/workinprogress">GATE Electrical</Link></li>
            <li><Link href="/workinprogress">GATE Mechanical</Link></li>
            <li><Link href="/workinprogress">GATE Civil</Link></li>
            <li><Link href="/workinprogress">GATE Computer Sci</Link></li>
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h3 className={styles.footerHeading}>Company</h3>
          <ul className={styles.footerLinks}>
            <li><Link href="/#features">About Us</Link></li>
            <li><Link href="/#contact">Contact Us</Link></li>
            <li><Link href="/workinprogress">Blogs</Link></li>
            <li><Link href="/workinprogress">Affiliate</Link></li>
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h3 className={styles.footerHeading}>Support</h3>
          <ul className={styles.footerLinks}>
            <li><Link href="/workinprogress">Help Center</Link></li>
            <li><Link href="/workinprogress">FAQ's</Link></li>
            <li><Link href="/workinprogress">Privacy Policy</Link></li>
            <li><Link href="/workinprogress">Terms & Conditions</Link></li>
          </ul>
        </div>

        <div className={styles.footerColumn}>
          <h3 className={styles.footerHeading}>Get in touch</h3>
          <ul className={styles.footerLinks}>
            <li><a href="mailto:produitacademy@gmail.com">produitacademy@gmail.com</a></li>
            <li><a href="tel:9876543210">9876543210</a></li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={`container ${styles.footerBottomContainer}`}>
          <p>Copyright @ 2024. All rights reserved.</p>
          <div className={styles.socialIcons}>
            <Link href="https://facebook.com" passHref><Image src="/icons/facebook.svg" alt="Facebook" width={24} height={24} /></Link>
            <Link href="https://twitter.com" passHref><Image src="/icons/twitter.svg" alt="Twitter" width={24} height={24} /></Link>
            <Link href="https://linkedin.com" passHref><Image src="/icons/linkedin.svg" alt="LinkedIn" width={24} height={24} /></Link>
            <Link href="https://www.instagram.com/produit.academy/" passHref><Image src="/icons/instagram.svg" alt="Instagram" width={24} height={24} /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}