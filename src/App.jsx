import { Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout.jsx";
import SeekerLayout from "./layouts/SeekerLayout.jsx";
import EmployerLayout from "./layouts/EmployerLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import NotFound from "./pages/NotFound.jsx";

import SeekerDashboard from "./pages/seeker/SeekerDashboard.jsx";
import BrowseJobs from "./pages/seeker/BrowseJobs.jsx";
import ApplyJob from "./pages/seeker/ApplyJob.jsx";
import MyApplications from "./pages/seeker/MyApplications.jsx";
import SeekerProfile from "./pages/seeker/SeekerProfile.jsx";

import EmployerDashboard from "./pages/employer/EmployerDashboard.jsx";
import PostJob from "./pages/employer/PostJob.jsx";
import MyJobs from "./pages/employer/MyJobs.jsx";
import EmployerApplications from "./pages/employer/EmployerApplications.jsx";
import EmployerProfile from "./pages/employer/EmployerProfile.jsx";
import AIAnalyzer from "./pages/employer/AIAnalyzer.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import AdminJobs from "./pages/admin/AdminJobs.jsx";

const App = () => (
  <Routes>
    {/* Public pages */}
    <Route element={<PublicLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>

    {/* Seeker */}
    <Route
      element={
        <ProtectedRoute roles={["seeker"]}>
          <SeekerLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/seeker/dashboard" element={<SeekerDashboard />} />
      <Route path="/seeker/jobs" element={<BrowseJobs />} />
      <Route path="/seeker/jobs/:id/apply" element={<ApplyJob />} />
      <Route path="/seeker/applications" element={<MyApplications />} />
      <Route path="/seeker/profile" element={<SeekerProfile />} />
    </Route>

    {/* Employer */}
    <Route
      element={
        <ProtectedRoute roles={["employer"]}>
          <EmployerLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/employer/dashboard" element={<EmployerDashboard />} />
      <Route path="/employer/post-job" element={<PostJob />} />
      <Route path="/employer/jobs" element={<MyJobs />} />
      <Route path="/employer/applications" element={<EmployerApplications />} />
      <Route path="/employer/ai-analyzer" element={<AIAnalyzer />} />
      <Route path="/employer/profile" element={<EmployerProfile />} />
    </Route>

    {/* Admin */}
    <Route
      element={
        <ProtectedRoute roles={["admin"]}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/jobs" element={<AdminJobs />} />
    </Route>

    <Route path="/home" element={<Navigate to="/" replace />} />
    <Route element={<PublicLayout />}>
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default App;
