import styles from './Notfound.module.css';
import { Link } from 'react-router-dom';
import { COMMON_TEXTS } from '../../constants/notfound/index';
import { useIntl } from "react-intl";


export default function Notfound() {
    const intl = useIntl();

  return (
    <div className={styles.notfoundContainer}>
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>{intl.formatMessage({id: COMMON_TEXTS.NOTFOUND.TITLE})}</h1>
        <p className={styles.description}>{intl.formatMessage({id: COMMON_TEXTS.NOTFOUND.DESCRIPTION})}</p>
        <Link to="/" className={styles.homeButton}>
          {intl.formatMessage({id: COMMON_TEXTS.NOTFOUND.BUTTON})}
        </Link>
      </div>
    </div>
  );
}