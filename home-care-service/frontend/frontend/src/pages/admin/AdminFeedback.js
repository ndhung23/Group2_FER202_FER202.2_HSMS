import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FeedbackCustomer from './FeedbackCustomer';
import AdminSidebar from './components/AdminSidebar';
import './ui/uiBaseic.css';

export default function AdminFeedback() {

  return (
    <div className="dashboard-container">
      <Row className="g-4">
        {/* Left Sidebar Menu */}
        <Col xs={12} md={3} lg={2}>
          <AdminSidebar />
        </Col>

        {/* Right Content */}
        <Col xs={12} md={9} lg={10}>
          <div className="mb-4">
            <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
              Quản lý Feedback
            </h2>
            <div style={{ color: "#64748b" }}>
              Xem và phân tích phản hồi từ khách hàng.
            </div>
          </div>

          <FeedbackCustomer />
        </Col>
      </Row>
    </div>
  );
}
