import { Container, Row, Col, Card, Form, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <>
      <section className="hj-hero">
        <Container>
          <Row className="align-items-center gy-4">
            <Col lg={6}>
              <Badge bg="warning" text="dark" className="rounded-pill px-3 py-2 mb-3">
                Giải pháp giúp việc gia đình số 1
              </Badge>
              <h1 className="hj-hero-title mb-3">
                Đặt giúp việc uy tín <span style={{ color: "#0d6efd" }}>chỉ trong 1 phút</span>
              </h1>
              <p className="hj-hero-subtitle mb-4">
                HomeJoy kết nối bạn với những người giúp việc chuyên nghiệp, đã qua kiểm duyệt kỹ lưỡng.
                Tận hưởng thời gian bên gia đình (UI khung, chưa có nghiệp vụ).
              </p>

              <Card className="hj-hero-card p-2 p-md-3">
                <Card.Body>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Chọn dịch vụ</Form.Label>
                        <Form.Select defaultValue="">
                          <option value="" disabled>
                            Chọn dịch vụ
                          </option>
                          <option>Dọn dẹp nhà cửa</option>
                          <option>Giặt ủi</option>
                          <option>Nấu ăn gia đình</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Ngày</Form.Label>
                        <Form.Control type="date" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Giờ</Form.Label>
                        <Form.Control type="time" />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Địa chỉ của bạn</Form.Label>
                        <Form.Control placeholder="Ví dụ: Quận 1, TP.HCM" />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Button as={Link} to="/services" size="lg" className="w-100 rounded-3">
                        Đặt dịch vụ ngay
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6}>
              <div className="hj-hero-image" />
            </Col>
          </Row>
        </Container>
      </section>

      <section className="hj-section">
        <Container>
          <div className="text-center mb-4">
            <h2 className="hj-section-title">Khách hàng nói gì về HomeJoy</h2>
            <div className="hj-muted">Hàng ngàn gia đình đã tin tưởng và hài lòng với dịch vụ của chúng tôi.</div>
          </div>

          <Row className="g-3 g-lg-4">
            {[
              {
                name: "Chị Lan Anh",
                job: "Nhân viên văn phòng",
                quote: "Dịch vụ rất chuyên nghiệp, Helper đến đúng giờ và dọn dẹp rất kỹ."
              },
              {
                name: "Anh Minh Tuấn",
                job: "Kỹ sư",
                quote: "Đặt lịch nhanh chóng qua app. Rất tiện lợi cho người bận rộn."
              },
              {
                name: "Chị Thu Hà",
                job: "Kinh doanh tự do",
                quote: "Giá cả minh bạch, thao tác dễ dàng. Mình sẽ tiếp tục sử dụng."
              }
            ].map((t) => (
              <Col md={4} key={t.name}>
                <Card className="hj-card h-100">
                  <Card.Body>
                    <div className="mb-2" style={{ color: "#f59f00", fontWeight: 900 }}>
                      {"★★★★★"}
                    </div>
                    <div className="hj-muted mb-3">“{t.quote}”</div>
                    <div className="fw-bold">{t.name}</div>
                    <div className="hj-muted">{t.job}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="hj-section" style={{ background: "rgba(13,110,253,0.03)" }}>
        <Container>
          <Row className="align-items-end mb-3">
            <Col>
              <h2 className="hj-section-title mb-1">Helper nổi bật</h2>
              <div className="hj-muted">Những người giúp việc có đánh giá cao nhất trong tháng qua.</div>
            </Col>
            <Col xs="auto">
              <Button as={Link} to="/services" variant="link" className="text-decoration-none fw-semibold">
                Xem tất cả →
              </Button>
            </Col>
          </Row>

          <Row className="g-3 g-lg-4">
            {[
              { name: "Nguyễn Thị Hoa", rating: "4.9", tags: ["Dọn dẹp", "Nấu ăn"] },
              { name: "Trần Văn Nam", rating: "4.8", tags: ["Vệ sinh máy lạnh", "Sửa chữa điện nước"] },
              { name: "Lê Thị Mai", rating: "5.0", tags: ["Trông trẻ", "Dọn dẹp"] }
            ].map((h) => (
              <Col md={4} key={h.name}>
                <Card className="hj-card h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-center gap-3">
                        <div className="hj-avatar">{h.name.split(" ").slice(-1)[0].slice(0, 1)}</div>
                        <div>
                          <div className="fw-bold">{h.name}</div>
                          <div className="hj-muted" style={{ fontSize: 13 }}>
                            Kinh nghiệm: 3-5 năm (mock)
                          </div>
                        </div>
                      </div>
                      <div className="hj-rating">
                        <span>★</span>
                        <span>{h.rating}</span>
                      </div>
                    </div>

                    <div className="d-flex flex-wrap gap-2 mt-3">
                      {h.tags.map((tag) => (
                        <Badge bg="light" text="dark" className="border" key={tag}>
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <Button className="w-100 rounded-3 mt-4" variant="outline-primary">
                      Xem chi tiết
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="hj-section">
        <Container>
          <div className="text-center mb-4">
            <h2 className="hj-section-title">Dịch vụ nổi bật</h2>
            <div className="hj-muted">Các giải pháp chăm sóc nhà cửa để bạn có thêm thời gian tận hưởng cuộc sống.</div>
          </div>

          <Row className="g-3 g-lg-4">
            {[
              { title: "Dọn dẹp nhà cửa", desc: "Quét dọn, lau chùi, sắp xếp đồ đạc cơ bản." },
              { title: "Giặt ủi", desc: "Giặt, phơi và gấp quần áo chuyên nghiệp." },
              { title: "Nấu ăn gia đình", desc: "Chuẩn bị bữa cơm ngon, hợp vệ sinh." }
            ].map((s) => (
              <Col md={4} key={s.title}>
                <Card className="hj-card h-100">
                  <Card.Body>
                    <div className="d-flex align-items-center gap-3">
                      <div className="hj-avatar" style={{ borderRadius: 14 }}>
                        ✓
                      </div>
                      <div>
                        <div className="fw-bold">{s.title}</div>
                        <div className="hj-muted">{s.desc}</div>
                      </div>
                    </div>
                    <Button as={Link} to="/services" variant="link" className="text-decoration-none fw-semibold px-0 mt-3">
                      Xem chi tiết →
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="hj-cta">
        <Container>
          <div className="hj-cta-box text-center">
            <h2 className="hj-section-title mb-2" style={{ color: "#fff" }}>
              Sẵn sàng để ngôi nhà của bạn tỏa sáng?
            </h2>
            <div style={{ opacity: 0.9 }}>
              Tham gia cùng 50,000+ gia đình đã tin tưởng sử dụng HomeJoy mỗi ngày (UI khung).
            </div>
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 mt-4">
              <Button as={Link} to="/customer/bookings/new" variant="light" className="rounded-pill px-4">
                Đặt lịch ngay bây giờ
              </Button>
              <Button as={Link} to="/register" variant="warning" className="rounded-pill px-4">
                Đăng ký thành viên
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}