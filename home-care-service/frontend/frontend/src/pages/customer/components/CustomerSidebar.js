import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from "react-bootstrap";
import { useLocation, useNavigate } from 'react-router-dom';

export default function CustomerSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const getButtonClass = (path) => {
        if (location.pathname === path) {
            return "text-start w-100 fw-bold border-start border-primary border-4 bg-light text-primary";
        }
        return "text-start w-100 text-muted";
    };

    return (
        <Card className="shadow-sm border-0 rounded-4 h-100 position-sticky" style={{ top: "20px" }}>
            <Card.Body className="d-flex flex-column" style={{ minHeight: "60vh" }}>

                {/* User Info Overview */}
                <div className="text-center mb-4 pb-3 border-bottom">
                    <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-2 fw-bold"
                        style={{ width: "60px", height: "60px", fontSize: "24px" }}
                    >
                        {user ? user.fullName.charAt(0).toUpperCase() : "C"}
                    </div>
                    <h5 className="fw-bold text-dark mb-1">{user ? user.fullName : "Khách hàng"}</h5>
                    <Badge bg="info" className="fw-normal px-2 py-1">Hội viên Thân thiết</Badge>
                </div>

                {/* Navigation Menu */}
                <div className="d-flex flex-column gap-1 flex-grow-1">
                    <Button
                        variant="light"
                        className={getButtonClass("/customer")}
                        onClick={() => navigate("/customer")}
                    >
                        Tổng quan
                    </Button>
                    <Button
                        variant="light"
                        className={getButtonClass("/customer/bookings/new")}
                        onClick={() => navigate("/customer/bookings/new")}
                    >
                        Đặt dịch vụ mới
                    </Button>
                    <Button
                        variant="light"
                        className={getButtonClass("/customer/bookings")}
                        onClick={() => navigate("/customer/bookings")}
                    >
                        Lịch sử Đơn hàng
                    </Button>
                    <hr className="my-2" />
                    <Button
                        variant="light"
                        className={getButtonClass("/customer/profile")}
                        onClick={() => navigate("/customer/profile")}
                    >
                        Thông tin bản thân
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}
