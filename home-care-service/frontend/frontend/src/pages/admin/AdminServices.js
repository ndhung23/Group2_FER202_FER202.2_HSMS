import React, { useEffect, useState, useMemo } from 'react';
import { Card, Table, Badge, Row, Col, Button, Pagination, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './components/AdminSidebar';
import './ui/uiBaseic.css';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // For Search
  const [search, setSearch] = useState("");

  // For CRUD Modal
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    unit: "HOUR",
    basePrice: 0,
    minDurationMinutes: 0,
    isActive: true
  });

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:9999/services");
      setServices(res.data || []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (value) => {
    return Number(value).toLocaleString("vi-VN") + "đ";
  };

  const handleShowAdd = () => {
    setEditingId(null);
    setFormData({
      code: "",
      name: "",
      description: "",
      unit: "HOUR",
      basePrice: 0,
      minDurationMinutes: 0,
      isActive: true
    });
    setShowModal(true);
  };

  const handleShowEdit = (service) => {
    setEditingId(service.id);
    setFormData({
      code: service.code || "",
      name: service.name || "",
      description: service.description || "",
      unit: service.unit || "HOUR",
      basePrice: service.basePrice || 0,
      minDurationMinutes: service.minDurationMinutes || 0,
      isActive: service.isActive !== undefined ? service.isActive : true
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) return;
    try {
      await axios.delete(`http://localhost:9999/services/${id}`);
      setServices(prev => prev.filter(s => s.id !== id));
      alert("Xóa thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa!");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.code || !formData.name || formData.basePrice <= 0) {
      alert("Vui lòng nhập đủ Mã, Tên và Giá cơ bản hợp lệ");
      return;
    }

    try {
      const payload = {
        ...formData,
        basePrice: Number(formData.basePrice),
        minDurationMinutes: Number(formData.minDurationMinutes),
        createdAt: new Date().toISOString()
      };

      if (editingId) {
        // Cập nhật
        await axios.patch(`http://localhost:9999/services/${editingId}`, payload);
        alert("Cập nhật thành công!");
      } else {
        // Thêm mới
        const resIds = services.map(s => Number(s.id)).filter(id => !isNaN(id));
        const newId = resIds.length > 0 ? Math.max(...resIds) + 1 : 1;
        payload.id = String(newId);
        await axios.post(`http://localhost:9999/services`, payload);
        alert("Thêm mới thành công!");
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu dữ liệu!");
    }
  };

  // Lọc dữ liệu
  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const keyword = search.trim().toLowerCase();
      const matchCode = (s.code || "").toLowerCase().includes(keyword);
      const matchName = (s.name || "").toLowerCase().includes(keyword);
      return matchCode || matchName;
    })
    //.sort((a,b) => b.id + a.id)
    .sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [services, search]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

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
              Danh mục Dịch vụ
            </h2>
            <div style={{ color: "#64748b" }}>
              Quản lý các loại dịch vụ mà HomeCare cung cấp.
            </div>
          </div>

          <Card className="border-0 shadow-sm rounded-4">
            <Card.Header className="bg-white border-0 rounded-top-4 pt-4 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <div className="fw-bold fs-5" style={{ color: "#1e293b" }}>
                  Dịch vụ hiện có
                </div>
              </div>

              <div className="d-flex gap-2 align-items-center">
                <Form.Control
                  placeholder="Tìm kiếm mã hoặc tên dịch vụ..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded-3"
                  style={{ width: "300px" }}
                />
                <Button variant="primary" className="rounded-3" onClick={handleShowAdd}>
                  + Thêm dịch vụ
                </Button>
              </div>
            </Card.Header>

            <Card.Body className="p-4">
              <div className="table-responsive">
                <Table hover bordered striped className="align-middle mb-0">
                  <thead>
                    <tr style={{ backgroundColor: "#f8fafc" }}>
                      <th className="py-3">Mã</th>
                      <th className="py-3">Tên</th>
                      <th className="py-3">Mô tả</th>
                      <th className="py-3 text-center">Đơn vị</th>
                      <th className="py-3 text-center">Giá</th>
                      <th className="py-3 text-center">Thời gian</th>
                      <th className="py-3 text-center">Trạng thái</th>
                      <th className="py-3 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((s) => (
                        <tr key={s.id}>
                          <td className="fw-semibold text-secondary">{s.code}</td>
                          <td className="fw-semibold">{s.name}</td>
                          <td>{s.description}</td>
                          <td className="text-center">{s.unit}</td>
                          <td className="text-start fw-semibold text-primary">{formatCurrency(s.basePrice)}</td>
                          <td className="text-center">{s.minDurationMinutes}p</td>
                          <td className="text-center">
                            <Badge bg={s.isActive ? "success" : "secondary"} pill className="px-3 py-2">
                              {s.isActive ? "Hoạt động" : "Tạm ngưng"}
                            </Badge>
                          </td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <Button size="sm" variant="outline-primary" className="rounded-3 px-3" onClick={() => handleShowEdit(s)}>
                                Sửa
                              </Button>
                              <Button size="sm" variant="outline-danger" className="rounded-3 px-3" onClick={() => handleDelete(s.id)}>
                                Xóa
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-4 text-muted">
                          Chưa có dịch vụ nào phù hợp
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

      {/* Modal Add/Edit */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Cập nhật dịch vụ" : "Thêm dịch vụ mới"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSave}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Mã dịch vụ <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="VD: ID001"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Tên dịch vụ <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="VD: Giúp việc theo giờ"
                  />
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label>Mô tả chi tiết</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Tính năng, công việc..."
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Giá cơ bản (VNĐ) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    required
                    min="1000"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Đơn vị <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  >
                    <option value="HOUR">Theo giờ (HOUR)</option>
                    <option value="WEEK">Theo tuần (WEEK)</option>
                    <option value="MONTH">Theo tháng (MONTH)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Thời gian tối thiểu (phút) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    required
                    value={formData.minDurationMinutes}
                    onChange={(e) => setFormData({ ...formData, minDurationMinutes: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select
                    value={formData.isActive ? "true" : "false"}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "true" })}
                  >
                    <option value="true">Hoạt động</option>
                    <option value="false">Tạm dừng</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              Lưu thay đổi
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}