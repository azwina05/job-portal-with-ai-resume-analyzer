import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const EmployerNavbar = () => {
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth();
  const nav = useNavigate();
  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    nav("/");
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/employer/dashboard" className="nav-brand" onClick={close}>
          <span className="nav-logo">JP</span>
          <span>Job Portal</span>
        </Link>

        <button
          className="nav-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/employer/dashboard" className="nav-link" onClick={close}>
            Dashboard
          </NavLink>
          <NavLink to="/employer/post-job" className="nav-link" onClick={close}>
            Post Job
          </NavLink>
          <NavLink to="/employer/jobs" className="nav-link" onClick={close}>
            My Jobs
          </NavLink>
          <NavLink to="/employer/applications" className="nav-link" onClick={close}>
            Applications
          </NavLink>
          <NavLink to="/employer/ai-analyzer" className="nav-link" onClick={close}>
            AI Analyzer
          </NavLink>
          <NavLink to="/employer/profile" className="nav-link" onClick={close}>
            Profile
          </NavLink>
          <span className="nav-link text-muted small">
            {user?.name?.split(" ")[0]}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default EmployerNavbar;
