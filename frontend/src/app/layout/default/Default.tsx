import { Outlet } from "react-router-dom";
import styles from "./Default.module.css"
import Aside from "../../../widgets/aside/Aside";
import AiHelperAntd from "../../../features/aiHelper/AiHelper";
import "./Default.module.css"; 

export default function DefaultLayout() {
  return (
    <div className={styles.defaulLayoutContainer}>
      <main className={styles.layoutDefaultContent}>
        <Outlet />
        <AiHelperAntd />
      </main>
      <Aside />
    </div>
  );
}