import { Link } from "react-router-dom";
import { HOME_TEXTS } from "../../constants";
import styles from "./HomePage.module.css";
import InstallBanner from "../../components/ui/installBanner/InstallBanner";
import BigButton from "../../components/ui/button/BigButton/BigButton";
import { Icon } from "../../shared/icons/Icon";

export default function HomePage() {
  return (
    <section className={styles.sectionContent}>
      <InstallBanner />
      <div className={styles.contentContainer}>
        <h1 className={styles.mainTitle}>{HOME_TEXTS.HERO.TITLE}</h1>
        <div className={styles.containerBigbuttons}>
          <BigButton
            title="Создать видеовстречу"
            image="/images/webcamera.svg"
          />
          <BigButton title="Подключиться" image="/images/join.svg" />
        </div>
      </div>
      <div className={styles.bottomContent}>
        <div className={styles.bottomUtilsButtons}>
          <Link to="/pricing" className={styles.bottomUtilsButton}>
            <img
              src="/images/dollar.svg"
              alt="Тарифы"
              className={styles.linkIcon}
            />
            <span>Тарифы</span>
          </Link>
          <button className={styles.bottomUtilsButton}>
            <Icon name="translate" size={20} />
            <span>Перевод</span>
          </button>
          <Link to="/faq" className={styles.bottomUtilsButton}>
            <img
              src="/images/question.svg"
              alt="Вопросы"
              className={styles.linkIcon}
            />
            <span>Вопросы</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
