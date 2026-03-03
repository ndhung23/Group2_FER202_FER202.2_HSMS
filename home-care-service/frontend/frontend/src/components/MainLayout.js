import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import { Container } from "react-bootstrap";

export default function MainLayout() {
  return (
    <>
      <AppNavbar />
      <Container className="mt-4">
        <Outlet />
      </Container>
    </>
  );
}