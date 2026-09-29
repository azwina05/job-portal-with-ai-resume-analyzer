import { Outlet } from "react-router-dom";
import SeekerNavbar from "../components/SeekerNavbar.jsx";

const SeekerLayout = () => (
  <>
    <SeekerNavbar />
    <main>
      <Outlet />
    </main>
  </>
);

export default SeekerLayout;
