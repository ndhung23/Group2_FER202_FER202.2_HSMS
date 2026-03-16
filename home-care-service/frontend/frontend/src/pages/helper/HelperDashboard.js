import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Pagination,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HelperSidebar from "./components/HelperSidebar";

const STATUS_TEXT = {
  PENDING: "Chờ xác nhận",
  PENDING_DEPOSIT: "Chờ cọc 50%",
  PAID_DEPOSIT: "Đã cọc 50%",
  CONFIRMED: "Đã xác nhận",
  IN_PROGRESS: "Đang làm",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

export default function HelperDashboard() {
  const navigate = useNavigate();
  const [helper, setHelper] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [payouts, setPayouts] = useState([]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [nextStatus, setNextStatus] = useState("");
  const [statusError, setStatusError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
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
        axios.get("http://localhost:9999/services"),
        axios.get(`http://localhost:9999/reviews?helperId=${helperId}`),
        axios.get(`http://localhost:9999/payouts?helperId=${helperId}`),
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
    const item = services.find((srv) => String(srv.id) === String(id));
    return item ? item.name : "Dịch vụ";
  };

  const formatCurrency = (value) => Number(value || 0).toLocaleString("vi-VN") + " đ";

  const getStatusBadge = (status) => {
    if (status === "COMPLETED") return <Badge bg="success">Hoàn thành</Badge>;
    if (status === "CANCELLED") return <Badge bg="danger">Đã hủy</Badge>;
    if (status === "IN_PROGRESS") return <Badge bg="primary">Đang làm</Badge>;
    if (status === "PAID_DEPOSIT") return <Badge bg="primary">Đã cọc</Badge>;
    if (status === "PENDING_DEPOSIT") return <Badge bg="info">Chờ cọc</Badge>;
    if (status === "CONFIRMED") return <Badge bg="info">Đã xác nhận</Badge>;
    return <Badge bg="warning" text="dark">Chờ xử lý</Badge>;
  };

  const getAllowedNextStatuses = (currentStatus) => {
    if (["PENDING", "PENDING_DEPOSIT", "PAID_DEPOSIT", "CONFIRMED"].includes(currentStatus)) {
      return ["IN_PROGRESS", "CANCELLED"];
    }
    if (currentStatus === "IN_PROGRESS") {
      return ["COMPLETED", "CANCELLED"];
    }
    return [];
  };

  const handleOpenBookingModal = (booking) => {
    setSelectedBooking(booking);
    const options = getAllowedNextStatuses(booking.status);
    setNextStatus(options[0] || "");
    setStatusError("");
    setShowBookingModal(true);
  };

  const handleCloseBookingModal = () => {
    setShowBookingModal(false);
    setSelectedBooking(null);
    setNextStatus("");
    setStatusError("");
    setUpdatingStatus(false);
  };

  const handleUpdateBookingStatus = async () => {
    if (!selectedBooking) return;
    if (!nextStatus) {
      setStatusError("Vui lòng chọn trạng thái mới.");
      return;
    }

    const options = getAllowedNextStatuses(selectedBooking.status);
    if (!options.includes(nextStatus)) {
      setStatusError("Trạng thái chuyển đổi không hợp lệ.");
      return;
    }

    try {
      setUpdatingStatus(true);
      setStatusError("");
      const nowIso = new Date().toISOString();
      await axios.patch(`http://localhost:9999/bookings/${selectedBooking.id}`, {
        status: nextStatus,
        updatedAt: nowIso,
      });

      const updatedBooking = { ...selectedBooking, status: nextStatus, updatedAt: nowIso };
      setBookings((prev) =>
        prev.map((item) => (String(item.id) === String(selectedBooking.id) ? updatedBooking : item))
      );
      setSelectedBooking(updatedBooking);
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái booking:", error);
      setStatusError("Không thể cập nhật trạng thái lúc này. Vui lòng thử lại.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const now = new Date();
  const todayBookings = bookings.filter((booking) => {
    const date = new Date(booking.startTime);
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });
  const countToday = todayBookings.length;

  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const countThisWeek = bookings.filter(
    (booking) => new Date(booking.startTime) >= oneWeekAgo && new Date(booking.startTime) <= now
  ).length;

  const countThisMonth = bookings.filter((booking) => {
    const date = new Date(booking.startTime);
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  const weeklyPayouts = payouts.filter(
    (item) => item.status === "PAID" && new Date(item.paidAt) >= oneWeekAgo && new Date(item.paidAt) <= now
  );
  const weeklyEarnings = weeklyPayouts.reduce((sum, item) => sum + (item.helperAmount || 0), 0);

  const avgRating =
    reviews.length > 0 ? (reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length).toFixed(1) : "0.0";

  const filteredToday = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return todayBookings
      .filter((booking) => {
        const bookingCode = (booking.bookingCode || "").toLowerCase();
        const service = services.find((srv) => String(srv.id) === String(booking.serviceId));
        const serviceName = (service ? service.name : "Dich vu").toLowerCase();
        return bookingCode.includes(keyword) || serviceName.includes(keyword);
      })
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  }, [todayBookings, search, services]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredToday.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredToday.length / itemsPerPage);

  const statusOptions = selectedBooking ? getAllowedNextStatuses(selectedBooking.status) : [];

  return (
    <div className="dashboard-container" style={{ minHeight: "80vh", padding: "20px" }}>
      <Row className="g-4">
        <Col xs={12} md={4} lg={3}>
          <HelperSidebar />
        </Col>

        <Col xs={12} md={8} lg={9}>
          <div className="mb-4">
            <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
              Xin chào, {helper ? helper.fullName : "Bạn"}!
            </h2>
            <div style={{ color: "#64748b" }}>Đây là bảng điều khiển và lịch trình công việc hôm nay của bạn.</div>
          </div>

          <Row className="g-3 mb-4">
            <Col md={6} lg={3}>
              <Card className="shadow-sm border-0 rounded-4 h-100">
                <Card.Body>
                  <div className="text-muted mb-1" style={{ fontSize: "14px" }}>
                    Đơn hôm nay ({now.toLocaleDateString("vi-VN")})
                  </div>
                  <div className="fs-3 fw-bold mt-1 text-primary">{countToday}</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="shadow-sm border-0 rounded-4 h-100">
                <Card.Body>
                  <div className="text-muted mb-1" style={{ fontSize: "14px" }}>
                    Đơn tháng này
                  </div>
                  <div className="fs-3 fw-bold mt-1">{countThisMonth}</div>
                  <div
                    className="mt-2 text-primary fw-semibold"
                    style={{ fontSize: "13px", cursor: "pointer" }}
                    onClick={() => navigate("/helper/history")}
                  >
                    Xem lịch sử →
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="shadow-sm border-0 rounded-4 h-100">
                <Card.Body>
                  <div className="text-muted mb-1" style={{ fontSize: "14px" }}>
                    Đơn tuần này (7 ngày qua)
                  </div>
                  <div className="fs-3 fw-bold mt-1">{countThisWeek}</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="shadow-sm border-0 rounded-4 h-100">
                <Card.Body>
                  <div className="text-muted mb-1" style={{ fontSize: "14px" }}>
                    Thu nhập tuần này
                  </div>
                  <div className="fs-4 fw-bold mt-1 text-success">{formatCurrency(weeklyEarnings)}</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3}>
              <Card className="shadow-sm border-0 rounded-4 h-100">
                <Card.Body>
                  <div className="text-muted mb-1" style={{ fontSize: "14px" }}>
                    Đánh giá trung bình
                  </div>
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
                onChange={(event) => {
                  setSearch(event.target.value);
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
                    currentItems.map((item) => (
                      <tr key={item.id}>
                        <td className="fw-semibold text-secondary">{item.bookingCode}</td>
                        <td className="fw-semibold text-dark">{getServiceName(item.serviceId)}</td>
                        <td className="text-center">
                          <div className="fw-bold">
                            {new Date(item.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                          <div className="text-muted" style={{ fontSize: "12px" }}>
                            đến {new Date(item.endTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </td>
                        <td className="text-center">{getStatusBadge(item.status)}</td>
                        <td className="text-end fw-semibold text-success">{formatCurrency(item.pricing?.total || 0)}</td>
                        <td className="text-center">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            className="rounded-3 px-3"
                            onClick={() => handleOpenBookingModal(item)}
                          >
                            Xem & Cập nhật
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        Hôm nay bạn không có lịch hẹn nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPages)].map((_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showBookingModal} onHide={handleCloseBookingModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết lịch hẹn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <>
              <Row className="g-3">
                <Col xs={12}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="fw-bold">{selectedBooking.bookingCode}</div>
                    <div>{getStatusBadge(selectedBooking.status)}</div>
                  </div>
                </Col>
                <Col md={6}>
                  <small className="text-muted d-block">Dịch vụ</small>
                  <div className="fw-semibold">{getServiceName(selectedBooking.serviceId)}</div>
                </Col>
                <Col md={6}>
                  <small className="text-muted d-block">Tổng tiền</small>
                  <div className="fw-semibold text-success">{formatCurrency(selectedBooking.pricing?.total || 0)}</div>
                </Col>
                <Col md={6}>
                  <small className="text-muted d-block">Bắt đầu</small>
                  <div>{new Date(selectedBooking.startTime).toLocaleString("vi-VN")}</div>
                </Col>
                <Col md={6}>
                  <small className="text-muted d-block">Kết thúc</small>
                  <div>{new Date(selectedBooking.endTime).toLocaleString("vi-VN")}</div>
                </Col>
                <Col xs={12}>
                  <small className="text-muted d-block">Địa chỉ</small>
                  <div>{selectedBooking.fullAddress || "Không có dữ liệu"}</div>
                </Col>
                <Col xs={12}>
                  <small className="text-muted d-block">Ghi chú khách hàng</small>
                  <div>{selectedBooking.note || "Không có ghi chú"}</div>
                </Col>
              </Row>

              <hr />

              {statusError && <Alert variant="danger" className="py-2">{statusError}</Alert>}

              {statusOptions.length === 0 ? (
                <Alert variant="info" className="mb-0">
                  Trạng thái hiện tại là <strong>{STATUS_TEXT[selectedBooking.status] || selectedBooking.status}</strong>.
                  Đơn này không cần cập nhật thêm từ phía helper.
                </Alert>
              ) : (
                <>
                  <Form.Label className="fw-semibold">Cập nhật trạng thái</Form.Label>
                  <Form.Select
                    value={nextStatus}
                    onChange={(event) => setNextStatus(event.target.value)}
                    disabled={updatingStatus}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_TEXT[status] || status}
                      </option>
                    ))}
                  </Form.Select>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseBookingModal} disabled={updatingStatus}>
            Đóng
          </Button>
          {statusOptions.length > 0 && (
            <Button variant="primary" onClick={handleUpdateBookingStatus} disabled={updatingStatus || !nextStatus}>
              {updatingStatus ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Đang cập nhật...
                </>
              ) : (
                "Lưu trạng thái"
              )}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
