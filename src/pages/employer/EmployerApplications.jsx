import { useEffect, useState } from "react";
import api from "../../api/client.js";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";
import Button from "../../components/Button.jsx";

const statusClass = (s) =>
  s === "accepted"
    ? "status-pill status-accepted"
    : s === "rejected"
    ? "status-pill status-rejected"
    : "status-pill status-pending";

const EmployerApplications = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/applications/employer");
      setApps(data.applications || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id, status) => {
    setBusy((b) => ({ ...b, [id]: status }));
    try {
      const { data } = await api.put(`/applications/${id}/status`, { status });
      setApps((arr) =>
        arr.map((a) => (a._id === id ? { ...a, status: data.application.status } : a))
      );
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    } finally {
      setBusy((b) => ({ ...b, [id]: null }));
    }
  };

  if (loading) return <Loader center />;

  return (
    <section className="page">
      <div className="container">
        <h1 className="page-title">Applications</h1>
        <p className="page-sub">
          Review candidates with AI-powered scoring and decide quickly.
        </p>

        {error && <Alert kind="error">{error}</Alert>}

        {apps.length === 0 ? (
          <div className="card text-center">
            <p>No applications received yet.</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {apps.map((a) => (
              <article key={a._id} className="job-card">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="job-title">
                      {a.seekerId?.name || "Candidate"}
                    </div>
                    <div className="small text-dim">
                      {a.seekerId?.email || ""}
                    </div>
                  </div>
                  <span className={statusClass(a.status)}>{a.status}</span>
                </div>

                <div className="small text-dim">
                  Applied for{" "}
                  <span className="text-accent">
                    {a.jobId?.title || "—"}
                  </span>{" "}
                  · {a.jobId?.company || ""}
                </div>

                <div className="flex gap-12 items-center flex-wrap">
                  <span className="ai-score">AI Score: {a.aiScore}%</span>
                  {a.resumeFile && (
                    <a
                      href={`/uploads/${a.resumeFile}`}
                      target="_blank"
                      rel="noreferrer"
                      className="small text-accent"
                    >
                      📎 {a.resumeOriginalName || "Resume"}
                    </a>
                  )}
                </div>

                {a.matchedSkills?.length > 0 && (
                  <div>
                    <div className="small text-dim mb-8">Matched skills</div>
                    {a.matchedSkills.map((s) => (
                      <span key={s} className="skill-pill matched">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                {a.missingSkills?.length > 0 && (
                  <div>
                    <div className="small text-dim mb-8">Missing skills</div>
                    {a.missingSkills.map((s) => (
                      <span key={s} className="skill-pill missing">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                {a.aiSummary && <p className="small text-dim">{a.aiSummary}</p>}
                {a.aiRecommendation && (
                  <p className="small">
                    <strong className="text-accent">AI says:</strong>{" "}
                    {a.aiRecommendation}
                  </p>
                )}

                <div className="flex gap-8 mt-8">
                  <Button
                    size="sm"
                    variant="success"
                    disabled={!!busy[a._id]}
                    onClick={() => setStatus(a._id, "accepted")}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={!!busy[a._id]}
                    onClick={() => setStatus(a._id, "rejected")}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={!!busy[a._id]}
                    onClick={() => setStatus(a._id, "pending")}
                  >
                    Reset
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EmployerApplications;
