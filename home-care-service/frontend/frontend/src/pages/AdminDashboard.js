import { Card, Row, Col, Button, Table, Badge, Form } from "react-bootstrap";

function AdminDashboard() {
  const users = [
    { id: "USR001", name: "Nguyễn Văn A", role: "Khách hàng", joined: "01/03/2026", status: "Hoạt động" },
    { id: "HLP002", name: "Trần Thị B", role: "Người giúp việc", joined: "28/02/2026", status: "Hoạt động" },
    { id: "USR003", name: "Lê Văn C", role: "Khách hàng", joined: "25/02/2026", status: "Ngừng" },
    { id: "HLP004", name: "Phạm Thị D", role: "Người giúp việc", joined: "20/02/2026", status: "Chờ duyệt" },
    { id: "USR005", name: "Hoàng Văn E", role: "Khách hàng", joined: "15/02/2026", status: "Hoạt động" }
  ];

  const statusVariant = (status) => {
    if (status === "Hoạt động") return "success";
    if (status === "Chờ duyệt") return "warning";
    if (status === "Ngừng") return "secondary";
    return "primary";
  };

  return (
    <Row style={{ minHeight: "70vh" }}>
      <Col xs={12} md={2} className="mb-3 mb-md-0">
        <Card className="shadow-sm border-0 rounded-4 h-100">
          <Card.Body>
            <div className="fw-bold mb-3">Admin</div>
            <div className="d-flex flex-column gap-2">
              <Button variant="light" className="text-start w-100">
                Người dùng
              </Button>
              <Button variant="light" className="text-start w-100">
                Người giúp việc
              </Button>
              <Button variant="light" className="text-start w-100">
                Đơn đặt lịch
              </Button>
              <Button variant="light" className="text-start w-100">
                Thanh toán
              </Button>
              <Button variant="light" className="text-start w-100">
                Báo cáo
              </Button>
              <Button variant="light" className="text-start w-100">
                Cài đặt
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col xs={12} md={10}>
        <h2 className="mb-2">Quản trị hệ thống</h2>
        <div className="hj-muted mb-4">
          Tổng quan nhanh về người dùng và hoạt động trong tuần.
        </div>

        <Row className="mb-3">
          <Col md={{ span: 8, offset: 2 }}>
            <Form.Control placeholder="Tìm kiếm theo tên, email, vai trò..." />
          </Col>
        </Row>

        <Row className="g-3 mb-4">
          <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body>
              <div className="hj-muted">Doanh thu tuần này</div>
              <div className="fs-4 fw-bold mt-1">44.800.000đ</div>
            </Card.Body>
          </Card>
          </Col>
          <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body>
              <div className="hj-muted">Người dùng</div>
              <div className="fs-4 fw-bold mt-1">1.250</div>
            </Card.Body>
          </Card>
          </Col>
          <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body>
              <div className="hj-muted">Người giúp việc</div>
              <div className="fs-4 fw-bold mt-1">320</div>
            </Card.Body>
          </Card>
          </Col>
          <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body>
              <div className="hj-muted">Đơn đặt lịch</div>
              <div className="fs-4 fw-bold mt-1">730</div>
            </Card.Body>
          </Card>
          </Col>
        </Row>

        <Card className="shadow-sm border-0 rounded-4">
          <Card.Header className="d-flex justify-content-between align-items-center bg-white border-0 pb-0">
            <div className="fw-semibold">Quản lý người dùng</div>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" size="sm">
                Xuất Excel
              </Button>
              <Button variant="primary" size="sm">
                + Thêm mới
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <Table hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ và tên</th>
                  <th>Vai trò</th>
                  <th>Ngày tham gia</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.role}</td>
                    <td>{u.joined}</td>
                    <td>
                      <Badge bg={statusVariant(u.status)}>{u.status}</Badge>
                    </td>
                    <td>
                      <Button size="sm" variant="outline-primary" className="me-2">
                        Sửa
                      </Button>
                      <Button size="sm" variant="outline-secondary">
                        …
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default AdminDashboard;