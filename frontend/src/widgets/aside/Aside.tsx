import styles from "./Aside.module.css";
import { useAuth } from "../../entities/user/AuthContext";
import { Icon } from "../../shared/assets/icons/Icon";
import { Tooltip } from 'antd';

export default function Aside() {
  const { isAuthenticated } = useAuth();

  return (
    <aside className={styles.aside}>
      <div className={styles.asideContent}>
        <div className={styles.asideContentTop}>
          {isAuthenticated && (
            <Tooltip placement="right" title="Профиль">
              <a href="/profile" className={styles.navLink}>
                <span>Profile</span>
              </a>
            </Tooltip>
          )}
          <Tooltip placement="right" title="Сообщения">
            <button className={styles.asideNavigationButton}>
              <Icon name="mail" />
            </button>
          </Tooltip>
          <Tooltip placement="right" title="Платежи">
            <button className={styles.asideNavigationButton}>
              <Icon name="cardBank" />
            </button>
          </Tooltip>
          <Tooltip placement="right" title="Сообщество">
            <button className={styles.asideNavigationButton}>
              <Icon name="community" />
            </button>
          </Tooltip>
          <Tooltip placement="right" title="История">
            <button className={styles.asideNavigationButton}>
              <Icon name="history" />
            </button>
          </Tooltip>
        </div>
        <div className={styles.asideContentBottom}>
          <Tooltip placement="right" title="Настройки">
            <button className={styles.asideNavigationButton}>
              <Icon name="settings" />
            </button>
          </Tooltip>
        </div>
      </div>
    </aside>
  );
}