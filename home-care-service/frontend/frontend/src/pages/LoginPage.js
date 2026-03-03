import { Button } from "react-bootstrap";
import { setAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const loginAdmin = () => {
    setAuth("token", "ADMIN");
    navigate("/admin");
  };

  const loginCustomer = () => {
    setAuth("token", "CUSTOMER");
    navigate("/customer");
  };

  const loginHelper = () => {
    setAuth("token", "HELPER");
    navigate("/helper");
  };

  return (
    <>
      <h1>Login Page</h1>
      <Button onClick={loginAdmin} className="me-2">Login Admin</Button>
      <Button onClick={loginCustomer} className="me-2">Login Customer</Button>
      <Button onClick={loginHelper}>Login Helper</Button>
    </>
  );
}