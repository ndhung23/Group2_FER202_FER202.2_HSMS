import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

// Public
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ServicesPage from "./pages/ServicesPage";

// Customer
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerBookings from "./pages/CustomerBookings";
import CustomerCreateBooking from "./pages/CustomerCreateBooking";

// Helper
import HelperDashboard from "./pages/HelperDashboard";

// Admin
import AdminDashboard from "./pages/AdminDashboard";
import AdminServices from "./pages/AdminServices";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>

        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>

          {/* CUSTOMER */}
          <Route element={<RoleRoute allow={["CUSTOMER"]} />}>
            <Route path="/customer" element={<CustomerDashboard />} />
            <Route path="/customer/bookings" element={<CustomerBookings />} />
            <Route path="/customer/bookings/new" element={<CustomerCreateBooking />} />
          </Route>

          {/* HELPER */}
          <Route element={<RoleRoute allow={["HELPER"]} />}>
            <Route path="/helper" element={<HelperDashboard />} />
          </Route>

          {/* ADMIN */}
          <Route element={<RoleRoute allow={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/services" element={<AdminServices />} />
          </Route>

        </Route>

      </Route>
    </Routes>
  );
}

export default App;