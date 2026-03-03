import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card } from "react-bootstrap";
import { register } from "../api/client.js";

const RegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ fullName, phone, password, role });
      alert("Đăng ký stub thành công. Hãy đăng nhập.");
      navigate("/login", { replace: true });
    } catch (error) {
      alert("Register failed (stub). Kiểm tra backend stub.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title className="mb-3">Đăng ký</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="registerFullName">
            <Form.Label>Họ tên</Form.Label>
            <Form.Control
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nhập họ tên"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerPhone">
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="SĐT đăng nhập"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerPassword">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu bất kỳ (stub)"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="registerRole">
            <Form.Label>Vai trò</Form.Label>
            <Form.Select
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="CUSTOMER">Khách hàng</option>
              <option value="HELPER">Người giúp việc</option>
            </Form.Select>
          </Form.Group>

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default RegisterPage;

