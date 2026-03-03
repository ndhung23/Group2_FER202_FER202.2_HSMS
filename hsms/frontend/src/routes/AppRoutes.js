import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ServicesPage from '../pages/ServicesPage';
import CustomerDashboard from '../pages/CustomerDashboard';
import CustomerBookingsPage from '../pages/CustomerBookingsPage';
import NewBookingPage from '../pages/NewBookingPage';
import HelperDashboard from '../pages/HelperDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import AdminServicesPage from '../pages/AdminServicesPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/services" element={<ServicesPage />} />

        <Route path="/customer" element={<ProtectedRoute roles={['CUSTOMER']}><CustomerDashboard /></ProtectedRoute>} />
        <Route path="/customer/bookings" element={<ProtectedRoute roles={['CUSTOMER']}><CustomerBookingsPage /></ProtectedRoute>} />
        <Route path="/customer/bookings/new" element={<ProtectedRoute roles={['CUSTOMER']}><NewBookingPage /></ProtectedRoute>} />

        <Route path="/helper" element={<ProtectedRoute roles={['HELPER']}><HelperDashboard /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/services" element={<ProtectedRoute roles={['ADMIN']}><AdminServicesPage /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
