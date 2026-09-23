import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const PublicNavbar = () => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link to="/" className="nav-brand" onClick={close}>
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
          <NavLink to="/" end className="nav-link" onClick={close}>
            Home
          </NavLink>
          <NavLink to="/about" className="nav-link" onClick={close}>
            About
          </NavLink>
          <NavLink to="/contact" className="nav-link" onClick={close}>
            Contact
          </NavLink>
          <NavLink to="/login" className="nav-link" onClick={close}>
            Login
          </NavLink>
          <Link
            to="/register"
            className="btn btn-primary btn-sm nav-cta"
            onClick={close}
          >
            Register
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default PublicNavbar;
