import { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { setAuth } from "../utils/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Khung mô phỏng: nếu username chứa từ khoá thì set role tương ứng
    let role = "CUSTOMER";
    if (username.toLowerCase().includes("admin")) role = "ADMIN";
    if (username.toLowerCase().includes("helper")) role = "HELPER";

    setAuth("mock-token", role);

    if (role === "ADMIN") navigate("/admin");
    else if (role === "HELPER") navigate("/helper");
    else navigate("/customer");
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
                HomeJoy
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
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

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
                    Quên mật khẩu?
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

            <div className="hj-muted" style={{ fontSize: 13 }}>
              (Demo khung) Gợi ý nhanh:
              <br />
              • Nhập username chứa <strong>admin</strong> → vào trang Admin
              <br />
              • Chứa <strong>helper</strong> → vào trang Helper
              <br />
              • Khác → vào trang Khách hàng
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}