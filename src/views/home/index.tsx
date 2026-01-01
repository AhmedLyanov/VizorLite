import { HOME_TEXTS } from "../../constants";
import styles from "./Home.module.css";
import BigButton from "../../components/ui/bigButton";

export default function index() {
  return (
    <section className={styles.sectionСontent}>
      <h1 className={styles.mainTitle}>{HOME_TEXTS.HERO.TITLE}</h1>
      <div className={styles.container_bigbuttons}>
        <BigButton title="Создать видеовстречу" image="/images/webcamera.svg"/>
        <BigButton title="Подключиться" image="/images/join.svg"/>
      </div>
    </section>
  );
}
