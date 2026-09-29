import { useState } from "react";
import Alert from "../components/Alert.jsx";
import Button from "../components/Button.jsx";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className="page">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 className="page-title">Contact Us</h1>
        <p className="page-sub">We'd love to hear from you.</p>

        <div className="card">
          {sent && (
            <Alert kind="success">
              Thanks! Your message has been received. We'll get back to you
              soon.
            </Alert>
          )}
          <form className="form mt-16" onSubmit={submit}>
            <div>
              <label className="label">Your name</label>
              <input
                className="input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                className="input"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label">Message</label>
              <textarea
                className="textarea"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>
            <Button type="submit" variant="primary">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
