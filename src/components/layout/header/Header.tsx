import Logo from "../../ui/logo/Logotype";
import { NAVIGATION_TEXT } from "../../../constants";
import styles from "./Header.module.css";

type Props = {};

export default function index({}: Props) {
  return (
    <header className={styles.Header}>
      <div className={styles.headerContent}>
        <div className="logotype">
         <Logo />
        </div>
        <nav className={styles.navigation}>
          <a href={NAVIGATION_TEXT.LINK.HOME}>{NAVIGATION_TEXT.TITLE.HOME}</a>
          <a href={NAVIGATION_TEXT.LINK.ABOUT}>{NAVIGATION_TEXT.TITLE.ABOUT}</a>
          <a href={NAVIGATION_TEXT.LINK.ABOUT}>{NAVIGATION_TEXT.TITLE.ABOUT}</a>
        </nav>
      </div>
    </header>
  );
}
