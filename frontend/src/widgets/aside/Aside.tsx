import { Link } from "react-router-dom";
import { Tooltip } from "antd";

import { useAuth } from "@/entities/user/AuthContext";
import { Icon } from "@/shared/assets/icons/Icon";
import { SettingsPopover } from "./ui/SettingsPopover";

import styles from "./Aside.module.css";

export default function Aside() {
  const { isAuthenticated, user } = useAuth();

  return (
    <aside className={styles.aside}>
      <div className={styles.asideContent}>
        <div className={styles.asideContentTop}>
          {isAuthenticated && user ? (
            <Tooltip placement="right" title="Профиль">
              <Link to="/profile" className={styles.navLink}>
                <div className={styles.asideAvatar}>
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className={styles.avatarImage}
                    />
                  ) : (
                    user.username?.charAt(0).toUpperCase() || "?"
                  )}
                </div>
              </Link>
            </Tooltip>
          ) : (
            <Tooltip placement="right" title="Войти">
              <Link to="/auth" className={styles.navLink}>
                <div className={styles.asideAvatar}>
                  <Icon name="plus" />
                </div>
              </Link>
            </Tooltip>
          )}

          <Tooltip placement="right" title="Главная">
            <Link to="/" className={styles.asideNavigationButton}>
              <Icon name="home" />
            </Link>
          </Tooltip>

          <Tooltip placement="right" title="Сообщения">
            <button className={styles.asideNavigationButton}>
              <Icon name="mail" />
            </button>
          </Tooltip>

          <Tooltip placement="right" title="Платежи">
            <Link to="/payments" className={styles.asideNavigationButton}>
              <Icon name="cardBank" />
            </Link>
          </Tooltip>

          <Tooltip placement="right" title="Сообщество">
            <Link to="/community" className={styles.asideNavigationButton}>
              <Icon name="community" />
            </Link>
          </Tooltip>
        </div>

        <div className={styles.asideContentBottom}>
          <Tooltip placement="right" title="Настройки">
            <SettingsPopover>
              <button className={styles.asideNavigationButton}>
                <Icon name="settings" />
              </button>
            </SettingsPopover>
          </Tooltip>
        </div>
      </div>
    </aside>
  );
}