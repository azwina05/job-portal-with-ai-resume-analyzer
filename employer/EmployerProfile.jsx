import { useState } from "react";
import api from "../../api/client.js";
import { useAuth } from "../../auth/AuthContext.jsx";
import Alert from "../../components/Alert.jsx";
import Button from "../../components/Button.jsx";

const EmployerProfile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    setSaving(true);
    try {
      const { data } = await api.put("/auth/profile", { name });
      setUser(data.user);
      localStorage.setItem("jp_user", JSON.stringify(data.user));
      setMsg("Profile updated.");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="page">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 className="page-title">Employer Profile</h1>
        <p className="page-sub">Keep your details up to date.</p>

        <div className="card">
          {msg && <Alert kind="success">{msg}</Alert>}
          {err && <Alert kind="error">{err}</Alert>}

          <form className="form mt-16" onSubmit={save}>
            <div>
              <label className="label">Email</label>
              <input className="input" value={user?.email || ""} disabled />
            </div>
            <div>
              <label className="label">Role</label>
              <input className="input" value={user?.role || ""} disabled />
            </div>
            <div>
              <label className="label">Name / Company contact</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EmployerProfile;
