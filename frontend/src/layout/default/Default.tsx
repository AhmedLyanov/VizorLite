import { Outlet } from "react-router-dom";
import styles from "./Default.module.css"
import Aside from "../../components/layout/aside/Aside";
import AIHelper from "../../components/ui/aiHelper/AiHelper";
import "./Default.module.css"; 

export default function DefaultLayout() {
  return (
    <div className={styles.defaulLayoutContainer}>
      <main className={styles.layoutDefaultContent}>
        <Outlet />
        <AIHelper />
      </main>
      <Aside />
    </div>
  );
}