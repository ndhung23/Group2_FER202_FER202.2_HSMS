import { Container, Navbar, Nav } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";
import { getToken } from "../utils/auth.js";

const MainLayout = () => {
  const token = getToken();

  return (
    <>
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={NavLink} to="/">
            HSMS Marketplace
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <Nav.Link as={NavLink} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/services">
                Services
              </Nav.Link>
            </Nav>
            <Nav>
              {!token && (
                <>
                  <Nav.Link as={NavLink} to="/login">
                    Login
                  </Nav.Link>
                  <Nav.Link as={NavLink} to="/register">
                    Register
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="mb-4">
        <Outlet />
      </Container>
    </>
  );
};

export default MainLayout;

