import { Outlet } from "react-router-dom";
import AIHelper from "../../components/ui/aiHelper/AiHelper";

export default function DefaultLayout() {
  return (
    <>
      <main className="layout-default-content">
        <Outlet />
        <AIHelper />
      </main>
    </>
  );
}
