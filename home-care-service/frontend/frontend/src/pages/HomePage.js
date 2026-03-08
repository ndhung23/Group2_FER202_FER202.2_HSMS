import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import imageHomeCare from "../assets/imageHomeCare.jpg";

export default function HomePage() {
  const [services, setServices] = useState([]);
  const [helpers, setHelpers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resServices, resHelpers, resReviews] = await Promise.all([
        axios.get("http://localhost:9999/services?_limit=3"),
        axios.get("http://localhost:9999/users?role=HELPER"),
        axios.get("http://localhost:9999/reviews")
      ]);

      setServices(resServices.data || []);

      // Compute helper ratings
      const helpersData = resHelpers.data || [];
      const reviews = resReviews.data || [];

      const helpersWithStats = helpersData.map(h => {
        const hReviews = reviews.filter(r => String(r.helperId) === String(h.id));
        const avg = hReviews.length > 0
          ? (hReviews.reduce((sum, r) => sum + r.rating, 0) / hReviews.length).toFixed(1)
          : "5.0"; // Default
        return { ...h, rating: avg };
      }).sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).slice(0, 3); // Get top 3

      setHelpers(helpersWithStats);
    } catch (error) {
      console.error("Error fetching homepage data:", error);
    }
  };

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
                Đặt giúp việc uy tín
              </h1>
              <h1 className="hj-hero-title mb-3">
                <span style={{ color: "#0d6efd" }}>chỉ trong 1 phút</span>
              </h1>
              <p className="hj-hero-subtitle mb-4">
                HomeCare kết nối bạn với những người giúp việc chuyên nghiệp, đã qua kiểm duyệt kỹ lưỡng.
                Tận hưởng thời gian bên gia đình.
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
                          {services.map(s => (
                            <option key={s.id} value={s.id}>{s.name}</option>
                          ))}
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
              <img src={imageHomeCare} alt="HomeCare"
                style={{ paddingTop: "110px", width: "100%", height: "auto" }} />
              {/* style={{ width: "100%", height: "auto" } */}
            </Col>
          </Row>
        </Container>
      </section>

      <section className="hj-section">
        <Container>
          <div className="text-center mb-4">
            <h2 className="hj-section-title">Khách hàng nói gì về HomeCare</h2>
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
              <Button as={Link} to="/helpers" variant="link" className="text-decoration-none fw-semibold">
                Xem tất cả →
              </Button>
            </Col>
          </Row>

          <Row className="g-3 g-lg-4">
            {helpers.map((h) => (
              <Col md={4} key={h.id}>
                <Card className="hj-card h-100">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-center gap-3">
                        <div className="hj-avatar">{h.fullName.split(" ").slice(-1)[0].slice(0, 1).toUpperCase()}</div>
                        <div>
                          <div className="fw-bold">{h.fullName}</div>
                          <div className="hj-muted" style={{ fontSize: 13 }}>
                            Kinh nghiệm: {h.age ? Math.max(1, h.age - 20) : "2"} năm
                          </div>
                        </div>
                      </div>
                      <div className="hj-rating">
                        <span>★</span>
                        <span>{h.rating}</span>
                      </div>
                    </div>

                    <div className="d-flex flex-wrap gap-2 mt-3">
                      <Badge bg="light" text="dark" className="border">Chuyên nghiệp</Badge>
                      <Badge bg="light" text="dark" className="border">Nhiệt tình</Badge>
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
            {services.map((s) => (
              <Col md={4} key={s.id}>
                <Card className="hj-card h-100">
                  <Card.Body>
                    <div className="d-flex align-items-center gap-3">
                      <div className="hj-avatar" style={{ borderRadius: 14 }}>
                        ✓
                      </div>
                      <div>
                        <div className="fw-bold">{s.name}</div>
                        <div className="hj-muted">{s.description ? s.description.substring(0, 60) + "..." : "Dịch vụ chất lượng cao"}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-primary fw-bold">
                      {Number(s.basePrice).toLocaleString('vi-VN')} đ / {s.durationMinutes} phút
                    </div>
                    <Button as={Link} to="/customer/bookings/new" variant="link" className="text-decoration-none fw-semibold px-0 mt-2">
                      Đặt lịch ngay →
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
              Tham gia cùng 50,000+ gia đình đã tin tưởng sử dụng HomeCare mỗi ngày.
            </div>
            <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 mt-4">
              <Button as={Link} to="/customer/bookings/new" variant="light" className="rounded-pill px-4">
                Đặt lịch ngay bây giờ
              </Button>
              <Button as={Link} to="/error" variant="warning" className="rounded-pill px-4">
                Đăng ký thành viên
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}