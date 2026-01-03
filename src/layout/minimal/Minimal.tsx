import { Outlet } from "react-router-dom";
import AIHelper from "../../components/ui/aiHelper/AiHelper";
import Header from "../../components/layout/header/Header"

export default function DefaultLayout() {
  return (
    <>
    <Header/>
      <main className="layout-minimal-content" style={{paddingTop: 50}}>
        <Outlet />
        <AIHelper />
      </main>
    </>
  );
}
