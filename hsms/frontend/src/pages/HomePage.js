import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="card p-4">
      <h1 className="h3">Home Service Marketplace</h1>
      <p>Đặt dịch vụ giúp việc theo giờ nhanh chóng.</p>
      <Link to="/services" className="btn btn-primary">Xem dịch vụ</Link>
    </div>
  );
}
