import { Card, Row, Col, Button, Table, Badge, Form } from "react-bootstrap";

function HelperDashboard() {
  const jobs = [
    { code: "#BK010", service: "Dọn dẹp nhà cửa", time: "04/03/2026 09:00", status: "Sắp diễn ra", earning: "150.000đ" },
    { code: "#BK008", service: "Giặt ủi", time: "03/03/2026 14:00", status: "Đang thực hiện", earning: "120.000đ" },
    { code: "#BK006", service: "Nấu ăn gia đình", time: "01/03/2026 18:00", status: "Hoàn thành", earning: "200.000đ" }
  ];

  const statusVariant = (status) => {
    if (status === "Hoàn thành") return "success";
    if (status === "Đang thực hiện") return "warning";
    if (status === "Sắp diễn ra") return "info";
    return "secondary";
  };

  return (
    <Row style={{ minHeight: "70vh" }}>
      <Col xs={12} md={2} className="mb-3 mb-md-0">
        <Card className="shadow-sm border-0 rounded-4 h-100">
          <Card.Body>
            <div className="fw-bold mb-3">Helper</div>
            <div className="d-flex flex-column gap-2">
              <Button variant="light" className="text-start w-100">
                Tổng quan
              </Button>
              <Button variant="light" className="text-start w-100">
                Lịch làm việc
              </Button>
              <Button variant="light" className="text-start w-100">
                Đơn được giao
              </Button>
              <Button variant="light" className="text-start w-100">
                Thu nhập
              </Button>
              <Button variant="light" className="text-start w-100">
                Đánh giá
              </Button>
              <Button variant="light" className="text-start w-100">
                Cài đặt
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col xs={12} md={10}>
        <h2 className="mb-2">Xin chào, Trần Thị B!</h2>
        <div className="hj-muted mb-4">
          Đây là bảng điều khiển công việc của bạn (UI khung).
        </div>

        <Row className="mb-3">
          <Col md={{ span: 8, offset: 2 }}>
            <Form.Control placeholder="Tìm kiếm đơn, khách hàng, địa chỉ..." />
          </Col>
        </Row>

        <Row className="g-3 mb-4">
          <Col md={3}>
            <Card className="shadow-sm border-0 rounded-4">
              <Card.Body>
                <div className="hj-muted">Đơn hôm nay</div>
                <div className="fs-3 fw-bold mt-1">3</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0 rounded-4">
              <Card.Body>
                <div className="hj-muted">Đơn tuần này</div>
                <div className="fs-3 fw-bold mt-1">8</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0 rounded-4">
              <Card.Body>
                <div className="hj-muted">Thu nhập tuần này</div>
                <div className="fs-3 fw-bold mt-1 text-success">1.200.000đ</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0 rounded-4">
              <Card.Body>
                <div className="hj-muted">Đánh giá trung bình</div>
                <div className="fs-3 fw-bold mt-1">4.8 ★</div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="shadow-sm border-0 rounded-4">
          <Card.Header className="d-flex justify-content-between align-items-center bg-white border-0 pb-0">
            <div className="fw-semibold">Đơn việc gần đây</div>
            <Button variant="link" className="text-decoration-none px-0">
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
                  <th>Thu nhập</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j.code}>
                    <td>{j.code}</td>
                    <td>{j.service}</td>
                    <td>{j.time}</td>
                    <td>
                      <Badge bg={statusVariant(j.status)}>{j.status}</Badge>
                    </td>
                    <td>{j.earning}</td>
                    <td>
                      <Button size="sm" variant="outline-primary">
                        Xem
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

export default HelperDashboard;