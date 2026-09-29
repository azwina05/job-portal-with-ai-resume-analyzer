import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client.js";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";
import Button from "../../components/Button.jsx";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/jobs/employer");
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

  const startEdit = (job) => {
    setEditing(job._id);
    setEditForm({
      title: job.title,
      company: job.company,
      category: job.category || "",
      location: job.location || "",
      salary: job.salary || "",
      description: job.description,
      requiredSkills: (job.requiredSkills || []).join(", "),
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditForm({});
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/jobs/${id}`, editForm);
      cancelEdit();
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Update failed");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this job?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <Loader center />;

  return (
    <section className="page">
      <div className="container">
        <div className="flex justify-between items-center mb-16 flex-wrap gap-12">
          <div>
            <h1 className="page-title">My Jobs</h1>
            <p className="page-sub">Manage your job postings.</p>
          </div>
          <Link to="/employer/post-job" className="btn btn-primary">
            + Post Job
          </Link>
        </div>

        {error && <Alert kind="error">{error}</Alert>}

        {jobs.length === 0 ? (
          <div className="card text-center">
            <p>You haven't posted any jobs yet.</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((j) => (
              <article key={j._id} className="job-card">
                {editing === j._id ? (
                  <>
                    <input
                      className="input"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                    />
                    <input
                      className="input"
                      value={editForm.company}
                      onChange={(e) =>
                        setEditForm({ ...editForm, company: e.target.value })
                      }
                    />
                    <input
                      className="input"
                      value={editForm.location}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: e.target.value })
                      }
                    />
                    <input
                      className="input"
                      value={editForm.salary}
                      onChange={(e) =>
                        setEditForm({ ...editForm, salary: e.target.value })
                      }
                    />
                    <input
                      className="input"
                      placeholder="Skills, comma separated"
                      value={editForm.requiredSkills}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          requiredSkills: e.target.value,
                        })
                      }
                    />
                    <textarea
                      className="textarea"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                    />
                    <div className="flex gap-8">
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => saveEdit(j._id)}
                      >
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelEdit}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="job-title">{j.title}</div>
                        <div className="job-company">{j.company}</div>
                      </div>
                      <span
                        className={`status-pill ${
                          j.isActive ? "status-accepted" : "status-rejected"
                        }`}
                      >
                        {j.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="job-meta">
                      <span>📍 {j.location}</span>
                      {j.salary && <span>💰 {j.salary}</span>}
                    </div>
                    <p className="job-desc">
                      {(j.description || "").slice(0, 140)}...
                    </p>
                    <div>
                      {(j.requiredSkills || []).map((s) => (
                        <span key={s} className="skill-pill">
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-8 mt-8">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(j)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => remove(j._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyJobs;
