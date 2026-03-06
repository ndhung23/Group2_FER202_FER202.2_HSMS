import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { getToken, getRole, logout } from "../utils/auth";

export default function AppNavbar() {
  const navigate = useNavigate();
  const token = getToken();
  const role = getRole();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="white" variant="light" expand="lg" sticky="top" className="shadow-sm py-3">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="hj-navbar-brand">
          <span className="hj-logo">H</span>
          <span>HomeCare</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="hj-navbar" />
        <Navbar.Collapse id="hj-navbar">
          <Nav className="me-auto gap-lg-2">
            <Nav.Link className="hj-nav-link" as={NavLink} to="/">
              Trang chủ
            </Nav.Link>
            <Nav.Link className="hj-nav-link" as={NavLink} to="/services">
              Dịch vụ
            </Nav.Link>
            <Nav.Link
              className="hj-nav-link"
              as="a"
              href="#blog"
              onClick={(e) => e.preventDefault()}
            >
              Blog
            </Nav.Link>
            <Nav.Link
              className="hj-nav-link"
              as="a"
              href="#support"
              onClick={(e) => e.preventDefault()}
            >
              Hỗ trợ
            </Nav.Link>
          </Nav>

          <div className="d-flex align-items-center gap-2">
            {/* <Button
              as={NavLink}
              to="/register"
              variant="primary"
              className="rounded-pill px-3"
            >
              Trở thành Helper
            </Button> */}

            {!token ? (
              <>
                <Button as={NavLink} to="/login" variant="link" className="text-decoration-none">
                  Đăng nhập
                </Button>
                <Button
                  as={NavLink}
                  to="/register"
                  variant="outline-primary"
                  className="rounded-pill px-3"
                >
                  Đăng ký
                </Button>
              </>
            ) : (
              <>
                <Badge bg="light" text="dark" className="border">
                  Role: <span className="fw-semibold">{role}</span>
                </Badge>
                <Button
                  size="sm"
                  variant="outline-secondary"
                  className="rounded-pill px-3"
                  onClick={() => {
                    if (role === "ADMIN") navigate("/admin");
                    else if (role === "HELPER") navigate("/helper");
                    else navigate("/customer");
                  }}
                >
                  Dashboard
                </Button>
                <Button size="sm" variant="dark" className="rounded-pill px-3" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}