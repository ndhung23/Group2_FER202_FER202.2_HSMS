import { Navbar, Nav, Container, Button } from "react-bootstrap";
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
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          HomeCare
        </Navbar.Brand>

        <Nav className="me-auto">
          <Nav.Link as={NavLink} to="/">Home</Nav.Link>
          <Nav.Link as={NavLink} to="/services">Services</Nav.Link>
          <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
          <Nav.Link as={NavLink} to="/register">Register</Nav.Link>
        </Nav>

        {token && (
          <>
            <span className="text-white me-3">Role: {role}</span>
            <Button size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </>
        )}
      </Container>
    </Navbar>
  );
}