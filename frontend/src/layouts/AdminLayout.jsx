import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar.jsx";

const AdminLayout = () => (
  <>
    <AdminNavbar />
    <main>
      <Outlet />
    </main>
  </>
);

export default AdminLayout;
