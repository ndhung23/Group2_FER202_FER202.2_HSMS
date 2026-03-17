import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Card, Table, Badge, Form, Row, Col, Button, Pagination, Modal } from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './components/AdminSidebar';
import './ui/uiBaseic.css';

export default function AdminSchedule() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [search, setSearch] = useState("");

  // Modals
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewedBooking, setViewedBooking] = useState(null);

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    bookingCode: "",
    customerId: "",
    serviceId: "",
    assignedHelperId: "",
    startTime: "",
    endTime: "",
    note: "",
    status: "PENDING",
    priceBase: 0
  });

  const fetchData = async () => {
    try {
      const [resBookings, resUsers, resServices] = await Promise.all([
        axios.get("http://localhost:9999/bookings"),
        axios.get("http://localhost:9999/users"),
        axios.get("http://localhost:9999/services")
      ]);
      setBookings(resBookings.data || []);
      setUsers(resUsers.data || []);
      setServices(resServices.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getUser = (id) => users.find(u => String(u.id) === String(id));
  const getUserName = useCallback((id) => {
    const u = users.find(user => String(user.id) === String(id));
    return u ? u.fullName : "Unknown";
  }, [users]);
  const getServiceName = (id) => {
    const s = services.find(srv => String(srv.id) === String(id));
    return s ? s.name : "Unknown Service";
  };

  const formatCurrency = (value) => Number(value).toLocaleString("vi-VN") + " đ";

  const getStatusBadge = (status) => {
    if (status === "COMPLETED") return <Badge bg="success">Hoàn thành</Badge>;
    if (status === "CANCELLED") return <Badge bg="danger">Đã hủy</Badge>;
    if (status === "IN_PROGRESS") return <Badge bg="primary">Đang làm</Badge>;
    return <Badge bg="warning text-dark">Chờ phân công</Badge>;
  };

  // Search
  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const keyword = search.trim().toLowerCase();
      const bCode = (b.bookingCode || "").toLowerCase();
      const cName = getUserName(b.customerId).toLowerCase();
      const hName = b.assignedHelperId ? getUserName(b.assignedHelperId).toLowerCase() : "";

      return bCode.includes(keyword) || cName.includes(keyword) || hName.includes(keyword);
    });
  }, [bookings, search, getUserName]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  // Form Handlers
  const handleShowAdd = () => {
    setEditingId(null);
    setFormData({
      bookingCode: `BK-${new Date().getTime().toString().slice(-6)}`,
      customerId: "",
      serviceId: "",
      assignedHelperId: "",
      startTime: "",
      endTime: "",
      note: "",
      status: "PENDING",
      priceBase: 100000
    });
    setShowFormModal(true);
  };

  const handleShowEdit = (b) => {
    setEditingId(b.id);
    setFormData({
      bookingCode: b.bookingCode || "",
      customerId: b.customerId || "",
      serviceId: b.serviceId || "",
      assignedHelperId: b.assignedHelperId || "",
      startTime: b.startTime ? b.startTime.slice(0, 16) : "", // datetime-local format YYYY-MM-DDThh:mm
      endTime: b.endTime ? b.endTime.slice(0, 16) : "",
      note: b.note || "",
      status: b.status || "PENDING",
      priceBase: b.pricing?.base || 0
    });
    setShowFormModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa lịch làm việc này?")) return;
    try {
      await axios.delete(`http://localhost:9999/bookings/${id}`);
      setBookings(prev => prev.filter(b => b.id !== id));
      alert("Xóa thành công!");
    } catch (err) {
      alert("Lỗi khi xóa!");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.customerId || !formData.serviceId || !formData.startTime || !formData.endTime) {
      alert("Vui lòng nhập đủ các trường bắt buộc !");
      return;
    }

    try {
      const payload = {
        bookingCode: formData.bookingCode,
        customerId: String(formData.customerId),
        serviceId: String(formData.serviceId),
        assignedHelperId: formData.assignedHelperId ? String(formData.assignedHelperId) : null,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        note: formData.note,
        status: formData.status,
        pricing: {
          base: Number(formData.priceBase),
          surge: 0,
          discount: 0,
          total: Number(formData.priceBase),
          currency: "VND"
        },
        updatedAt: new Date().toISOString()
      };

      if (editingId) {
        await axios.patch(`http://localhost:9999/bookings/${editingId}`, payload);
        alert("Cập nhật thành công!");
      } else {
        const resIds = bookings.map(b => Number(b.id)).filter(id => !isNaN(id));
        payload.id = String(resIds.length > 0 ? Math.max(...resIds) + 1 : 1);
        payload.createdAt = new Date().toISOString();
        await axios.post(`http://localhost:9999/bookings`, payload);
        alert("Thêm mới thành công!");
      }
      setShowFormModal(false);
      fetchData();
    } catch (err) {
      alert("Lỗi khi lưu dữ liệu!");
    }
  };

  const handleShowView = (b) => {
    setViewedBooking(b);
    setShowViewModal(true);
  };

  const customers = users.filter(u => u.role === "CUSTOMER");
  const helpers = users.filter(u => u.role === "HELPER");

  return (
    <div className="dashboard-container">
      <Row className="g-4">
        {/* Left Sidebar Menu */}
        <Col xs={12} md={3} lg={2}>
          <AdminSidebar />
        </Col>

        {/* Right Content */}
        <Col xs={12} md={9} lg={10}>
          <div className="mb-4">
            <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
              Danh sách làm việc tổng hợp
            </h2>
            <div style={{ color: "#64748b" }}>
              Giám sát lịch hẹn, quản lý CRUD (Create, Read, Update, Delete) & phân công người giúp việc.
            </div>
          </div>

          <Card className="border-0 shadow-sm rounded-4">
            <Card.Header className="bg-white border-0 rounded-top-4 pt-4 px-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div className="d-flex align-items-center gap-3">
                <Form.Control
                  placeholder="Tìm mã đơn, tên khách/giúp việc..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded-3"
                  style={{ width: "350px", height: "42px" }}
                />
              </div>

              <div>
                <Button variant="primary" className="rounded-3" onClick={handleShowAdd}>
                  + Tạo Lịch Mới
                </Button>
              </div>
            </Card.Header>

            <Card.Body className="p-4">
              <div className="table-responsive">
                <Table hover bordered striped className="align-middle mb-0">
                  <thead>
                    <tr style={{ backgroundColor: "#f8fafc" }}>
                      <th className="py-3">Mã đơn</th>
                      <th className="py-3">Khách hàng</th>
                      <th className="py-3">Người giúp việc</th>
                      <th className="py-3 text-center">Thời gian</th>
                      <th className="py-3 text-center">Trạng thái</th>
                      <th className="py-3 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((b) => (
                        <tr key={b.id}>
                          <td className="fw-semibold text-secondary">{b.bookingCode}</td>
                          <td className="fw-semibold">{getUserName(b.customerId)}</td>
                          <td>
                            {b.assignedHelperId
                              ? <span className="fw-semibold text-primary">{getUserName(b.assignedHelperId)}</span>
                              : <span className="text-muted fst-italic">Chưa phân công</span>
                            }
                          </td>
                          <td className="text-center">
                            <div>{new Date(b.startTime).toLocaleDateString("vi-VN")}</div>
                            <div className="text-muted" style={{ fontSize: "13px" }}>
                              {new Date(b.startTime).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })} - {new Date(b.endTime).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td className="text-center">
                            {getStatusBadge(b.status)}
                          </td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <Button size="sm" variant="outline-info" className="rounded-3 px-2" onClick={() => handleShowView(b)}>
                                Xem
                              </Button>
                              <Button size="sm" variant="outline-primary" className="rounded-3 px-2" onClick={() => handleShowEdit(b)}>
                                Sửa
                              </Button>
                              <Button size="sm" variant="outline-danger" className="rounded-3 px-2" onClick={() => handleDelete(b.id)}>
                                Xóa
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4 text-muted">
                          Chưa có lịch làm việc nào
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

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

      {/* CRUD FORM MODAL */}
      <Modal show={showFormModal} onHide={() => setShowFormModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Cập nhật Lịch Hẹn" : "Tạo Lịch Hẹn Mới"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Mã đơn/Booking Code <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.bookingCode}
                    onChange={(e) => setFormData({ ...formData, bookingCode: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Dịch vụ <span className="text-danger">*</span></Form.Label>
                  <Form.Select required value={formData.serviceId} onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}>
                    <option value="">-- Chọn dịch vụ --</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name} ({formatCurrency(s.basePrice)})</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Khách hàng <span className="text-danger">*</span></Form.Label>
                  <Form.Select required value={formData.customerId} onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}>
                    <option value="">-- Chọn khách hàng --</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.fullName} - {c.phone}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Phân công Người giúp việc (Tùy chọn)</Form.Label>
                  <Form.Select value={formData.assignedHelperId} onChange={(e) => setFormData({ ...formData, assignedHelperId: e.target.value })}>
                    <option value="">-- Chưa phân công --</option>
                    {helpers.map(h => <option key={h.id} value={h.id}>{h.fullName} - {h.phone}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Thời gian Bắt đầu <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="datetime-local"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Thời gian Kết thúc <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="datetime-local"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="PENDING">PENDING (Chờ nhận)</option>
                    <option value="IN_PROGRESS">IN_PROGRESS (Đang làm)</option>
                    <option value="COMPLETED">COMPLETED (Hoàn thành)</option>
                    <option value="CANCELLED">CANCELLED (Đã hủy)</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Giá trị đơn (VNĐ) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    required
                    min="0"
                    value={formData.priceBase}
                    onChange={(e) => setFormData({ ...formData, priceBase: e.target.value })}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Ghi chú (Note)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  />
                </Form.Group>
              </Col>

            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowFormModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              Lưu thay đổi
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* VIEW MODAL - Helper and Booking Detailed Information */}
      <Modal show={showViewModal} onHide={() => { setShowViewModal(false); setViewedBooking(null); }} centered size="lg">
        <Modal.Header closeButton className="bg-light">
          <Modal.Title className="fw-bold">Chi Tiết Lịch Trình</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {viewedBooking && (
            <Row className="g-4">
              {/* Cột thông tin Cuộc hẹn */}
              <Col md={6}>
                <div className="p-3 bg-white border rounded-3 h-100 shadow-sm">
                  <h6 className="fw-bold text-primary mb-3">Thông tin Cuộc Hẹn (Booking)</h6>
                  <p className="mb-2"><strong>Mã đơn:</strong> {viewedBooking.bookingCode}</p>
                  <p className="mb-2"><strong>Dịch vụ:</strong> {getServiceName(viewedBooking.serviceId)}</p>
                  <p className="mb-2">
                    <strong>Trạng thái:</strong> {getStatusBadge(viewedBooking.status)}
                  </p>
                  <hr className="my-2" />
                  <p className="mb-2"><strong>Thời gian:</strong> <br />
                    {new Date(viewedBooking.startTime).toLocaleString("vi-VN")} <br />
                    đến {new Date(viewedBooking.endTime).toLocaleString("vi-VN")}
                  </p>
                  <p className="mb-2"><strong>Giá trị đơn:</strong> <span className="text-success fw-bold">{formatCurrency(viewedBooking.pricing?.total || 0)}</span></p>
                  <p className="mb-0"><strong>Ghi chú:</strong> {viewedBooking.note || "Trống"}</p>
                </div>
              </Col>

              {/* Cột thông tin Người giúp việc */}
              <Col md={6}>
                <div className="p-3 bg-white border rounded-3 h-100 shadow-sm flex-column d-flex">
                  <h6 className="fw-bold text-success mb-3">Thông tin Người Giúp Việc</h6>
                  {viewedBooking.assignedHelperId ? (
                    <>
                      {(() => {
                        const h = getUser(viewedBooking.assignedHelperId);
                        if (!h) return <p>Không tìm thấy thông tin.</p>;
                        return (
                          <>
                            <p className="mb-2"><strong>Họ & Tên:</strong> {h.fullName}</p>
                            <p className="mb-2"><strong>Tuổi:</strong> {h.age || "Không rõ"}</p>
                            <p className="mb-2"><strong>Giới tính:</strong> {h.gender || "Không rõ"}</p>
                            <p className="mb-2"><strong>Số điện thoại:</strong> {h.phone}</p>
                            <p className="mb-2"><strong>Email:</strong> {h.email}</p>
                            <p className="mb-0"><strong>Trạng thái Tài khoản:</strong> {h.status}</p>
                          </>
                        );
                      })()}
                    </>
                  ) : (
                    <div className="alert alert-warning m-0 flex-grow-1 d-flex align-items-center justify-content-center">
                      <span className="text-center">Lịch này hiện chưa phân công Người giúp việc!</span>
                    </div>
                  )}
                </div>
              </Col>

              {/* Cột Thông tin Khách hàng */}
              <Col md={12}>
                <div className="p-3 bg-light border rounded-3 shadow-sm">
                  <h6 className="fw-bold text-secondary mb-3">Thông tin Khách Hàng (Người đặt)</h6>
                  {(() => {
                    const c = getUser(viewedBooking.customerId);
                    if (!c) return <p>Không tìm thấy khách hàng.</p>;
                    return (
                      <Row>
                        <Col sm={6}><p className="mb-2"><strong>Họ & Tên:</strong> {c.fullName}</p></Col>
                        <Col sm={6}><p className="mb-2"><strong>Số điện thoại:</strong> {c.phone}</p></Col>
                      </Row>
                    );
                  })()}
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowViewModal(false); setViewedBooking(null); }}>
            Đóng
          </Button>
          {viewedBooking && (
            <Button variant="primary" onClick={() => {
              setShowViewModal(false);
              handleShowEdit(viewedBooking);
            }}>
              Chỉnh sửa nhanh
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}
