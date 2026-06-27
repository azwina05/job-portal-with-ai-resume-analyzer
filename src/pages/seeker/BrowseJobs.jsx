import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client.js";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/jobs", {
        params: { q: q || undefined, location: location || undefined },
      });
      setJobs(data.jobs || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    load();
  };

  return (
    <section className="page">
      <div className="container">
        <h1 className="page-title">Browse Jobs</h1>
        <p className="page-sub">Find your next opportunity.</p>

        <form onSubmit={onSearch} className="toolbar">
          <input
            className="input"
            placeholder="Search title, company, or skill..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <input
            className="input"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{ maxWidth: 220 }}
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
          {(q || location) && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setQ("");
                setLocation("");
                setTimeout(load, 0);
              }}
            >
              Clear
            </button>
          )}
        </form>

        {error && <Alert kind="error">{error}</Alert>}

        {loading ? (
          <Loader center />
        ) : jobs.length === 0 ? (
          <div className="card text-center">
            <p>No jobs found. Try a different search.</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((j) => (
              <article key={j._id} className="job-card">
                <div>
                  <div className="job-title">{j.title}</div>
                  <div className="job-company">{j.company}</div>
                </div>
                <div className="job-meta">
                  <span>📍 {j.location}</span>
                  {j.salary && <span>💰 {j.salary}</span>}
                  {j.category && <span>🏷️ {j.category}</span>}
                </div>
                <p className="job-desc">
                  {(j.description || "").slice(0, 160)}
                  {(j.description || "").length > 160 ? "..." : ""}
                </p>
                <div>
                  {(j.requiredSkills || []).slice(0, 6).map((s) => (
                    <span key={s} className="skill-pill">
                      {s}
                    </span>
                  ))}
                </div>
                <Link
                  to={`/seeker/jobs/${j._id}/apply`}
                  className="btn btn-primary btn-sm mt-8"
                >
                  Apply Now
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BrowseJobs;
