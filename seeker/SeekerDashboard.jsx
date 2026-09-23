import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client.js";
import { useAuth } from "../../auth/AuthContext.jsx";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";

const SeekerDashboard = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let on = true;
    api
      .get("/applications/my")
      .then((res) => on && setApps(res.data.applications || []))
      .catch((err) =>
        on &&
        setError(err?.response?.data?.message || "Failed to load applications.")
      )
      .finally(() => on && setLoading(false));
    return () => {
      on = false;
    };
  }, []);

  const total = apps.length;
  const pending = apps.filter((a) => a.status === "pending").length;
  const accepted = apps.filter((a) => a.status === "accepted").length;
  const rejected = apps.filter((a) => a.status === "rejected").length;

  return (
    <section className="page">
      <div className="container">
        <h1 className="page-title">Welcome, {user?.name?.split(" ")[0]} 👋</h1>
        <p className="page-sub">
          Here's a snapshot of your job search activity.
        </p>

        {error && <Alert kind="error">{error}</Alert>}

        {loading ? (
          <Loader center />
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Applications</div>
                <div className="stat-value">{total}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Pending</div>
                <div className="stat-value">{pending}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Accepted</div>
                <div className="stat-value stat-accent">{accepted}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Rejected</div>
                <div className="stat-value">{rejected}</div>
              </div>
            </div>

            <div className="flex gap-12 mt-24 flex-wrap">
              <Link to="/seeker/jobs" className="btn btn-primary">
                Browse Jobs
              </Link>
              <Link to="/seeker/applications" className="btn btn-outline">
                View My Applications
              </Link>
              <Link to="/seeker/profile" className="btn btn-ghost">
                Update Profile
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default SeekerDashboard;
