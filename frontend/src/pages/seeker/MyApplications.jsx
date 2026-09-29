import { useEffect, useState } from "react";
import api from "../../api/client.js";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";

const statusClass = (s) =>
  s === "accepted"
    ? "status-pill status-accepted"
    : s === "rejected"
    ? "status-pill status-rejected"
    : "status-pill status-pending";

const MyApplications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let on = true;
    api
      .get("/applications/my")
      .then((res) => on && setApps(res.data.applications || []))
      .catch((err) =>
        on && setError(err?.response?.data?.message || "Failed to load.")
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
        <h1 className="page-title">My Applications</h1>
        <p className="page-sub">Track your submissions and AI scores.</p>

        {error && <Alert kind="error">{error}</Alert>}

        {apps.length === 0 ? (
          <div className="card text-center">
            <p>You haven't applied to any jobs yet.</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {apps.map((a) => (
              <article key={a._id} className="job-card">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="job-title">
                      {a.jobId?.title || "Job"}
                    </div>
                    <div className="job-company">
                      {a.jobId?.company || ""}
                    </div>
                  </div>
                  <span className={statusClass(a.status)}>{a.status}</span>
                </div>

                <div className="job-meta">
                  <span>📍 {a.jobId?.location || "—"}</span>
                  <span className="ai-score">AI {a.aiScore}%</span>
                </div>

                {a.resumeFile && (
                  <a
                    href={`/uploads/${a.resumeFile}`}
                    target="_blank"
                    rel="noreferrer"
                    className="small text-accent"
                  >
                    📎 {a.resumeOriginalName || a.resumeFile}
                  </a>
                )}

                {a.matchedSkills?.length > 0 && (
                  <div>
                    <div className="small text-dim mb-8">Matched</div>
                    {a.matchedSkills.map((s) => (
                      <span key={s} className="skill-pill matched">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                {a.missingSkills?.length > 0 && (
                  <div>
                    <div className="small text-dim mb-8">Missing</div>
                    {a.missingSkills.map((s) => (
                      <span key={s} className="skill-pill missing">
                        {s}
                      </span>
                    ))}
                  </div>
                )}

                {a.aiSummary && (
                  <p className="small text-dim">{a.aiSummary}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyApplications;
