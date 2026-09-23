import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, routeForRole } from "../auth/AuthContext.jsx";
import Alert from "../components/Alert.jsx";
import Button from "../components/Button.jsx";

const Register = () => {
  const { register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "seeker",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      const u = await register(form);
      nav(routeForRole(u.role), { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Get started in less than a minute.</p>

        {error && <Alert kind="error">{error}</Alert>}

        <form className="form mt-16" onSubmit={onSubmit}>
          <div>
            <label className="label">Full Name</label>
            <input
              className="input"
              value={form.name}
              onChange={update("name")}
              autoComplete="name"
              required
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              value={form.email}
              onChange={update("email")}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={update("password")}
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="label">I am a</label>
            <select
              className="select"
              value={form.role}
              onChange={update("role")}
            >
              <option value="seeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>
          <Button
            type="submit"
            variant="primary"
            block
            disabled={submitting}
          >
            {submitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="auth-bottom">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
};

export default Register;
