import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../utils/auth";

//Kiểm tra token xem người dùng đã đăng nhập chưa, nếu chưa thì chuyển hướng đến trang đăng nhập
export default function ProtectedRoute() {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}