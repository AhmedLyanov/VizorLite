import styles from "./Aside.module.css";
import { Icon } from "../../../shared/icons/Icon";

export default function index() {
  return (
    <aside className={styles.aside}>
      <div className={styles.asideContent}>
        <div className={styles.asideContentTop}>
          <button title="title test" className={styles.asideNavigationButton}>
            <Icon name="mail" />
          </button>
          <button title="title test" className={styles.asideNavigationButton}>
            <Icon name="cardBank" />
          </button>
          <button title="title test" className={styles.asideNavigationButton}>
            <Icon name="community" />
          </button>
          <button title="title test" className={styles.asideNavigationButton}>
            <Icon name="history" />
          </button>
        </div>
        <div className={styles.asideContentBottom}>
          <button title="title test" className={styles.asideNavigationButton}>
            <Icon name="settings" />
          </button>
        </div>
      </div>
    </aside>
  );
}
