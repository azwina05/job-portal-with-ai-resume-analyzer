import { useEffect, useMemo, useState } from "react";
import api from "../../api/client.js";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";

const AIAnalyzer = () => {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobFilter, setJobFilter] = useState("");

  useEffect(() => {
    let on = true;
    api
      .get("/applications/employer")
      .then((res) => on && setApps(res.data.applications || []))
      .catch((err) =>
        on && setError(err?.response?.data?.message || "Failed to load")
      )
      .finally(() => on && setLoading(false));
    return () => {
      on = false;
    };
  }, []);

  const jobs = useMemo(() => {
    const m = new Map();
    apps.forEach((a) => {
      if (a.jobId?._id) m.set(a.jobId._id, a.jobId.title);
    });
    return Array.from(m, ([id, title]) => ({ id, title }));
  }, [apps]);

  const filtered = useMemo(() => {
    const list = jobFilter
      ? apps.filter((a) => a.jobId?._id === jobFilter)
      : apps;
    return [...list].sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
  }, [apps, jobFilter]);

  if (loading) return <Loader center />;

  return (
    <section className="page">
      <div className="container">
        <h1 className="page-title">AI Resume Analyzer</h1>
        <p className="page-sub">
          Candidates ranked by Gemini AI match score against your job
          descriptions.
        </p>

        {error && <Alert kind="error">{error}</Alert>}

        <div className="toolbar">
          <select
            className="select"
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            style={{ maxWidth: 360 }}
          >
            <option value="">All jobs</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="card text-center">
            <p>No applications to analyze yet.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Candidate</th>
                  <th>Job</th>
                  <th>AI Score</th>
                  <th>Matched</th>
                  <th>Missing</th>
                  <th>Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={a._id}>
                    <td>{i + 1}</td>
                    <td>
                      <div className="font-bold">
                        {a.seekerId?.name || "—"}
                      </div>
                      <div className="small text-dim">
                        {a.seekerId?.email || ""}
                      </div>
                    </td>
                    <td>
                      <div className="font-bold">{a.jobId?.title || "—"}</div>
                      <div className="small text-dim">
                        {a.jobId?.company || ""}
                      </div>
                    </td>
                    <td>
                      <span className="ai-score">{a.aiScore}%</span>
                    </td>
                    <td className="small">
                      {(a.matchedSkills || []).slice(0, 4).join(", ") || "—"}
                    </td>
                    <td className="small">
                      {(a.missingSkills || []).slice(0, 4).join(", ") || "—"}
                    </td>
                    <td className="small text-dim">
                      {a.aiRecommendation || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default AIAnalyzer;
