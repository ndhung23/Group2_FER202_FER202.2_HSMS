import React, { useEffect, useState, useMemo } from 'react';
import { Card, Row, Col, Table, Badge, Form, Pagination, Button, Modal } from "react-bootstrap";
import axios from 'axios';
import CustomerSidebar from './components/CustomerSidebar';

export default function CustomerBookings() {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [helpers, setHelpers] = useState([]);

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

  const fetchData = async (customerId) => {
    try {
      const [resBookings, resServices, resHelpers] = await Promise.all([
        axios.get(`http://localhost:9999/bookings?customerId=${customerId}`),
        axios.get(`http://localhost:9999/services`),
        axios.get(`http://localhost:9999/users?role=HELPER`)
      ]);
      setBookings(resBookings.data || []);
      setServices(resServices.data || []);
      setHelpers(resHelpers.data || []);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Lịch sử Đơn hàng:", error);
    }
  };

  const getServiceName = (id) => {
    const s = services.find(srv => String(srv.id) === String(id));
    return s ? s.name : "Dịch vụ";
  };

  const getHelperName = (id) => {
    if (!id) return <span className="text-muted fst-italic">Chờ phân công</span>;
    const h = helpers.find(usr => String(usr.id) === String(id));
    return h ? h.fullName : "N/A";
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

  // Lọc
  const filteredBookings = useMemo(() => {
    let result = bookings;

    if (filterStatus !== "ALL") {
      result = result.filter(b => b.status === filterStatus);
    }
    if (filterDate) {
      result = result.filter(b => b.startTime && b.startTime.startsWith(filterDate));
    }
    if (search.trim()) {
      const keyword = search.trim().toLowerCase();
      result = result.filter(b => {
        const bCode = (b.bookingCode || "").toLowerCase();
        // Lấy tên theo serviceId luôn không thông qua hook function để tránh dependency loop
        const srvInfo = services.find(srv => String(srv.id) === String(b.serviceId));
        const sName = srvInfo ? srvInfo.name.toLowerCase() : "dịch vụ";

        return bCode.includes(keyword) || sName.includes(keyword);
      });
    }

    return result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [bookings, filterStatus, filterDate, search, services]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;

  const handleOpenDetail = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const markPayment = async (statusType) => {
    if (!selectedItem) return;
    
    try {
      let updatedBooking = { ...selectedItem };
      
      if (statusType === 'DEPOSIT') {
        const isConfirm = window.confirm(
          `Xác nhận thanh toán 50% tiền cọc (${formatCurrency(selectedItem.pricing?.base / 2 || 0)}) qua Cổng thanh toán?`
        );
        if (!isConfirm) return;
        
        updatedBooking = {
          ...updatedBooking,
          status: 'PAID_DEPOSIT',
          paymentStatus: {
            ...updatedBooking.paymentStatus,
            deposit: 'PAID'
          },
          updatedAt: new Date().toISOString()
        };
      } else if (statusType === 'FINAL') {
        const isConfirm = window.confirm(
          `Xác nhận thanh toán 50% phí còn lại (${formatCurrency(selectedItem.pricing?.base / 2 || 0)}) qua Cổng thanh toán?`
        );
        if (!isConfirm) return;

        updatedBooking = {
          ...updatedBooking,
          paymentStatus: {
            ...updatedBooking.paymentStatus,
            final: 'PAID'
          },
          updatedAt: new Date().toISOString()
        };
      }

      // Xây dựng request payload an toàn để Patch DB JSON
      const payload = {
         status: updatedBooking.status,
         paymentStatus: updatedBooking.paymentStatus,
         updatedAt: updatedBooking.updatedAt
      };

      await axios.patch(`http://localhost:9999/bookings/${selectedItem.id}`, payload);
      
      // Update local state without reload
      setBookings(prev => prev.map(b => String(b.id) === String(selectedItem.id) ? updatedBooking : b));
      setSelectedItem(updatedBooking); // cập nhật lại modal đang mở
      
      alert(`Thanh toán ${statusType === 'DEPOSIT' ? 'tiền cọc' : 'nghiệm thu'} thành công!`);
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      alert("Hệ thống lỗi, không thể thanh toán được lúc này.");
    }
  };

  return (
    <div className="dashboard-container" style={{ minHeight: "80vh", padding: "20px" }}>
      <Row className="g-4">
        {/* Sidebar */}
        <Col xs={12} md={4} lg={3}>
          <CustomerSidebar />
        </Col>

        {/* Content */}
        <Col xs={12} md={8} lg={9}>
          <div className="mb-4 d-flex justify-content-between align-items-center">
            <div>
              <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
                Giao dịch & Lịch sử đơn
              </h2>
              <div style={{ color: "#64748b" }}>
                Kiểm tra trạng thái xác nhận và thanh toán cọc cho dịch vụ HomeCare.
              </div>
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
                    <option value="PENDING">Chờ xác nhận</option>
                    <option value="CONFIRMED">Đã xác nhận</option>
                    <option value="IN_PROGRESS">Đang thực hiện</option>
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
                    <th className="py-3">Người phân công</th>
                    <th className="py-3">Ngày làm việc</th>
                    <th className="py-3 text-center">Trạng thái</th>
                    <th className="py-3 text-center">Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((j, idx) => (
                      <tr key={j.id}>
                        <td className="text-center">{indexOfFirstItem + idx + 1}</td>
                        <td className="fw-bold text-dark">{j.bookingCode}</td>
                        <td className="fw-semibold text-primary">
                          {getServiceName(j.serviceId)}
                        </td>
                        <td className="fw-semibold text-secondary">
                          {getHelperName(j.assignedHelperId)}
                        </td>
                        <td>
                          {new Date(j.startTime).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </td>
                        <td className="text-center">
                          {getStatusBadge(j.status)}
                        </td>
                        <td className="text-center">
                          <Button variant="outline-info" size="sm" onClick={() => handleOpenDetail(j)} title="Xem chi tiết">
                            👁️
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4 text-muted">
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
          <Modal.Title>Chi tiết Đơn hàng</Modal.Title>
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
                <p className="fw-bold text-primary fs-5">{getServiceName(selectedItem.serviceId)}</p>
              </Col>
              <Col md={6}>
                <p className="mb-1 text-muted">Nhân viên phụ trách</p>
                <p className="fw-bold">{getHelperName(selectedItem.assignedHelperId)}</p>
              </Col>

              <Col md={6}>
                <p className="mb-1 text-muted">Thời gian bắt đầu</p>
                <p className="fw-semibold">{new Date(selectedItem.startTime).toLocaleString("vi-VN")}</p>
              </Col>
              <Col md={6}>
                <p className="mb-1 text-muted">Thời gian kết thúc</p>
                <p className="fw-semibold">{new Date(selectedItem.endTime).toLocaleString("vi-VN")}</p>
              </Col>

              <Col md={12}>
                <Card className="bg-light border-0">
                  <Card.Body>
                    <h6 className="fw-bold">Thanh toán</h6>
                    <Row className="g-2">
                      <Col md={6}>
                        <div className="d-flex justify-content-between">
                          <span>Phí Dịch vụ (Gross):</span>
                          <span className="fw-bold">{formatCurrency(selectedItem.pricing?.base || 0)}</span>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="d-flex justify-content-between">
                          <span>Phụ thu (Surge):</span>
                          <span>{formatCurrency(selectedItem.pricing?.surge || 0)}</span>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="d-flex justify-content-between mt-2 pt-2 border-top">
                          <span className="fw-bold text-dark">Tiền cọc (Deposit 50%):</span>
                          {selectedItem.paymentStatus?.deposit === "PAID"
                            ? <span className="text-success fw-bold">Đã Cọc</span>
                            : <Button size="sm" variant="warning" onClick={() => markPayment('DEPOSIT')}>Đóng Cọc Ngay</Button>
                          }
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="d-flex justify-content-between mt-2 pt-2 border-top">
                          <span className="fw-bold text-dark">Thanh toán chót (Final 50%):</span>
                          {selectedItem.paymentStatus?.final === "PAID"
                            ? <span className="text-success fw-bold">Đã Trả Đủ</span>
                            : <Button size="sm" variant="success" disabled={selectedItem.status !== 'COMPLETED'} onClick={() => markPayment('FINAL')}>Nghiệm Thu</Button>
                          }
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={12}>
                <p className="mb-1 text-muted">Ghi chú (Note)</p>
                <div className="p-2 border rounded bg-white">{selectedItem.note || "Không có ghi chú"}</div>
              </Col>

              <Col md={12}>
                <p className="mb-1 text-muted">Bằng chứng hoàn thành từ Helper</p>
                <div className="d-flex gap-2 border p-2 bg-white rounded">
                  {selectedItem.evidenceMedia && selectedItem.evidenceMedia.length > 0 ? (
                    selectedItem.evidenceMedia.map((photo, i) => (
                      <Badge key={i} bg="secondary" className="p-2">Tệp đính kèm {photo}</Badge>
                    ))
                  ) : (
                    <span className="fst-italic text-muted">Hình ảnh sẽ cập nhật khi Helper hoàn tất.</span>
                  )}
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <div>
            {selectedItem && selectedItem.status === 'COMPLETED' && (
              <Button variant="outline-warning" onClick={() => alert('Mở form Đánh Giá (Review) cho đơn này')} className="fw-bold">
                ⭐ Gửi Đánh Giá Ngay
              </Button>
            )}
          </div>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}