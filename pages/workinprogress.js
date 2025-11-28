import styles from "@/styles/work.module.css";
import Image from 'next/image';

export default function WorkInProgress() {
  return (
    <div className={styles.wipContainer}>
      <div className={styles.floatingShapes}>
        <div className={styles.shape}></div>
        <div className={styles.shape}></div>
        <div className={styles.shape}></div>
      </div>

      <div className={styles.content}>
        <Image src="/work.png" className={styles.wipImg} alt="Work in Progress" width={500} height={300} />

        <h1 className={styles.title}>Work in Progress</h1>

        <p className={styles.subtitle}>
          Our education platform is being upgraded to serve you better.
        </p>

        <p className={styles.smallText}>Please check back soon.</p>
      </div>
    </div>
  );
}
