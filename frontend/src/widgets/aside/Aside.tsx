import styles from "./Aside.module.css";
import { useAuth } from "../../contexts/AuthContext";
import { Icon } from "../../shared/assets/icons/Icon";

export default function Aside() {
  const { isAuthenticated } = useAuth();

  return (
    <aside className={styles.aside}>
      <div className={styles.asideContent}>
        <div className={styles.asideContentTop}>
          {isAuthenticated && (
            <a href="/profile" className={styles.navLink}>
              <span>Profile</span>
            </a>
          )}
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
