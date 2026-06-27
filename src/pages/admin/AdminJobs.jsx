import { useEffect, useState } from "react";
import api from "../../api/client.js";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let on = true;
    api
      .get("/admin/jobs")
      .then((res) => on && setJobs(res.data.jobs || []))
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
        <h1 className="page-title">All Jobs</h1>
        <p className="page-sub">Every job posting on the platform.</p>
        {error && <Alert kind="error">{error}</Alert>}

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Posted By</th>
                <th>Location</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j._id}>
                  <td>{j.title}</td>
                  <td>{j.company}</td>
                  <td className="small text-dim">
                    {j.employerId?.name} ({j.employerId?.email})
                  </td>
                  <td>{j.location}</td>
                  <td className="small text-dim">
                    {new Date(j.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminJobs;
