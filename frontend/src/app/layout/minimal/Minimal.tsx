import { Outlet } from "react-router-dom";
import AiHelperAntd from "../../../features/aiHelper/AiHelper";
import Header from "../../../widgets/header/Header";

export default function DefaultLayout() {
  return (
    <>
    <Header/>
      <main className="layout-minimal-content" style={{paddingTop: 50}}>
        <Outlet />
        <AiHelperAntd />
      </main>
    </>
  );
}
