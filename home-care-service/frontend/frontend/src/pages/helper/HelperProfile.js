import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, Button, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import HelperSidebar from './components/HelperSidebar';

export default function HelperProfile() {
  const [helper, setHelper] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setHelper(JSON.parse(storedUser));
    }
  }, []);

  if (!helper) return null;

  return (
    <div className="dashboard-container" style={{ minHeight: "80vh", padding: "20px" }}>
      <Row className="g-4">
        {/* Left Sidebar Menu */}
        <Col xs={12} md={4} lg={3}>
          <HelperSidebar />
        </Col>

        {/* Right Content */}
        <Col xs={12} md={8} lg={9}>
          <div className="mb-4">
            <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
              Thông tin bản thân
            </h2>
            <div style={{ color: "#64748b" }}>
              Chi tiết hồ sơ định danh cá nhân của bạn trên hệ thống. (Chỉ xem)
            </div>
          </div>

          <Card className="shadow-sm border-0 rounded-4">
            <Card.Header className="bg-white border-0 rounded-top-4 p-4 d-flex justify-content-between align-items-center">
               <div className="fw-bold fs-5 text-dark">Hồ sơ cá nhân</div>
               <Badge bg={helper.status === 'ACTIVE' ? 'success' : 'danger'} className="px-3 py-2">
                 Trạng thái: {helper.status}
               </Badge>
            </Card.Header>
            <Card.Body className="p-4 pt-0">
               <Row className="g-4">
                 <Col md={6}>
                    <Form.Group>
                        <Form.Label className="text-muted fw-semibold" style={{ fontSize: "14px" }}>Họ và tên</Form.Label>
                        <Form.Control readOnly value={helper.fullName || ""} className="bg-light fw-bold" />
                    </Form.Group>
                 </Col>
                 <Col md={6}>
                    <Form.Group>
                        <Form.Label className="text-muted fw-semibold" style={{ fontSize: "14px" }}>Mã định danh (ID)</Form.Label>
                        <Form.Control readOnly value={helper.id || ""} className="bg-light" />
                    </Form.Group>
                 </Col>
                 <Col md={6}>
                    <Form.Group>
                        <Form.Label className="text-muted fw-semibold" style={{ fontSize: "14px" }}>Email</Form.Label>
                        <Form.Control readOnly value={helper.email || ""} className="bg-light" />
                    </Form.Group>
                 </Col>
                 <Col md={6}>
                    <Form.Group>
                        <Form.Label className="text-muted fw-semibold" style={{ fontSize: "14px" }}>Số điện thoại</Form.Label>
                        <Form.Control readOnly value={helper.phone || ""} className="bg-light" />
                    </Form.Group>
                 </Col>
                 <Col md={6}>
                    <Form.Group>
                        <Form.Label className="text-muted fw-semibold" style={{ fontSize: "14px" }}>Tên đăng nhập (Username)</Form.Label>
                        <Form.Control readOnly value={helper.username || ""} className="bg-light" />
                    </Form.Group>
                 </Col>
                 <Col md={6}>
                    <Form.Group>
                        <Form.Label className="text-muted fw-semibold" style={{ fontSize: "14px" }}>Tuổi</Form.Label>
                        <Form.Control readOnly value={helper.age || ""} className="bg-light" />
                    </Form.Group>
                 </Col>
                 <Col md={6}>
                    <Form.Group>
                        <Form.Label className="text-muted fw-semibold" style={{ fontSize: "14px" }}>Giới tính</Form.Label>
                        <Form.Control readOnly value={helper.gender === 'MALE' ? 'Nam' : helper.gender === 'FEMALE' ? 'Nữ' : 'Khác'} className="bg-light" />
                    </Form.Group>
                 </Col>
                 <Col md={6}>
                    <Form.Group>
                        <Form.Label className="text-muted fw-semibold" style={{ fontSize: "14px" }}>Ngày tham gia</Form.Label>
                        <Form.Control readOnly value={helper.createdAt ? new Date(helper.createdAt).toLocaleDateString('vi-VN') : ""} className="bg-light" />
                    </Form.Group>
                 </Col>
               </Row>

               <hr className="my-4" />
               <div className="d-flex justify-content-between align-items-center">
                  <div className="text-muted" style={{ fontSize: "14px", maxWidth: "60%" }}>
                     *Lưu ý: Bạn không được phép tự ý thay đổi thông tin định danh nhằm bảo vệ an toàn cho hệ thống. Liên hệ với Quản trị viên nếu có sai sót.
                  </div>
                  <Button variant="outline-primary" onClick={() => navigate('/change-password')}>
                     Thay đổi mật khẩu đăng nhập
                  </Button>
               </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
