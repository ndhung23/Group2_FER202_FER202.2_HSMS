import { Navigate, Outlet } from "react-router-dom";
import { getRole } from "../utils/auth";

const HOME = {
  ADMIN: "/admin",
  CUSTOMER: "/customer",
  HELPER: "/helper"
};

export default function RoleRoute({ allow }) {
  //Kiểm tra role của người dùng, nếu không có quyền truy cập thì 
  // chuyển hướng đến trang chủ tương ứng với role của họ
  const role = getRole();

  if (!allow.includes(role)) {
    return <Navigate to={HOME[role]} replace />;
  }

  return <Outlet />;
}