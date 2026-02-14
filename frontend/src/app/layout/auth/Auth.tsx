import { Outlet } from "react-router-dom";


export default function SecureLayout() {
  return (
    <div >
      <main >
        <Outlet />
      </main>
    </div>
  );
}