import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminSidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    // Helper function to check if a route is active
    const isActive = (path) => location.pathname === path;

    return (
        <Card
            className="border-0 shadow-sm rounded-4 h-100"
            style={{ backgroundColor: "#ffffff" }}
        >
            <Card.Body className="p-3">
                <div className="fw-bold fs-5 mb-4">Admin Panel</div>

                <div className="d-grid gap-2">
                    <Button
                        variant={isActive("/admin") ? "success" : "light"}
                        className={`text-start rounded-3 py-2 ${isActive("/admin") ? "fw-semibold disabled" : "border"}`}
                        onClick={() => navigate("/admin")}
                    >
                        Tổng quan
                    </Button>
                    <Button
                        variant={isActive("/admin/services") ? "success" : "light"}
                        className={`text-start rounded-3 py-2 ${isActive("/admin/services") ? "fw-semibold disabled" : "border"}`}
                        onClick={() => navigate("/admin/services")}
                    >
                        Dịch vụ
                    </Button>
                    <Button
                        variant={isActive("/admin/bookings") ? "success" : "light"}
                        className={`text-start rounded-3 py-2 ${isActive("/admin/bookings") ? "fw-semibold disabled" : "border"}`}
                        onClick={() => navigate("/admin/bookings")}
                    >
                        Duyệt yêu cầu
                    </Button>
                    <Button
                        variant={isActive("/admin/schedule") ? "success" : "light"}
                        className={`text-start rounded-3 py-2 ${isActive("/admin/schedule") ? "fw-semibold disabled" : "border"}`}
                        onClick={() => navigate("/admin/schedule")}
                    >
                        Lịch làm việc
                    </Button>
                    <Button
                        variant={isActive("/admin/reports") ? "success" : "light"}
                        className={`text-start rounded-3 py-2 ${isActive("/admin/reports") ? "fw-semibold disabled" : "border"}`}
                        onClick={() => navigate("/admin/reports")}
                    >
                        Báo cáo
                    </Button>
                    <Button
                        variant={isActive("/admin/feedback") ? "success" : "light"}
                        className={`text-start rounded-3 py-2 ${isActive("/admin/feedback") ? "fw-semibold disabled" : "border"}`}
                        onClick={() => navigate("/admin/feedback")}
                    >
                        Feedback
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
}
