import styles from './Notfound.module.css';
import { Link } from 'react-router-dom';
import { COMMON_TEXTS } from '../../constants';

type Props = {}

export default function Notfound({}: Props) {
  return (
    <div className={styles.notfoundContainer}>
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>{COMMON_TEXTS.NOTFOUND.TITLE}</h1>
        <p className={styles.description}>{COMMON_TEXTS.NOTFOUND.DESCRIPTION}</p>
        <Link to="/" className={styles.homeButton}>
          {COMMON_TEXTS.NOTFOUND.BUTTON}
        </Link>
      </div>
    </div>
  );
}