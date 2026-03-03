import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import CustomerDashboardPage from "./pages/CustomerDashboardPage.jsx";
import CustomerBookingsPage from "./pages/CustomerBookingsPage.jsx";
import CustomerCreateBookingPage from "./pages/CustomerCreateBookingPage.jsx";
import HelperDashboardPage from "./pages/HelperDashboardPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import AdminServicesPage from "./pages/AdminServicesPage.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RoleRoute from "./components/RoleRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/services" element={<ServicesPage />} />

          {/* Customer routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute allowedRoles={["CUSTOMER"]} />}>
              <Route path="/customer" element={<CustomerDashboardPage />} />
              <Route
                path="/customer/bookings"
                element={<CustomerBookingsPage />}
              />
              <Route
                path="/customer/bookings/new"
                element={<CustomerCreateBookingPage />}
              />
            </Route>
          </Route>

          {/* Helper routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute allowedRoles={["HELPER"]} />}>
              <Route path="/helper" element={<HelperDashboardPage />} />
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route
                path="/admin/services"
                element={<AdminServicesPage />}
              />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
