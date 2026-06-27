const About = () => (
  <section className="page">
    <div className="container">
      <h1 className="page-title">About Job Portal</h1>
      <p className="page-sub">
        A modern MERN stack hiring platform with Google Gemini AI.
      </p>

      <div className="card glass" style={{ padding: 32 }}>
        <h2>Our Mission</h2>
        <p>
          Build a fast, beautiful, and honest hiring experience. Job seekers
          shouldn't shout into the void, and employers shouldn't drown in
          unranked resumes.
        </p>
        <h2 className="mt-24">What we do</h2>
        <p>
          Every application is scored by Google Gemini against the actual job
          description and required skills. Employers see a ranked list with
          matched skills, missing skills, an AI summary, and a hiring
          recommendation — so they can focus on the best fits.
        </p>
        <h2 className="mt-24">The Stack</h2>
        <p className="text-dim">
          React (Vite) · React Router · Axios · Node.js · Express · MongoDB ·
          Mongoose · JWT · Multer · Google Gemini API.
        </p>
      </div>
    </div>
  </section>
);

export default About;
