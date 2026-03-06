import { useState } from "react";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { setAuth } from "../../utils/auth";
import axios from "axios";
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState(location.state?.username || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      //alert("Vui lòng nhập đầy đủ username và password");
      setError("Vui lòng nhập đầy đủ username và password");
      return;
    }
    try {
      const res = await axios.get("http://localhost:9999/users", {
        params: {
          username: username,
          passwordHash: password
        }
      });
      const users = res.data;
      if (!users || users.length === 0) {
        //alert("Sai username hoặc password");
        setError("Sai tài khoản hoặc mật khẩu.");
        return;
      }
      const user = users[0];
      setAuth("mock-token", user.role);
      if (user.role === "ADMIN") navigate("/admin");
      else if (user.role === "HELPER") navigate("/helper");
      else navigate("/customer");
    } catch (error) {
      console.error(error);
      alert("Có lỗi khi đăng nhập");
    }
  };

  return (
    <div className="d-flex justify-content-center" style={{ minHeight: "70vh" }}>
      <div className="w-100" style={{ maxWidth: 440 }}>
        <div className="mb-3">
          <Link to="/" className="text-decoration-none">
            ← Về trang chủ
          </Link>
        </div>

        <Card className="shadow-sm border-0 rounded-4">
          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="hj-logo mb-2">H</div>
              <div className="fw-bold" style={{ color: "#f59f00" }}>
                HomeCare
              </div>
              <h2 className="mt-2 mb-1">Chào mừng trở lại!</h2>
              <div className="hj-muted">
                Đăng nhập để quản lý các dịch vụ của bạn.
              </div>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="username123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              {
                error && (
                  <Alert variant="danger">{error}</Alert>
                )
              }

              <Row className="align-items-center mb-3">
                <Col>
                  <Form.Check type="checkbox" label="Ghi nhớ đăng nhập" />
                </Col>
                <Col xs="auto">
                  <Button
                    variant="link"
                    className="p-0 text-decoration-none"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Link to="/forgot-password" className="text-decoration-none">
                      Quên mật khẩu?
                    </Link>
                    
                  </Button>
                </Col>
              </Row>

              <Button
                type="submit"
                className="w-100 rounded-3"
                style={{
                  background:
                    "linear-gradient(90deg, #0d6efd 0%, #0b5ed7 50%, #0aa2c0 100%)",
                  border: "none",
                  boxShadow: "0 12px 30px rgba(13,110,253,0.35)"
                }}
              >
                Đăng nhập →
              </Button>

              <div className="text-center my-3 hj-muted">Hoặc đăng nhập nhanh</div>

              <Button
                variant="light"
                className="w-100 border rounded-3 mb-3"
                onClick={(e) => e.preventDefault()}
              >
                Tiếp tục với Google
              </Button>

              <div className="text-center hj-muted">
                Chưa có tài khoản?{" "}
                <Link to="/register" className="text-decoration-none">
                  Đăng ký ngay
                </Link>
              </div>
            </Form>

            <hr className="my-4" />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}