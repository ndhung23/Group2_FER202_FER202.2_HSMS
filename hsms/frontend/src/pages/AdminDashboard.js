import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="card p-4">
      <h2>Admin Dashboard</h2>
      <Link className="btn btn-primary" to="/admin/services">Manage Services</Link>
    </div>
  );
}
