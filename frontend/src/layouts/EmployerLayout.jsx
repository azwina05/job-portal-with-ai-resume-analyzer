import { Outlet } from "react-router-dom";
import EmployerNavbar from "../components/EmployerNavbar.jsx";

const EmployerLayout = () => (
  <>
    <EmployerNavbar />
    <main>
      <Outlet />
    </main>
  </>
);

export default EmployerLayout;
