import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Table, Badge, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import CustomerSidebar from "./components/CustomerSidebar";

export default function CustomerDashboard() {
  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCustomer(parsedUser);
      fetchData(parsedUser.id);
    }
  }, []);

  const fetchData = async (customerId) => {
    try {
      const [resBookings, resServices] = await Promise.all([
        axios.get(`http://localhost:9999/bookings?customerId=${customerId}`),
        axios.get(`http://localhost:9999/services`)
      ]);
      
      const sortedBookings = (resBookings.data || []).sort(
         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setBookings(sortedBookings);
      setServices(resServices.data || []);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Customer Dashboard:", error);
    }
  };

  const getServiceName = (id) => {
    const s = services.find(srv => String(srv.id) === String(id));
    return s ? s.name : "Dịch vụ";
  };

  const formatCurrency = (value) => Number(value).toLocaleString("vi-VN") + " đ";

  const getStatusBadge = (status) => {
    if (status === "COMPLETED") return <Badge bg="success">Đã hoàn thành</Badge>;
    if (status === "PENDING") return <Badge bg="warning" text="dark">Chờ xác nhận</Badge>;
    if (status === "CONFIRMED") return <Badge bg="info">Đã xác nhận</Badge>;
    if (status === "IN_PROGRESS") return <Badge bg="primary">Đang thực hiện</Badge>;
    if (status === "CANCELLED") return <Badge bg="danger">Đã hủy</Badge>;
    return <Badge bg="secondary">{status}</Badge>;
  };

  const totalBookings = bookings.length;
  const inProgressBookings = bookings.filter(b => b.status === 'IN_PROGRESS' || b.status === 'CONFIRMED').length;
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;

  // Recent 2 bookings
  const recentBookings = bookings.slice(0, 2);

  return (
    <div className="dashboard-container" style={{ minHeight: "80vh", padding: "20px" }}>
      <Row className="g-4">
        {/* Sidebar */}
        <Col xs={12} md={4} lg={3}>
          <CustomerSidebar />
        </Col>

        {/* Content */}
        <Col xs={12} md={8} lg={9}>
          <h2 className="mb-2 fw-bold" style={{ color: "#1e293b" }}>
            Chào mừng trở lại, {customer ? customer.fullName.split(" ").pop() : "Bạn"}! 👋
          </h2>
          <div className="hj-muted mb-4">
            Hôm nay bạn muốn dọn dẹp nhà cửa hay thảnh thơi mua sắm?
          </div>

          <Row className="mb-4">
            <Col md={{ span: 8, offset: 2 }}>
              <div className="d-flex gap-2">
                 <Form.Control placeholder="Tìm kiếm đơn hàng, mã đơn, dịch vụ..." className="rounded-3" />
                 <Button variant="primary" className="rounded-3 px-4">Tìm kiếm</Button>
              </div>
            </Col>
          </Row>

          <Row className="g-3 mb-4">
            <Col md={3}>
              <Card className="shadow-sm border-0 rounded-4 h-100">
                <Card.Body>
                  <div className="hj-muted">Tổng đơn hàng</div>
                  <div className="fs-3 fw-bold mt-1 text-dark">{totalBookings}</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm border-0 rounded-4 h-100">
                <Card.Body>
                  <div className="hj-muted">Chờ/Đang thực hiện</div>
                  <div className="fs-3 fw-bold mt-1 text-primary">{inProgressBookings}</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm border-0 rounded-4 h-100">
                <Card.Body>
                  <div className="hj-muted">Đã hoàn thành</div>
                  <div className="fs-3 fw-bold mt-1 text-success">{completedBookings}</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="shadow-sm border-0 rounded-4 h-100 bg-light border border-secondary">
                <Card.Body>
                  <div className="hj-muted">Hạng thành viên</div>
                  <div className="fs-5 fw-bold mt-1 text-dark">Bạc (Silver)</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="shadow-sm border-0 rounded-4">
            <Card.Header className="d-flex justify-content-between align-items-center bg-white border-bottom p-4">
              <div className="fw-bold fs-5 text-dark">Yêu cầu gốc gần đây</div>
              <Button as={Link} to="/customer/bookings" variant="link" className="text-decoration-none px-0">
                Xem tất cả →
              </Button>
            </Card.Header>
            <Card.Body className="p-4">
              <Table striped bordered hover responsive className="mb-0 align-middle">
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc" }}>
                    <th className="py-2 text-center" style={{ width: "60px" }}>STT</th>
                    <th className="py-2">Mã đơn</th>
                    <th className="py-2">Dịch vụ</th>
                    <th className="py-2">Ngày đặt lịch</th>
                    <th className="py-2 text-center">Trạng thái</th>
                    <th className="py-2 text-end">Chi phí dự kiến</th>
                    <th className="py-2 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.length > 0 ? (
                    recentBookings.map((o, idx) => (
                      <tr key={o.id}>
                        <td className="text-center">{idx + 1}</td>
                        <td className="fw-bold text-primary">{o.bookingCode}</td>
                        <td className="fw-semibold text-secondary">{getServiceName(o.serviceId)}</td>
                        <td>{new Date(o.startTime).toLocaleString("vi-VN", { dateStyle: 'short', timeStyle: 'short' })}</td>
                        <td className="text-center">
                          {getStatusBadge(o.status)}
                        </td>
                        <td className="text-end fw-bold text-dark">
                          {formatCurrency(o.pricing?.total || 0)}
                        </td>
                        <td className="text-center">
                          <Button size="sm" variant="outline-primary" as={Link} to="/customer/bookings">
                            Chi tiết
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                     <tr>
                        <td colSpan="7" className="text-center py-4 text-muted">
                           Bạn chưa có đơn đặt dịch vụ nào. <Link to="/customer/bookings/new">Đặt ngay?</Link>
                        </td>
                     </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}