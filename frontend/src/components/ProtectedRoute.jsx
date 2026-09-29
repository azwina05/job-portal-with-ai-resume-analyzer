import { Navigate, useLocation } from "react-router-dom";
import { useAuth, routeForRole } from "../auth/AuthContext.jsx";
import Loader from "./Loader.jsx";

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loader-center">
        <span className="loader" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && roles.length && !roles.includes(user.role)) {
    return <Navigate to={routeForRole(user.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
