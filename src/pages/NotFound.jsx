import { Link } from "react-router-dom";

const NotFound = () => (
  <section className="page">
    <div className="container text-center" style={{ maxWidth: 560 }}>
      <h1 style={{ fontSize: "5rem", margin: 0 }}>404</h1>
      <h2>Page not found</h2>
      <p className="text-dim">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary mt-16">
        Back to Home
      </Link>
    </div>
  </section>
);

export default NotFound;
