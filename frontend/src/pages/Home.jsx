import { Link } from "react-router-dom";
import { useAuth, routeForRole } from "../auth/AuthContext.jsx";

const features = [
  {
    icon: "⚡",
    title: "Fast Recruitment",
    text: "Post jobs quickly and connect with suitable candidates faster.",
  },
  {
    icon: "📄",
    title: "Resume Management",
    text: "Job seekers can upload resumes and apply for suitable jobs easily.",
  },
  {
    icon: "🎯",
    title: "Smart Application Tracking",
    text: "Track applications from submission to final decision in one place.",
  },
  {
    icon: "🤖",
    title: "AI Resume Analyzer",
    text: "Analyze resumes, generate match scores, and identify skill gaps.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create Account",
    text: "Register as a job seeker or employer.",
  },
  {
    number: "02",
    title: "Browse or Post Jobs",
    text: "Job seekers browse jobs and employers post openings.",
  },
  {
    number: "03",
    title: "Apply with Resume",
    text: "Candidates submit resumes for suitable job roles.",
  },
  {
    number: "04",
    title: "Track Applications",
    text: "Application status can be viewed and managed easily.",
  },
];

const Home = () => {
  const { user } = useAuth();
  const dest = user ? routeForRole(user.role) : "/register";

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <h1 className="hero-title">Apply Smarter. Hire Faster.</h1>

          <p className="hero-sub">
            A modern job portal where job seekers can find opportunities and
            employers can manage hiring easily in one place.
          </p>

          <div className="hero-actions">
            <Link to={dest} className="btn btn-primary">
              Get Started
            </Link>

            {!user && (
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="section" id="features">
        <div className="container">
          <h2 className="section-title">Why Choose Job Portal?</h2>

          <p className="section-sub">
            Everything needed for smarter hiring and better career growth.
          </p>

          <div className="features">
            {features.map((f) => (
              <div className="card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p className="text-dim small">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>

          <p className="section-sub">
            A simple process for job seekers and employers.
          </p>

          <div className="features">
            {steps.map((step) => (
              <div className="card" key={step.number}>
                <div className="feature-icon">{step.number}</div>
                <h3>{step.title}</h3>
                <p className="text-dim small">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="container">
          <div className="card glass" style={{ padding: 36 }}>
            <h2 className="text-center">About Job Portal</h2>

            <p
              className="text-center text-dim"
              style={{ maxWidth: 760, margin: "12px auto 0" }}
            >
              Job Portal connects job seekers and employers through a simple,
              secure, and professional recruitment system. It supports job
              posting, resume upload, application tracking, and smart resume
              analysis to make the hiring process easier.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;