import { useState } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Khung demo: chỉ alert, chưa gọi API
    alert("Đăng ký (UI khung) – chưa kết nối backend.");
  };

  return (
    <div className="d-flex justify-content-center" style={{ minHeight: "70vh" }}>
      <div className="w-100" style={{ maxWidth: 520 }}>
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
              <h2 className="mt-2 mb-1">Tạo tài khoản mới</h2>
              <div className="hj-muted">
                Bắt đầu trải nghiệm dịch vụ tuyệt vời cùng HomeJoy.
              </div>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="username123"
                />
              </Form.Group>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Họ</Form.Label>
                    <Form.Control
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Nguyễn"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Tên</Form.Label>
                    <Form.Control
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="An"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0901 234 567"
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </Form.Group>

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
                Đăng ký tài khoản
              </Button>

              <div className="text-center hj-muted mt-3">
                Đã có tài khoản?{" "}
                <Link to="/login" className="text-decoration-none">
                  Đăng nhập
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default RegisterPage;