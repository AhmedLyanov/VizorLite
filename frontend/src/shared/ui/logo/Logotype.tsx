import styles from './Logotype.module.css';
import LogoIcon from "../../../shared/assets/logo.jpg"

export default function Logo() {
  return (
    <div className={styles.logoContainer}>
      <img
        src=
        {LogoIcon}
        alt="VizorLite - видеоконференции"
        width={50}
        height={50}
        className={styles.logo}
      />
    </div>
  );
}