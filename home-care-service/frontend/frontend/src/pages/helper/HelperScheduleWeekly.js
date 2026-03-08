import React, { useEffect, useState, useMemo } from 'react';
import { Card, Row, Col, Table, Badge, Form, Pagination } from "react-bootstrap";
import axios from 'axios';
import HelperSidebar from './components/HelperSidebar';

export default function HelperScheduleWeekly() {
  const [helper, setHelper] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setHelper(parsedUser);
      fetchData(parsedUser.id);
    }
  }, []);

  const fetchData = async (helperId) => {
    try {
      const [resBookings, resServices] = await Promise.all([
        axios.get(`http://localhost:9999/bookings?assignedHelperId=${helperId}`),
        axios.get(`http://localhost:9999/services`)
      ]);
      setBookings(resBookings.data || []);
      setServices(resServices.data || []);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Lịch làm việc:", error);
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
    return <Badge bg="warning text-dark">Sắp diễn ra</Badge>;
  };

  // ----- TÍNH TOÁN LỊCH TUẦN NÀY ----- //
  const weeklyBookings = useMemo(() => {
    const now = new Date();
    // Tính đầu tuần (Thứ 2) và cuối tuần (Chủ nhật) tương đối
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)));
    startOfWeek.setHours(0,0,0,0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23,59,59,999);

    return bookings.filter(b => {
      const d = new Date(b.startTime);
      return d >= startOfWeek && d <= endOfWeek;
    });
  }, [bookings]);

  // Bộ lọc Search nội bộ Lịch Tuần
  const filteredSchedule = useMemo(() => {
    return weeklyBookings.filter(b => {
      const keyword = search.trim().toLowerCase();
      const bCode = (b.bookingCode || "").toLowerCase();
      const sName = getServiceName(b.serviceId).toLowerCase();
      return bCode.includes(keyword) || sName.includes(keyword);
    }).sort((a,b) => new Date(a.startTime) - new Date(b.startTime));
  }, [weeklyBookings, search, services]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSchedule.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredSchedule.length / itemsPerPage);

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
              Lịch làm việc hàng tuần
            </h2>
            <div style={{ color: "#64748b" }}>
              Chi tiết công tác tuyến trong tuần hiện hành dành cho bạn. Tối ưu việc di chuyển đúng giờ.
            </div>
          </div>

          <Card className="shadow-sm border-0 rounded-4">
            <Card.Header className="bg-white border-0 rounded-top-4 pt-4 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="fw-bold fs-5" style={{ color: "#1e293b" }}>
                Danh sách ca trực (Tuần này)
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
                    <th className="py-3">Lịch chiếu (Ngày / T.Gian)</th>
                    <th className="py-3">Địa điểm dự kiến (*)</th>
                    <th className="py-3 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((j) => (
                      <tr key={j.id}>
                        <td className="fw-semibold text-secondary">{j.bookingCode}</td>
                        <td className="fw-semibold text-dark">
                          {getServiceName(j.serviceId)} <br/>
                          <span className="text-muted fw-normal" style={{ fontSize: "12px" }}>Gross: {formatCurrency(j.pricing?.total || 0)}</span>
                        </td>
                        <td>
                          <div className="fw-bold text-primary">{new Date(j.startTime).toLocaleDateString("vi-VN", { weekday: 'long', day: 'numeric', month: 'short' })}</div>
                          <div className="text-muted" style={{ fontSize: "12px" }}>
                            {new Date(j.startTime).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })} - {new Date(j.endTime).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="text-muted fst-italic" style={{ fontSize: "13px", maxWidth: "200px" }}>
                           {j.addressId === "1" ? "123 Nguyễn Trãi, Phường 1, Quận 1, TP.HCM" : "N/A"}
                        </td>
                        <td className="text-center">
                          {getStatusBadge(j.status)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-muted">
                        Tuần này bạn chưa có lịch phân công nào.
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
