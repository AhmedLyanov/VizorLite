import { Link } from "react-router-dom";
import { useIntl } from "react-intl";

import { HOME_TEXTS } from "../../shared/constants";
import styles from "./HomePage.module.css";

import InstallBanner from "../../widgets/installBanner/InstallBanner";
import BigButton from "../../shared/ui/button/BigButton/BigButton";
import LanguageSwitcher from "../../features/LanguageSwitcher/LanguageSwitcher";

import webcamIcon from "../../shared/assets/webcamera.svg";
import joinIcon from "../../shared/assets/join.svg";
import dollarIcon from "../../shared/assets/dollar.svg";
import questionIcon from "../../shared/assets/question.svg";
//еуые
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
            image={webcamIcon}  
          />

          <BigButton
            title={intl.formatMessage({
              id: HOME_TEXTS.BUTTONS.JOIN_MEETING,
            })}
            image={joinIcon}     
          />
        </div>
      </div>

      <div className={styles.bottomContent}>
        <div className={styles.bottomUtilsButtons}>
          <Link to="/pricing" className={styles.bottomUtilsButton}>
            <img src={dollarIcon} alt="" className={styles.linkIcon} /> 
            <span>
              {intl.formatMessage({ id: HOME_TEXTS.BOTTOM.PRICING })}
            </span>
          </Link>

          <LanguageSwitcher />

          <Link to="/faq" className={styles.bottomUtilsButton}>
            <img src={questionIcon} alt="" className={styles.linkIcon} /> 
            <span>
              {intl.formatMessage({ id: HOME_TEXTS.BOTTOM.FAQ })}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
