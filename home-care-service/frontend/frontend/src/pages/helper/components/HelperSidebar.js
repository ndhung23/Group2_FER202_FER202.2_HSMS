import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';

export default function HelperSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [helper, setHelper] = useState(null);

  useEffect(() => {
    // Get currently logged in user info (which is stored in localStorage by utils/auth.js)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setHelper(JSON.parse(storedUser));
    }
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getButtonClass = (path) => {
    return `text-start w-100 mb-2 py-2 px-3 border-0 rounded-3 text-secondary text-decoration-none d-block bg-transparent ${isActive(path) ? 'fw-bold text-primary bg-primary bg-opacity-10' : 'hover-bg-light'}`;
  };

  return (
    <Card className="shadow-sm border-0 rounded-4 h-100">
      <Card.Body className="d-flex flex-column p-4">
        <div className="fw-bold mb-4 fs-5 text-dark border-bottom pb-3">Helper Panel</div>

        {helper && (
          <div className="mb-4 d-flex align-items-center gap-3">
            <div
              className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-5"
              style={{ width: "45px", height: "45px" }}
            >
              {helper.fullName ? helper.fullName.charAt(0).toUpperCase() : "H"}
            </div>
            <div>
              <div className="fw-semibold text-dark">{helper.fullName}</div>
              <div className="text-muted" style={{ fontSize: "12px" }}>ID: {helper.id}</div>
            </div>
          </div>
        )}

        <div className="d-flex flex-column gap-1 flex-grow-1">
          <Button
            variant="light"
            className={getButtonClass("/helper")}
            onClick={() => navigate("/helper")}
          >
            Lịch hôm nay
          </Button>
          <Button
            variant="light"
            className={getButtonClass("/helper/schedule/weekly")}
            onClick={() => navigate("/helper/schedule/weekly")}
          >
            Lịch làm việc hàng tuần
          </Button>
          <Button
            variant="light"
            className={getButtonClass("/helper/income")}
            onClick={() => navigate("/helper/income")}
          >
            Thu nhập
          </Button>
          <Button
            variant="light"
            className={getButtonClass("/helper/history")}
            onClick={() => navigate("/helper/history")}
          >
            Lịch sử
          </Button>
          <Button
            variant="light"
            className={getButtonClass("/helper/reviews")}
            onClick={() => navigate("/helper/reviews")}
          >
            Đánh giá của khách
          </Button>
          <hr className="my-2" />
          <Button
            variant="light"
            className={getButtonClass("/helper/profile")}
            onClick={() => navigate("/helper/profile")}
          >
            Thông tin bản thân
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
