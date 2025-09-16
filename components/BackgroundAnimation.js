import styles from './BackgroundAnimation.module.css';

const BackgroundAnimation = () => {
  return (
    <div className={styles.animationArea}>
      <div className={styles.kiteWrapper1}>
        <div className={styles.kite}></div>
      </div>
      <div className={styles.kiteWrapper2}>
        <div className={styles.kite}></div>
      </div>
       <div className={styles.kiteWrapper3}>
        <div className={styles.kite}></div>
      </div>
    </div>
  );
};

export default BackgroundAnimation;