import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/client.js";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";
import Button from "../../components/Button.jsx";

const ApplyJob = () => {
  const { id } = useParams();
  const nav = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [resumeFile, setResumeFile] = useState(null);
  const [skills, setSkills] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let on = true;
    api
      .get(`/jobs/${id}`)
      .then((res) => on && setJob(res.data.job))
      .catch((err) =>
        on && setError(err?.response?.data?.message || "Job not found")
      )
      .finally(() => on && setLoading(false));
    return () => {
      on = false;
    };
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!resumeFile && !resumeText.trim()) {
      setError("Please upload a resume or paste your resume text.");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      if (resumeFile) fd.append("resume", resumeFile);
      if (skills) fd.append("skills", skills);
      if (resumeText.trim()) fd.append("resumeText", resumeText.trim());

      const { data } = await api.post(`/applications/apply/${id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(
        `Application submitted. AI Score: ${data.application?.aiScore ?? 0}%`
      );
      setTimeout(() => nav("/seeker/applications"), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || "Application failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader center />;
  if (!job)
    return (
      <section className="page">
        <div className="container">
          <Alert kind="error">{error || "Job not found"}</Alert>
          <Link to="/seeker/jobs" className="btn btn-outline mt-16">
            Back to Jobs
          </Link>
        </div>
      </section>
    );

  return (
    <section className="page">
      <div className="container" style={{ maxWidth: 900 }}>
        <Link to="/seeker/jobs" className="small text-dim">
          ← Back to Jobs
        </Link>

        <div className="card mt-16">
          <h1 className="page-title">{job.title}</h1>
          <div className="job-company">{job.company}</div>
          <div className="job-meta mt-8">
            <span>📍 {job.location}</span>
            {job.salary && <span>💰 {job.salary}</span>}
            {job.category && <span>🏷️ {job.category}</span>}
          </div>
          <p className="text-dim mt-16">{job.description}</p>
          <div className="mt-8">
            {(job.requiredSkills || []).map((s) => (
              <span key={s} className="skill-pill">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="card mt-24">
          <h2>Apply for this position</h2>
          {error && <Alert kind="error">{error}</Alert>}
          {success && <Alert kind="success">{success}</Alert>}

          <form className="form mt-16" onSubmit={submit}>
            <div>
              <label className="label">Resume (PDF, DOC, or DOCX)</label>
              <input
                className="input"
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              />
              <p className="small text-muted mt-8">
                Max 5 MB. If your PDF can't be parsed, paste your resume text
                below as a fallback.
              </p>
            </div>

            <div>
              <label className="label">Resume text (optional fallback)</label>
              <textarea
                className="textarea"
                placeholder="Paste your resume text here if PDF parsing fails..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>

            <div>
              <label className="label">Skills (optional, comma-separated)</label>
              <input
                className="input"
                placeholder="React, Node.js, MongoDB"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>

            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Application"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ApplyJob;
