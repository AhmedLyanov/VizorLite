import { Link } from "react-router-dom";
import { useIntl } from "react-intl";
import { HOME_TEXTS } from "../../constants";
import styles from "./HomePage.module.css";
import InstallBanner from "../../components/ui/installBanner/InstallBanner";
import BigButton from "../../components/ui/button/BigButton/BigButton";
import LanguageSwitcher from "../../components/ui/LanguageSwitcher/LanguageSwitcher";



export default function HomePage() {
  const intl = useIntl();

  return (
    <section className={styles.sectionContent}>
      <InstallBanner />

      <div className={styles.contentContainer}>
        <h1 className={styles.mainTitle}>
          {intl.formatMessage({ id: HOME_TEXTS.HERO.TITLE })}
        </h1>

        <div className={styles.containerBigbuttons}>
          <BigButton
            title={intl.formatMessage({
              id: HOME_TEXTS.BUTTONS.CREATE_MEETING,
            })}
            image="/images/webcamera.svg"
          />

          <BigButton
            title={intl.formatMessage({
              id: HOME_TEXTS.BUTTONS.JOIN_MEETING,
            })}
            image="/images/join.svg"
          />
        </div>
      </div>

      <div className={styles.bottomContent}>
        <div className={styles.bottomUtilsButtons}>
          <Link to="/pricing" className={styles.bottomUtilsButton}>
            <img src="/images/dollar.svg" alt="" className={styles.linkIcon} />
            <span>
              {intl.formatMessage({ id: HOME_TEXTS.BOTTOM.PRICING })}
            </span>
          </Link>
            
          <LanguageSwitcher/>

          <Link to="/faq" className={styles.bottomUtilsButton}>
            <img src="/images/question.svg" alt="" className={styles.linkIcon} />
            <span>
              {intl.formatMessage({ id: HOME_TEXTS.BOTTOM.FAQ })}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}