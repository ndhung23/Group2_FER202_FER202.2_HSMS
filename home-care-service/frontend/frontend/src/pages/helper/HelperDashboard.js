import React, { useEffect, useState, useMemo } from 'react';
import { Card, Row, Col, Button, Table, Badge, Form, Pagination } from "react-bootstrap";
import axios from 'axios';
import HelperSidebar from './components/HelperSidebar';

export default function HelperDashboard() {
  const [helper, setHelper] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [payouts, setPayouts] = useState([]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setHelper(parsedUser);
      fetchDashboardData(parsedUser.id);
    }
  }, []);

  const fetchDashboardData = async (helperId) => {
    try {
      const [resBookings, resServices, resReviews, resPayouts] = await Promise.all([
        axios.get(`http://localhost:9999/bookings?assignedHelperId=${helperId}`),
        axios.get(`http://localhost:9999/services`),
        axios.get(`http://localhost:9999/reviews?helperId=${helperId}`),
        axios.get(`http://localhost:9999/payouts?helperId=${helperId}`)
      ]);
      setBookings(resBookings.data || []);
      setServices(resServices.data || []);
      setReviews(resReviews.data || []);
      setPayouts(resPayouts.data || []);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Helper:", error);
    }
  };

  const getServiceName = (id) => {
    const s = services.find(srv => String(srv.id) === String(id));
    return s ? s.name : "Dịch vụ";
  };

  const formatCurrency = (value) => Number(value).toLocaleString("vi-VN") + " đ";

  const getStatusBadge = (status) => {
    if (status === "COMPLETED") return <Badge bg="success">Hoàn thành</Badge>;
    if (status === "CANCELLED") return <Badge bg="danger">Đã hủy</Badge>;
    if (status === "IN_PROGRESS") return <Badge bg="primary">Đang làm</Badge>;
    return <Badge bg="warning text-dark">Sắp diễn ra / Pending</Badge>;
  };

  // ----- THỐNG KÊ (STATISTICS) ----- //
  const now = new Date();
  
  // 1. Đơn hôm nay
  const todayBookings = bookings.filter(b => {
      const d = new Date(b.startTime);
      return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const countToday = todayBookings.length;

  // 2. Đơn tuần này (7 ngày qua)
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const countThisWeek = bookings.filter(b => new Date(b.startTime) >= oneWeekAgo && new Date(b.startTime) <= now).length;

  // 3. Thu nhập tuần này (tính theo Payouts PAID trong tuần)
  const weeklyPayouts = payouts.filter(p => p.status === 'PAID' && new Date(p.paidAt) >= oneWeekAgo && new Date(p.paidAt) <= now);
  const weeklyEarnings = weeklyPayouts.reduce((sum, p) => sum + (p.helperAmount || 0), 0);

  // 4. Đánh giá trung bình từ Reivews
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";


  // ----- BẢNG ĐƠN HÔM NAY (TODAY SCHEDULE) ----- //
  const filteredToday = useMemo(() => {
    return todayBookings.filter(b => {
      const keyword = search.trim().toLowerCase();
      const bCode = (b.bookingCode || "").toLowerCase();
      const srvInfo = services.find(srv => String(srv.id) === String(b.serviceId));
      const sName = (srvInfo ? srvInfo.name : "Dịch vụ").toLowerCase();
      return bCode.includes(keyword) || sName.includes(keyword);
    }).sort((a,b) => new Date(a.startTime) - new Date(b.startTime));
  }, [todayBookings, search, services]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredToday.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredToday.length / itemsPerPage);


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
              Xin chào, {helper ? helper.fullName : "Bạn"}!
            </h2>
            <div style={{ color: "#64748b" }}>
              Đây là bảng điều khiển và lịch trình công việc hôm nay của bạn.
            </div>
          </div>

          <Row className="g-3 mb-4">
            <Col md={6} lg={3}>
              <Card className="shadow-sm border-0 rounded-4 h-100">
                <Card.Body>
                  <div className="text-muted mb-1" style={{ fontSize: "14px" }}>Đơn hôm nay ({now.toLocaleDateString('vi-VN')})</div>
                  <div className="fs-3 fw-bold mt-1 text-primary">{countToday}</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="shadow-sm border-0 rounded-4 h-100">
                <Card.Body>
                  <div className="text-muted mb-1" style={{ fontSize: "14px" }}>Đơn tuần này (7 ngày qua)</div>
                  <div className="fs-3 fw-bold mt-1">{countThisWeek}</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="shadow-sm border-0 rounded-4 h-100">
                <Card.Body>
                  <div className="text-muted mb-1" style={{ fontSize: "14px" }}>Thu nhập tuần này</div>
                  <div className="fs-4 fw-bold mt-1 text-success">{formatCurrency(weeklyEarnings)}</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="shadow-sm border-0 rounded-4 h-100">
                <Card.Body>
                  <div className="text-muted mb-1" style={{ fontSize: "14px" }}>Đánh giá trung bình</div>
                  <div className="fs-3 fw-bold mt-1 text-warning">{avgRating} ★</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="shadow-sm border-0 rounded-4">
            <Card.Header className="bg-white border-0 rounded-top-4 pt-4 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="fw-bold fs-5" style={{ color: "#1e293b" }}>
                Lịch Làm Việc Hôm Nay
              </div>
              <Form.Control 
                placeholder="Tìm mã đơn, dịch vụ..." 
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-3"
                style={{ width: "250px" }}
              />
            </Card.Header>
            <Card.Body className="p-4">
              <Table hover responsive className="mb-0 align-middle">
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc" }}>
                    <th className="py-3">Mã đơn</th>
                    <th className="py-3">Dịch vụ</th>
                    <th className="py-3 text-center">Thời gian</th>
                    <th className="py-3 text-center">Trạng thái</th>
                    <th className="py-3 text-end">Giá trị (Gross)</th>
                    <th className="py-3 text-center">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((j) => (
                      <tr key={j.id}>
                        <td className="fw-semibold text-secondary">{j.bookingCode}</td>
                        <td className="fw-semibold text-dark">{getServiceName(j.serviceId)}</td>
                        <td className="text-center">
                          <div className="fw-bold">{new Date(j.startTime).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</div>
                          <div className="text-muted" style={{ fontSize: "12px" }}>
                            đến {new Date(j.endTime).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="text-center">
                          {getStatusBadge(j.status)}
                        </td>
                        <td className="text-end fw-semibold text-success">{formatCurrency(j.pricing?.total || 0)}</td>
                        <td className="text-center">
                          <Button size="sm" variant="outline-primary" className="rounded-3 px-3">
                            Xem & Cập nhật
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        Hôm nay bạn không có lịch hẹn nào. Nghỉ ngơi thật tốt nhé!
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                    {[...Array(totalPages)].map((_, idx) => (
                      <Pagination.Item key={idx + 1} active={idx + 1 === currentPage} onClick={() => setCurrentPage(idx + 1)}>
                        {idx + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                  </Pagination>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}