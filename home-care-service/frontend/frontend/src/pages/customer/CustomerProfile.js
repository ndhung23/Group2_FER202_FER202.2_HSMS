import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CustomerSidebar from './components/CustomerSidebar';

export default function CustomerProfile() {
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    yearOfBirth: "",
    gender: "MALE",
    avatarUrl: ""
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCustomer(parsedUser);
      setFormData({
        fullName: parsedUser.fullName || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
        yearOfBirth: (new Date().getFullYear() - (parseInt(parsedUser.age) || 20)).toString(),
        gender: parsedUser.gender || "MALE",
        avatarUrl: parsedUser.avatarUrl || ""
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMsg("");
    try {
      // Calculate age before sending
      const calculatedAge = Math.max(0, new Date().getFullYear() - parseInt(formData.yearOfBirth || new Date().getFullYear())).toString();
      const payload = { ...formData, age: calculatedAge };
      delete payload.yearOfBirth;

      // Patch on JSON db
      await axios.patch(`http://localhost:9999/users/${customer.id}`, payload);

      // Update local session
      const updatedUser = { ...customer, ...payload };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setCustomer(updatedUser);

      setMsg("Lưu thông tin thành công!");
    } catch (err) {
      setError("Máy chủ từ chối cập nhật do lỗi mạng.");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  if (!customer) return null;

  return (
    <div className="dashboard-container" style={{ minHeight: "80vh", padding: "20px" }}>
      <Row className="g-4">
        {/* Left Sidebar Menu */}
        <Col xs={12} md={4} lg={3}>
          <CustomerSidebar />
        </Col>

        {/* Right Content */}
        <Col xs={12} md={8} lg={9}>
          <div className="mb-4 d-flex justify-content-between">
            <div>
              <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
                Hồ sơ Khách Hàng
              </h2>
              <div style={{ color: "#64748b" }}>
                Cập nhật thông tin liên lạc để Helper dễ dàng hỗ trợ bạn hơn.
              </div>
            </div>
          </div>

          <Card className="shadow-sm border-0 rounded-4">
            <Card.Header className="bg-white border-0 rounded-top-4 p-4 d-flex justify-content-between align-items-center">
              <div className="fw-bold fs-5 text-dark">Chỉnh sửa Cá nhân</div>
              <Badge bg={customer.status === 'ACTIVE' ? 'success' : 'danger'} className="px-3 py-2">
                Thành viên (Trạng thái: {customer.status})
              </Badge>
            </Card.Header>
            <Card.Body className="p-4 pt-1">
              {msg && <Alert variant="success">{msg}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleUpdate}>
                <Row className="g-4">
                  <Col md={12} className="text-center mb-3">
                    {formData.avatarUrl ? (
                      <img
                        src={formData.avatarUrl}
                        alt="Avatar"
                        className="rounded-circle shadow-sm mb-3"
                        style={{ width: "100px", height: "100px", objectFit: "cover", border: "2px solid #0d6efd" }}
                      />
                    ) : (
                      <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3 fw-bold shadow-sm"
                        style={{ width: "100px", height: "100px", fontSize: "32px", cursor: "pointer" }}
                        title="Đổi ảnh đại diện"
                      >
                        {customer.fullName ? customer.fullName.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                    <Form.Control
                      size="sm"
                      placeholder="Dán link ảnh đại diện (URL) của bạn vào đây..."
                      name="avatarUrl"
                      value={formData.avatarUrl}
                      onChange={handleChange}
                      style={{ maxWidth: "300px", margin: "0 auto" }}
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-muted fw-semibold" style={{ fontSize: "14px" }}>Họ và tên</Form.Label>
                      <Form.Control required name="fullName" value={formData.fullName} onChange={handleChange} className="fw-bold text-dark" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-muted fw-semibold" style={{ fontSize: "14px" }}>Mã ID (Không đổi)</Form.Label>
                      <Form.Control readOnly value={customer.id || ""} className="bg-light" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-muted fw-semibold" style={{ fontSize: "14px" }}>Email *</Form.Label>
                      <Form.Control readOnly type="email" name="email" value={formData.email} onChange={handleChange} className="bg-light" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-muted fw-semibold" style={{ fontSize: "14px" }}>Số điện thoại *</Form.Label>
                      <Form.Control readOnly name="phone" value={formData.phone} onChange={handleChange} className="bg-light" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="text-muted fw-semibold" style={{ fontSize: "14px" }}>Tên đăng nhập (Username)</Form.Label>
                      <Form.Control readOnly value={customer.username || ""} className="bg-light" />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="text-muted fw-semibold" style={{ fontSize: "14px" }}>Năm sinh</Form.Label>
                      <Form.Control type="number" name="yearOfBirth" value={formData.yearOfBirth} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="text-muted fw-semibold" style={{ fontSize: "14px" }}>Độ tuổi (Tự tính)</Form.Label>
                      <Form.Control readOnly value={Math.max(0, new Date().getFullYear() - parseInt(formData.yearOfBirth || new Date().getFullYear()))} className="bg-light fw-bold" />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="text-muted fw-semibold" style={{ fontSize: "14px" }}>Giới tính</Form.Label>
                      <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="MALE">Nam</option>
                        <option value="FEMALE">Nữ</option>
                        <option value="OTHER">Chưa rõ</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                </Row>

                <hr className="my-4" />
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <Button variant="outline-warning" onClick={() => navigate('/change-password')}>
                    🔑 Thay đổi Mật Khẩu Đăng Nhập
                  </Button>
                  <Button variant="primary" type="submit" disabled={loading} className="px-4 shadow-sm">
                    {loading ? "Đang xử lý..." : "Lưu Thay Đổi"}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
