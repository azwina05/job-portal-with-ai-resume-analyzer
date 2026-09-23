import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client.js";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let on = true;
    api
      .get("/admin/stats")
      .then((res) => on && setStats(res.data.stats))
      .catch((err) =>
        on && setError(err?.response?.data?.message || "Failed to load")
      )
      .finally(() => on && setLoading(false));
    return () => {
      on = false;
    };
  }, []);

  if (loading) return <Loader center />;

  return (
    <section className="page">
      <div className="container">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-sub">Platform overview.</p>

        {error && <Alert kind="error">{error}</Alert>}

        {stats && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Users</div>
                <div className="stat-value">{stats.totalUsers}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Jobs</div>
                <div className="stat-value">{stats.totalJobs}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Applications</div>
                <div className="stat-value">{stats.totalApplications}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Seekers / Employers</div>
                <div className="stat-value">
                  <span className="stat-accent">{stats.seekers}</span> /{" "}
                  {stats.employers}
                </div>
              </div>
            </div>

            <div className="flex gap-12 mt-24 flex-wrap">
              <Link to="/admin/users" className="btn btn-primary">
                Manage Users
              </Link>
              <Link to="/admin/jobs" className="btn btn-outline">
                Manage Jobs
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AdminDashboard;
