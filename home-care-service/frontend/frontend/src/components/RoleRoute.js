import { Navigate, Outlet } from "react-router-dom";
import { getRole } from "../utils/auth";

const HOME = {
  ADMIN: "/admin",
  CUSTOMER: "/customer",
  HELPER: "/helper"
};

export default function RoleRoute({ allow }) {
  const role = getRole();

  if (!allow.includes(role)) {
    return <Navigate to={HOME[role]} replace />;
  }

  return <Outlet />;
}