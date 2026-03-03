import { Navigate, Outlet } from "react-router-dom";
import { getRole } from "../utils/auth.js";

const RoleRoute = ({ allowedRoles }) => {
  const role = getRole();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    if (role === "ADMIN") {
      return <Navigate to="/admin" replace />;
    }
    if (role === "HELPER") {
      return <Navigate to="/helper" replace />;
    }
    if (role === "CUSTOMER") {
      return <Navigate to="/customer" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;

