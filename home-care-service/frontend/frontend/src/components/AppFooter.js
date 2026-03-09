import { Container, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function AppFooter() {
  return (
    <footer className="hj-footer mt-5">
      <Container>
        <Row className="gy-4">
          <Col md={4}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="hj-logo">H</span>
              <span className="hj-footer-title mb-0">HomeCare</span>
            </div>
            <div className="hj-muted" style={{ color: "rgba(255,255,255,0.72)" }}>
              HomeCare là nền tảng giúp việc gia đình hàng đầu, kết nối hàng ngàn gia đình
              với những người giúp việc tận tâm và chuyên nghiệp.
            </div>
          </Col>

          <Col md={3}>
            <div className="hj-footer-title">Dịch vụ</div>
            <div className="d-flex flex-column gap-2">
              <NavLink to="/services">Dọn dẹp nhà cửa</NavLink>
              <NavLink to="/services">Giặt ủi</NavLink>
              <NavLink to="/services">Nấu ăn gia đình</NavLink>
            </div>
          </Col>

          <Col md={3}>
            <div className="hj-footer-title">Chính sách</div>
            <div className="d-flex flex-column gap-2">
              <a href="#policy-privacy" onClick={(e) => e.preventDefault()}>
                Chính sách bảo mật
              </a>
              <a href="#policy-terms" onClick={(e) => e.preventDefault()}>
                Điều khoản sử dụng
              </a>
              <a href="#policy-refund" onClick={(e) => e.preventDefault()}>
                Chính sách hoàn tiền
              </a>
            </div>
          </Col>

          <Col md={2}>
            <div className="hj-footer-title">Liên hệ</div>
            <div className="d-flex flex-column gap-2">
              <div>1900 1234</div>
              <div>support@HomeCare.vn</div>
              <div>128 Yên Lãng, Đống Đa, TP.HN</div>
            </div>
          </Col>
        </Row>

        <div className="hj-footer-divider text-center">
          © {new Date().getFullYear()} HomeCare, All Rights Reserved
        </div>
      </Container>
    </footer>
  );
}

