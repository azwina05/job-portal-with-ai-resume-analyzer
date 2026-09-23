import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client.js";
import Alert from "../../components/Alert.jsx";
import Button from "../../components/Button.jsx";

const empty = {
  title: "",
  company: "",
  category: "",
  location: "",
  salary: "",
  requiredSkills: "",
  description: "",
};

const PostJob = () => {
  const nav = useNavigate();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title || !form.company || !form.description) {
      setError("Title, company, and description are required.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/jobs", form);
      nav("/employer/jobs");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to post job.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page">
      <div className="container" style={{ maxWidth: 820 }}>
        <h1 className="page-title">Post a New Job</h1>
        <p className="page-sub">Fill in the details below to publish.</p>

        <div className="card">
          {error && <Alert kind="error">{error}</Alert>}
          <form className="form mt-16" onSubmit={submit}>
            <div className="form-row">
              <div>
                <label className="label">Job Title</label>
                <input
                  className="input"
                  value={form.title}
                  onChange={update("title")}
                  required
                />
              </div>
              <div>
                <label className="label">Company</label>
                <input
                  className="input"
                  value={form.company}
                  onChange={update("company")}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div>
                <label className="label">Category</label>
                <input
                  className="input"
                  placeholder="Engineering, Design, Sales..."
                  value={form.category}
                  onChange={update("category")}
                />
              </div>
              <div>
                <label className="label">Location</label>
                <input
                  className="input"
                  placeholder="Remote, Bangalore..."
                  value={form.location}
                  onChange={update("location")}
                />
              </div>
            </div>
            <div className="form-row">
              <div>
                <label className="label">Salary</label>
                <input
                  className="input"
                  placeholder="₹6 - 10 LPA"
                  value={form.salary}
                  onChange={update("salary")}
                />
              </div>
              <div>
                <label className="label">Required Skills (comma-separated)</label>
                <input
                  className="input"
                  placeholder="React, Node.js, MongoDB"
                  value={form.requiredSkills}
                  onChange={update("requiredSkills")}
                />
              </div>
            </div>
            <div>
              <label className="label">Job Description</label>
              <textarea
                className="textarea"
                value={form.description}
                onChange={update("description")}
                required
              />
            </div>
            <Button type="submit" variant="primary" disabled={submitting}>
              {submitting ? "Posting..." : "Post Job"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PostJob;
