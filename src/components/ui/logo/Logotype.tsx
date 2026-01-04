import styles from './Logotype.module.css';

export default function Logo() {
  return (
    <div className={styles.logoContainer}>
      <img
        src="/images/logo.jpg"
        alt="VizorLite - видеоконференции"
        width={50}
        height={50}
        className={styles.logo}
      />
    </div>
  );
}