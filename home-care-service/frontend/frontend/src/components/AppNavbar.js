import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { getToken, getRole, getUser, logout } from "../utils/auth";

export default function AppNavbar() {
  const navigate = useNavigate();
  const token = getToken();
  const role = getRole();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleLabel = (r) => {
    if (r === "ADMIN") return "Quản trị viên";
    if (r === "HELPER") return "Người giúp việc";
    return "Khách hàng";
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
                <div
                  className="d-flex align-items-center gap-2 me-3 pe-3 border-end"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (role === "ADMIN") navigate("/admin");
                    else if (role === "HELPER") navigate("/helper");
                    else navigate("/customer");
                  }}
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="avatar"
                      style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center bg-primary text-white fw-bold"
                      style={{ width: "40px", height: "40px", borderRadius: "50%", fontSize: "16px" }}
                    >
                      {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <div className="d-flex flex-column justify-content-center">
                    <span className="fw-semibold lh-1" style={{ color: "#1e293b", fontSize: "15px" }}>
                      {user?.fullName || "User"}
                    </span>
                    <span className="lh-1 mt-1" style={{ color: "#64748b", fontSize: "12px" }}>
                      {getRoleLabel(role)}
                    </span>
                  </div>
                </div>

                <Button size="sm" variant="outline-danger" className="rounded-pill px-3 fw-semibold" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}