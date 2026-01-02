import { Outlet } from "react-router-dom";
import AIHelper from "../../components/ui/aiHelper/AiHelper";
import Header from "../../components/layout/header/index"

export default function DefaultLayout() {
  return (
    <>
    <Header/>
      <main className="layout-default-content" style={{paddingTop: 50}}>
        <Outlet />
        <AIHelper />
      </main>
    </>
  );
}
