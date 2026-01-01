import styles from './installBanner.module.css';
import { HOME_TEXTS } from '../../../constants';



export default function InstallBanner() {
  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.text}>
          <h3 className={styles.title}>{HOME_TEXTS.INSTALL_BANNER.TITLE}</h3>
          <p className={styles.description}>{HOME_TEXTS.INSTALL_BANNER.DESCRIPTION}</p>
        </div>
        <div className={styles.actions}>
          <button 
            className={styles.installButton}
        
          >
            {HOME_TEXTS.INSTALL_BANNER.INSTALL_BUTTON}
          </button>
        </div>
      </div>
    </div>
  );
}