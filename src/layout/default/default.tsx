import { Outlet } from "react-router-dom";
import Header from "../../components/layout/header/index";

export default function DefaultLayout() {
  return (
    <>
      <Header />
      <main className="layout-default-content" style={{paddingTop: 70}} >
        <Outlet />
      </main>
    </>
  );
}
