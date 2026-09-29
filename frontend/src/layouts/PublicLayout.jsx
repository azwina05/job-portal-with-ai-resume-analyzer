import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar.jsx";

const PublicLayout = () => (
  <>
    <PublicNavbar />
    <main>
      <Outlet />
    </main>
    <footer className="footer">
      <div className="container">
        <p className="small">
          © {new Date().getFullYear()} Job Portal · Built with the MERN stack and
          Google Gemini AI.
        </p>
      </div>
    </footer>
  </>
);

export default PublicLayout;
