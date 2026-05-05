import { Outlet } from "react-router-dom";

import Aside from "@/widgets/aside/Aside";
import AiHelperAntd from "@/features/ai/ui/AiHelper";
import styles from "./Default.module.css"

export default function DefaultLayout() {
  return (
    <div className={styles.defaultLayoutContainer}>
      <main className={styles.layoutDefaultContent}>
        <Outlet />
        <AiHelperAntd />
      </main>
      <Aside />
    </div>
  );
}