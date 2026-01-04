import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import Logo from "../../ui/logo/Logotype";
import { NAVIGATION_TEXT } from "../../../constants";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.Header}>
      <div className={styles.headerContent}>
        <div className="logotype">
          <Logo />
        </div>

        <nav className={styles.navigation}>
          <Link to={NAVIGATION_TEXT.LINK.HOME}>
            <FormattedMessage id="nav.home" />
          </Link>

          <Link to={NAVIGATION_TEXT.LINK.ABOUT}>
            <FormattedMessage id="nav.about" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
