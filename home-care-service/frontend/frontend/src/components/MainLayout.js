import { Outlet } from "react-router-dom";
import AppNavbar from "./AppNavbar";
import { Container } from "react-bootstrap";
import AppFooter from "./AppFooter";

export default function MainLayout() {
  return (
    <>
      <AppNavbar />
      <main>
        <Container className="mt-4">
          <Outlet />
        </Container>
      </main>
      <AppFooter />
    </>
  );
}