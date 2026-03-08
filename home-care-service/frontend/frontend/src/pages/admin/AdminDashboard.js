import { Card, Row, Col, Button, Table, Badge, Form, Pagination } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";
import './ui/uiBaseic.css';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const [resUser, resBooking] = await Promise.all([
          axios.get("http://localhost:9999/users"),
          axios.get("http://localhost:9999/bookings")
        ]);

        setUsers(resUser.data || []);
        setBookings(resBooking.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    getData();
  }, []);

  const uniqueRoles = useMemo(() => {
    return [...new Set(users.map((u) => u.role))];
  }, [users]);

  const uniqueStatus = useMemo(() => {
    return [...new Set(users.map((u) => u.status))];
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const keyword = search.trim().toLowerCase();

      const fullName = u.fullName?.toLowerCase() || "";
      const username = u.username?.toLowerCase() || "";
      const email = u.email?.toLowerCase() || "";
      const phone = u.phone?.toLowerCase() || "";

      const matchSearch =
        fullName.includes(keyword) ||
        username.includes(keyword) ||
        email.includes(keyword) ||
        phone.includes(keyword);

      const matchRole = selectedRole ? u.role === selectedRole : true;
      const matchStatus = selectedStatus ? u.status === selectedStatus : true;

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, selectedRole, selectedStatus]);

  const statusVariant = (status) => {
    if (status === "ACTIVE") return "success";
    if (status === "INACTIVE") return "danger";
    //if (status === "PENDING") return "warning";
    return "secondary";
  };

  const renderStatus = (status) => {
    if (status === "ACTIVE") return "Hoạt động";
    if (status === "INACTIVE") return "Cấm";
    //if (status === "PENDING") return "Chờ duyệt";
    return status;
  };

  const renderRole = (role) => {
    if (role === "ADMIN") return "Quản trị viên";
    if (role === "CUSTOMER") return "Khách hàng";
    if (role === "HELPER") return "Người giúp việc";
    return role;
  };

  const totalCustomers = users.filter((u) => u.role === "CUSTOMER").length;
  const totalHelpers = users.filter((u) => u.role === "HELPER").length;
  const totalCompletedBooking = bookings.filter(
    (b) => b.status === "COMPLETED"
  ).length;

  const totalPendingBooking = bookings.filter(
    (b) => b.status === "PENDING" || b.status === "PENDING_DEPOSIT"
  ).length;

  const grossAmount = bookings
    .filter((b) => b.status === "COMPLETED")
    .reduce((sum, b) => sum + (b.pricing?.total || 0), 0);

  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN") + " đ";
  };

  const handleDeleteUser = async (id) => {
    const isConfirm = window.confirm(
      "Bạn có chắc muốn xóa người dùng này không?"
    );
    if (!isConfirm) return;

    try {
      await axios.delete(`http://localhost:9999/users/${id}`);
      setUsers((prev) => prev.filter((u) => String(u.id) !== String(id)));
      alert("Xóa người dùng thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa user:", error);
      alert("Xóa thất bại!");
    }
  };

  const handleSuspendUser = async (user) => {
    const isConfirm = window.confirm(
      `Bạn có chắc muốn ngừng hoạt động của tài khoản ${user.username}?`
    );
    if (!isConfirm) return;

    try {
      await axios.patch(`http://localhost:9999/users/${user.id}`, { status: "INACTIVE", updatedAt: new Date().toISOString() });
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, status: "INACTIVE" } : u));
      alert("Đã ngừng tài khoản!");
    } catch (error) {
      console.error("Lỗi khi ngừng user:", error);
      alert("Thao tác thất bại!");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div
      style={{
        background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
        minHeight: "100vh",
        padding: "24px"
      }}
    >
      <Row className="g-4">
        {/* Sidebar */}
        <Col xs={12} md={3} lg={2}>
          <AdminSidebar />
        </Col>

        {/* Cột Nội dung chính */}
        <Col xs={12} md={9} lg={10}>
          <div className="mb-4">
            <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
              Quản trị hệ thống
            </h2>
            <div style={{ color: "#64748b" }}>
              Tổng quan nhanh về người dùng và hoạt động trong tuần.
            </div>
          </div>

          <Row className="g-3 mb-4 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-5">
            <Col>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body>
                  <div style={{ color: "#64748b", fontSize: "14px" }}>
                    Chờ duyệt
                  </div>
                  <div
                    className="fw-bold fs-3 mt-2"
                    style={{ color: "#ea580c" }}
                  >
                    {totalPendingBooking}
                  </div>
                  <div
                    className="mt-2 text-decoration-none cursor-pointer"
                    style={{ fontSize: "13px", color: "#f97316", cursor: 'pointer' }}
                    onClick={() => navigate('/admin/bookings')}
                  >
                    Đơn PENDING ➜
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body>
                  <div style={{ color: "#64748b", fontSize: "14px" }}>
                    Doanh thu
                  </div>
                  <div
                    className="fw-bold fs-3 mt-2"
                    style={{ color: "#0f172a" }}
                  >
                    {formatCurrency(grossAmount)}
                  </div>
                  <div
                    className="mt-2"
                    style={{ fontSize: "13px", color: "#16a34a" }}
                  >
                    Đơn COMPLETED
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body>
                  <div style={{ color: "#64748b", fontSize: "14px" }}>
                    Khách hàng
                  </div>
                  <div
                    className="fw-bold fs-3 mt-2"
                    style={{ color: "#0f172a" }}
                  >
                    {totalCustomers}
                  </div>
                  <div
                    className="mt-2"
                    style={{ fontSize: "13px", color: "#2563eb" }}
                  >
                    Tổng số khách hàng
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body>
                  <div style={{ color: "#64748b", fontSize: "14px" }}>
                    Người giúp việc
                  </div>
                  <div
                    className="fw-bold fs-3 mt-2"
                    style={{ color: "#0f172a" }}
                  >
                    {totalHelpers}
                  </div>
                  <div
                    className="mt-2"
                    style={{ fontSize: "13px", color: "#7c3aed" }}
                  >
                    Đang hoạt động trong hệ thống
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card className="border-0 shadow-sm rounded-4 h-100">
                <Card.Body>
                  <div style={{ color: "#64748b", fontSize: "14px" }}>
                    Đơn hoàn thành
                  </div>
                  <div
                    className="fw-bold fs-3 mt-2"
                    style={{ color: "#0f172a" }}
                  >
                    {totalCompletedBooking}
                  </div>
                  <div
                    className="mt-2"
                    style={{ fontSize: "13px", color: "#f59e0b" }}
                  >
                    Booking COMPLETED
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="border-0 shadow-sm rounded-4">
            <Card.Header className="bg-white border-0 rounded-top-4 pt-4 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div>
                <div className="fw-bold fs-5" style={{ color: "#1e293b" }}>
                  Quản lý người dùng
                </div>
                <div style={{ fontSize: "14px", color: "#64748b" }}>
                  Theo dõi, tìm kiếm và lọc danh sách người dùng
                </div>
              </div>

              <div className="d-flex gap-2">
                <Button variant="outline-secondary" className="rounded-3">
                  Xuất Excel
                </Button>
                <Button
                  variant="primary"
                  className="rounded-3"
                  onClick={() => navigate("/admin/user/new")}
                >
                  + Thêm mới
                </Button>
              </div>
            </Card.Header>

            <Card.Body className="p-4">
              <Row className="g-3 mb-4">
                <Col md={12} lg={5}>
                  <Form.Control
                    placeholder="Tìm kiếm theo tên, tài khoản, email, số điện thoại..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="rounded-3"
                    style={{ height: "46px" }}
                  />
                </Col>

                <Col md={6} lg={3}>
                  <Form.Select
                    value={selectedRole}
                    onChange={(e) => {
                      setSelectedRole(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="rounded-3"
                    style={{ height: "46px" }}
                  >
                    <option value="">-- Chọn vai trò --</option>
                    {uniqueRoles.map((role) => (
                      <option key={role} value={role}>
                        {renderRole(role)}
                      </option>
                    ))}
                  </Form.Select>
                </Col>

                <Col md={6} lg={3}>
                  <Form.Select
                    value={selectedStatus}
                    onChange={(e) => {
                      setSelectedStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="rounded-3"
                    style={{ height: "46px" }}
                  >
                    <option value="">-- Chọn trạng thái --</option>
                    {uniqueStatus.map((status) => (
                      <option key={status} value={status}>
                        {renderStatus(status)}
                      </option>
                    ))}
                  </Form.Select>
                </Col>

                <Col md={12} lg={1}>
                  <Button
                    variant="light"
                    className="w-100 rounded-3 border"
                    style={{ height: "46px" }}
                    onClick={() => {
                      setSearch("");
                      setSelectedRole("");
                      setSelectedStatus("");
                      setCurrentPage(1);
                    }}
                  >
                    Xóa
                  </Button>
                </Col>
              </Row>

              <div className="table-responsive">
                <Table hover bordered striped className="align-middle mb-0">
                  <thead>
                    <tr style={{ backgroundColor: "#f8fafc" }}>
                      <th className="py-3">ID</th>
                      <th className="py-3">Họ và tên</th>
                      <th className="py-3">Tên</th>
                      <th className="py-3">Email</th>
                      <th className="py-3">SĐT</th>
                      <th className="py-3">Vai trò</th>
                      <th className="py-3">Trạng thái</th>
                      <th className="py-3 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((u, index) => (
                        <tr key={u.id}>
                          <td className="fw-semibold">{indexOfFirstItem + index + 1}</td>
                          <td>{u.fullName}</td>
                          <td>{u.username}</td>
                          <td>{u.email}</td>
                          <td>{u.phone}</td>
                          <td>{renderRole(u.role)}</td>
                          <td>
                            <Badge
                              pill
                              bg={statusVariant(u.status)}
                              className="px-2 py-2"
                            >
                              {renderStatus(u.status)}
                            </Badge>
                          </td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <Button
                                size="sm"
                                variant="outline-primary"
                                className="rounded-3 px-3"
                                onClick={() => navigate(`/admin/user/view/${u.id}`)}
                              >
                                Xem
                              </Button>
                              <Button
                                size="sm"
                                variant="outline-warning"
                                className="rounded-3 px-3"
                                onClick={() => navigate(`/admin/user/edit/${u.id}`)}
                              >
                                Sửa
                              </Button>
                              {u.status === "ACTIVE" && (
                                <Button
                                  size="sm"
                                  variant="outline-secondary"
                                  className="rounded-3 px-3"
                                  onClick={() => handleSuspendUser(u)}
                                >
                                  Cấm
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline-danger"
                                className="rounded-3 px-3"
                                onClick={() => handleDeleteUser(u.id)}
                              >
                                Xóa
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-4 text-muted">
                          Không có dữ liệu phù hợp
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
    </div>
  );
}

export default AdminDashboard;