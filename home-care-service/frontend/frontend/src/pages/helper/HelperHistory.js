import React, { useEffect, useState, useMemo } from 'react';
import { Card, Row, Col, Table, Badge, Form, Pagination, Button, Modal } from "react-bootstrap";
import axios from 'axios';
import HelperSidebar from './components/HelperSidebar';

export default function HelperHistory() {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterDate, setFilterDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
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
      console.error("Lỗi khi tải dữ liệu Lịch sử:", error);
    }
  };

  const getServiceName = (id) => {
    const s = services.find(srv => String(srv.id) === String(id));
    return s ? s.name : "Dịch vụ";
  };

  const formatCurrency = (value) => Number(value).toLocaleString("vi-VN") + " đ";

  const getStatusBadge = (status) => {
    if (status === "COMPLETED") return <Badge bg="success">Đã hoàn thành</Badge>;
    if (status === "CANCELLED") return <Badge bg="danger">Đã hủy bỏ</Badge>;
    return <Badge bg="secondary">{status}</Badge>;
  };

  const toLocalDateKey = (value) => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "";
    const pad = (n) => String(n).padStart(2, '0');
    return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
  };

  // Lấy các Booking đã xong / hủy
  const historyBookings = useMemo(() => {
    return bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED');
  }, [bookings]);

  // Lọc kết hợp
  const filteredHistory = useMemo(() => {
    let result = [...historyBookings];

    // Lọc theo trạng thái
    if (filterStatus !== "ALL") {
      result = result.filter(b => b.status === filterStatus);
    }

    // Lọc theo ngày (YYYY-MM-DD)
    if (filterDate) {
      result = result.filter(b => toLocalDateKey(b.startTime) === filterDate);
    }

    // Lọc theo Search (Keyword)
    if (search.trim()) {
      const keyword = search.trim().toLowerCase();
      result = result.filter(b => {
        const bCode = (b.bookingCode || "").toLowerCase();
        const srvInfo = services.find(srv => String(srv.id) === String(b.serviceId));
        const sName = (srvInfo ? srvInfo.name : "Dịch vụ").toLowerCase();
        return bCode.includes(keyword) || sName.includes(keyword);
      });
    }

    return result.sort((a, b) => {
      const aTime = new Date(a.createdAt || a.updatedAt || a.startTime || 0).getTime();
      const bTime = new Date(b.createdAt || b.updatedAt || b.startTime || 0).getTime();
      return bTime - aTime;
    });
  }, [historyBookings, filterStatus, filterDate, search, services]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage) || 1;

  const handleOpenDetail = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <div className="dashboard-container" style={{ minHeight: "80vh", padding: "20px" }}>
      <Row className="g-4">
        {/* Left Sidebar Menu */}
        <Col xs={12} md={4} lg={3}>
          <HelperSidebar />
        </Col>

        {/* Right Content */}
        <Col xs={12} md={8} lg={9}>
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
                Lịch sử làm việc
              </h2>
              <div style={{ color: "#64748b" }}>
                Ghi nhận tất cả các cuốc việc bạn đã kết thúc hoặc bị hủy bỏ.
              </div>
            </div>
            <div>
              <Badge bg="light" text="dark" className="border px-3 py-2 fs-6 shadow-sm">
                Tổng chuyến thành công: <span className="text-success fw-bold">{historyBookings.filter(b => b.status === 'COMPLETED').length}</span>
              </Badge>
            </div>
          </div>

          <Card className="shadow-sm border-0 rounded-4">
            <Card.Header className="bg-white border-0 rounded-top-4 pt-4 px-4 pb-0">
              <Row className="g-2 mb-3">
                <Col md={4}>
                  <Form.Control
                    placeholder="Tìm mã chuyến, dịch vụ..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="date"
                    value={filterDate}
                    onChange={(e) => {
                      setFilterDate(e.target.value);
                      setCurrentPage(1);
                    }}
                    title="Lọc theo ngày cụ thể"
                  />
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="COMPLETED">Hoàn thành</option>
                    <option value="CANCELLED">Đã hủy</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Button variant="secondary" className="w-100" onClick={() => {
                    setSearch("");
                    setFilterDate("");
                    setFilterStatus("ALL");
                    setCurrentPage(1);
                  }}>Xóa lọc</Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="p-4">
              <Table striped bordered hover responsive className="mb-0 align-middle">
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc" }}>
                    <th className="py-3 text-center">STT</th>
                    <th className="py-3">Mã đơn</th>
                    <th className="py-3">Dịch vụ</th>
                    <th className="py-3">Ngày làm việc</th>
                    <th className="py-3 text-center">Trạng thái</th>
                    <th className="py-3 text-center">Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((j, idx) => (
                      <tr key={j.id} style={{ cursor: "pointer" }} onClick={() => handleOpenDetail(j)}>
                        <td className="text-center">{indexOfFirstItem + idx + 1}</td>
                        <td className="fw-bold text-dark">{j.bookingCode}</td>
                        <td className="fw-semibold text-secondary">
                          {getServiceName(j.serviceId)}
                        </td>
                        <td>
                          {new Date(j.startTime).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </td>
                        <td className="text-center">
                          {getStatusBadge(j.status)}
                        </td>
                        <td className="text-center">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail(j);
                            }}
                            title="Xem chi tiết"
                          >
                            👁️
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        Không tìm thấy lịch sử nào phù hợp với bộ lọc.
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

      {/* Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết Chuyến làm việc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <Row className="g-3">
              <Col md={12}>
                <div className="d-flex align-items-center justify-content-between border-bottom pb-2">
                  <h5 className="mb-0 fw-bold">{selectedItem.bookingCode}</h5>
                  {getStatusBadge(selectedItem.status)}
                </div>
              </Col>
              <Col md={6}>
                <p className="mb-1 text-muted">Dịch vụ</p>
                <p className="fw-semibold">{getServiceName(selectedItem.serviceId)}</p>
              </Col>
              <Col md={6}>
                <p className="mb-1 text-muted">Thời gian bắt đầu</p>
                <p className="fw-semibold">{new Date(selectedItem.startTime).toLocaleString("vi-VN")}</p>
              </Col>
              <Col md={6}>
                <p className="mb-1 text-muted">Thời gian kết thúc</p>
                <p className="fw-semibold">{new Date(selectedItem.endTime).toLocaleString("vi-VN")}</p>
              </Col>
              <Col md={6}>
                <p className="mb-1 text-muted">Tổng thời lượng</p>
                <p className="fw-semibold">{selectedItem.durationMinutes} phút</p>
              </Col>
              <Col md={12}>
                <p className="mb-1 text-muted">Chi phí (Gross)</p>
                <p className="fw-bold text-primary fs-5">{formatCurrency(selectedItem.pricing?.total || 0)}</p>
              </Col>
              <Col md={12}>
                <p className="mb-1 text-muted">Ghi chú (Note)</p>
                <div className="p-2 border rounded bg-light">{selectedItem.note || "Không có ghi chú"}</div>
              </Col>
              <Col md={12}>
                <p className="mb-1 text-muted">Bằng chứng hoàn thành (Photos)</p>
                <div className="d-flex gap-2">
                  {selectedItem.evidenceMedia && selectedItem.evidenceMedia.length > 0 ? (
                    selectedItem.evidenceMedia.map((photo, i) => (
                      <Badge key={i} bg="secondary" className="p-2">Hình ảnh {i + 1} đính kèm</Badge>
                    ))
                  ) : (
                    <span className="fst-italic text-muted">Không có tệp bằng chứng.</span>
                  )}
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}
