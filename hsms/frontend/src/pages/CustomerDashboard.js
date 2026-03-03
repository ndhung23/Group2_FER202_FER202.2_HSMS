import React from 'react';
import { Link } from 'react-router-dom';

export default function CustomerDashboard() {
  return (
    <div className="card p-4">
      <h2>Customer Dashboard</h2>
      <div className="d-flex gap-2">
        <Link to="/customer/bookings" className="btn btn-outline-primary">My Bookings</Link>
        <Link to="/customer/bookings/new" className="btn btn-primary">Create Booking</Link>
      </div>
    </div>
  );
}
