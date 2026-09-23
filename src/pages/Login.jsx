import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth, routeForRole } from "../auth/AuthContext.jsx";
import Alert from "../components/Alert.jsx";
import Button from "../components/Button.jsx";

const Login = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setSubmitting(true);
    try {
      const u = await login(email.trim(), password);
      const from = location.state?.from;
      nav(from && from !== "/" ? from : routeForRole(u.role), { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Login to continue to your dashboard.</p>

        {error && <Alert kind="error">{error}</Alert>}

        <form className="form mt-16" onSubmit={onSubmit}>
          <div>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            block
            disabled={submitting}
          >
            {submitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="auth-bottom">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
