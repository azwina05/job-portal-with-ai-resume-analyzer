import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const AdminNavbar = () => {
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
        <Link to="/admin/dashboard" className="nav-brand" onClick={close}>
          <span className="nav-logo">JP</span>
          <span>Job Portal Admin</span>
        </Link>

        <button
          className="nav-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? "Close" : "Menu"}
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`}>
          <NavLink to="/admin/dashboard" className="nav-link" onClick={close}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/users" className="nav-link" onClick={close}>
            Users
          </NavLink>
          <NavLink to="/admin/jobs" className="nav-link" onClick={close}>
            Jobs
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

export default AdminNavbar;
