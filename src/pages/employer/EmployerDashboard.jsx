import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client.js";
import { useAuth } from "../../auth/AuthContext.jsx";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let on = true;
    Promise.all([
      api.get("/jobs/employer"),
      api.get("/applications/employer"),
    ])
      .then(([j, a]) => {
        if (!on) return;
        setJobs(j.data.jobs || []);
        setApps(a.data.applications || []);
      })
      .catch((err) =>
        on && setError(err?.response?.data?.message || "Failed to load.")
      )
      .finally(() => on && setLoading(false));
    return () => {
      on = false;
    };
  }, []);

  const totalJobs = jobs.length;
  const totalApps = apps.length;
  const pending = apps.filter((a) => a.status === "pending").length;
  const accepted = apps.filter((a) => a.status === "accepted").length;
  const rejected = apps.filter((a) => a.status === "rejected").length;

  return (
    <section className="page">
      <div className="container">
        <h1 className="page-title">
          Welcome, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="page-sub">Manage your jobs and applications.</p>

        {error && <Alert kind="error">{error}</Alert>}

        {loading ? (
          <Loader center />
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Jobs Posted</div>
                <div className="stat-value">{totalJobs}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Applications</div>
                <div className="stat-value">{totalApps}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Pending</div>
                <div className="stat-value">{pending}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Accepted / Rejected</div>
                <div className="stat-value">
                  <span className="stat-accent">{accepted}</span> / {rejected}
                </div>
              </div>
            </div>

            <div className="flex gap-12 mt-24 flex-wrap">
              <Link to="/employer/post-job" className="btn btn-primary">
                Post a New Job
              </Link>
              <Link to="/employer/jobs" className="btn btn-outline">
                My Jobs
              </Link>
              <Link to="/employer/applications" className="btn btn-ghost">
                View Applications
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default EmployerDashboard;
