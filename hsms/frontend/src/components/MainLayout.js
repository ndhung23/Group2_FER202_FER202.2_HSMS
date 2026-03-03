import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function MainLayout() {
  const { user, logout } = useAuth();

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link className="navbar-brand" to="/">HSMS</Link>
          <div className="navbar-nav me-auto">
            <Link className="nav-link" to="/services">Services</Link>
            {user?.role === 'CUSTOMER' && <Link className="nav-link" to="/customer">Customer</Link>}
            {user?.role === 'HELPER' && <Link className="nav-link" to="/helper">Helper</Link>}
            {user?.role === 'ADMIN' && <Link className="nav-link" to="/admin">Admin</Link>}
          </div>
          <div className="d-flex gap-2">
            {!user ? (
              <>
                <Link className="btn btn-light btn-sm" to="/login">Login</Link>
                <Link className="btn btn-outline-light btn-sm" to="/register">Register</Link>
              </>
            ) : (
              <button className="btn btn-light btn-sm" onClick={logout}>Logout</button>
            )}
          </div>
        </div>
      </nav>
      <div className="container py-4">
        <Outlet />
      </div>
    </>
  );
}
