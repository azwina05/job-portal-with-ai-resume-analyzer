import { useEffect, useState } from "react";
import api from "../../api/client.js";
import Loader from "../../components/Loader.jsx";
import Alert from "../../components/Alert.jsx";
import Button from "../../components/Button.jsx";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data.users || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      load();
    } catch (err) {
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <Loader center />;

  return (
    <section className="page">
      <div className="container">
        <h1 className="page-title">Users</h1>
        <p className="page-sub">All registered users.</p>
        {error && <Alert kind="error">{error}</Alert>}

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className="skill-pill">{u.role}</span>
                  </td>
                  <td className="small text-dim">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => remove(u._id)}
                    >
                      Delete
                    </Button>
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

export default AdminUsers;
