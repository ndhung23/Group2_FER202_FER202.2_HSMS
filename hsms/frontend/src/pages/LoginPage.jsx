import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card } from "react-bootstrap";
import { login } from "../api/client.js";
import { setAuth } from "../utils/auth.js";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login({ phone, password });
      const { token, role } = res.data.data;
      setAuth(token, role);

      if (role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else if (role === "HELPER") {
        navigate("/helper", { replace: true });
      } else {
        navigate("/customer", { replace: true });
      }
    } catch (error) {
      // Stub: chỉ alert lỗi đơn giản
      alert("Login failed (stub). Kiểm tra backend stub.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title className="mb-3">Đăng nhập</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="loginPhone">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ví dụ: 0900000000"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="loginPassword">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu bất kỳ (stub)"
            />
          </Form.Group>

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default LoginPage;

