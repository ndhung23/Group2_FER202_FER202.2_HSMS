import { Card, Row, Col, Button, Table, Badge, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

function CustomerDashboard() {
  const recentOrders = [
    { code: "#BK001", service: "Dọn dẹp nhà cửa", time: "03/03/2026 09:00", status: "Đã xác nhận", total: "240.000đ" },
    { code: "#BK002", service: "Giặt ủi", time: "01/03/2026 14:00", status: "Hoàn thành", total: "150.000đ" },
    { code: "#BK003", service: "Nấu ăn gia đình", time: "28/02/2026 17:00", status: "Hoàn thành", total: "300.000đ" },
    { code: "#BK004", service: "Vệ sinh máy lạnh", time: "25/02/2026 16:00", status: "Đã hủy", total: "150.000đ" }
  ];

  const statusVariant = (status) => {
    if (status === "Hoàn thành") return "success";
    if (status === "Đã xác nhận") return "warning";
    if (status === "Đã hủy") return "secondary";
    return "primary";
  };

  return (
    <Row style={{ minHeight: "70vh" }}>
      <Col xs={12} md={2} className="mb-3 mb-md-0">
        <Card className="shadow-sm border-0 rounded-4 h-100">
          <Card.Body>
            <div className="fw-bold mb-3">Khách hàng</div>
            <div className="d-flex flex-column gap-2">
              <Button variant="light" className="text-start w-100">
                Tổng quan
              </Button>
              <Button as={Link} to="/customer/bookings" variant="light" className="text-start w-100">
                Đơn đã đặt
              </Button>
              <Button variant="light" className="text-start w-100">
                Địa chỉ
              </Button>
              <Button variant="light" className="text-start w-100">
                Thanh toán
              </Button>
              <Button variant="light" className="text-start w-100">
                Mã giảm giá
              </Button>
              <Button variant="light" className="text-start w-100">
                Cài đặt
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col xs={12} md={10}>
        <h2 className="mb-2">Chào mừng trở lại, Lan Anh! 👋</h2>
        <div className="hj-muted mb-4">
          Hôm nay bạn muốn dọn dẹp nhà cửa không?
        </div>

        <Row className="mb-3">
          <Col md={{ span: 8, offset: 2 }}>
            <Form.Control placeholder="Tìm kiếm đơn hàng, mã đơn, dịch vụ..." />
          </Col>
        </Row>

        <Row className="g-3 mb-4">
          <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body>
              <div className="hj-muted">Tổng đơn hàng</div>
              <div className="fs-3 fw-bold mt-1">12</div>
            </Card.Body>
          </Card>
          </Col>
          <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body>
              <div className="hj-muted">Đang thực hiện</div>
              <div className="fs-3 fw-bold mt-1">2</div>
            </Card.Body>
          </Card>
          </Col>
          <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body>
              <div className="hj-muted">Đã hoàn thành</div>
              <div className="fs-3 fw-bold mt-1 text-success">10</div>
            </Card.Body>
          </Card>
          </Col>
          <Col md={3}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body>
              <div className="hj-muted">Ví HomeJoy</div>
              <div className="fs-3 fw-bold mt-1">500.000đ</div>
            </Card.Body>
          </Card>
          </Col>
        </Row>

        <Card className="shadow-sm border-0 rounded-4">
          <Card.Header className="d-flex justify-content-between align-items-center bg-white border-0 pb-0">
            <div className="fw-semibold">Đơn hàng gần đây</div>
            <Button as={Link} to="/customer/bookings" variant="link" className="text-decoration-none px-0">
              Xem tất cả →
            </Button>
          </Card.Header>
          <Card.Body>
            <Table hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Dịch vụ</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                  <th>Tổng tiền</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.code}>
                    <td>
                      <Button variant="link" className="p-0 text-decoration-none">
                        {o.code}
                      </Button>
                    </td>
                    <td>{o.service}</td>
                    <td>{o.time}</td>
                    <td>
                      <Badge bg={statusVariant(o.status)}>{o.status}</Badge>
                    </td>
                    <td>{o.total}</td>
                    <td>
                      <Button size="sm" variant="outline-primary">
                        Chi tiết
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

export default CustomerDashboard;