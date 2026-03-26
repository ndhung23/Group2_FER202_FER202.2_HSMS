import React, { useEffect, useState, useMemo } from 'react';
import { Card, Table, Row, Col, Button, Pagination, ButtonGroup } from 'react-bootstrap';
import axios from 'axios';
import AdminSidebar from './components/AdminSidebar';
import './ui/uiBaseic.css';

export default function AdminReports() {
    const [payments, setPayments] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Filter by Time
    const [timeFilter, setTimeFilter] = useState('ALL'); // 'WEEK', 'MONTH', 'YEAR', 'ALL'

    useEffect(() => {
        const getData = async () => {
            try {
                const [resPayments, resUsers] = await Promise.all([
                    axios.get("http://localhost:9999/payments"),
                    axios.get("http://localhost:9999/users")
                ]);
                setPayments(resPayments.data || []);
                setUsers(resUsers.data || []);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };
        getData();
    }, []);

    const getUserName = (id) => {
        const u = users.find(user => String(user.id) === String(id));
        return u ? u.fullName : "Unknown";
    };

    const formatCurrency = (value) => {
        return value.toLocaleString("vi-VN") + " đ";
    };

    const filteredPayments = useMemo(() => {
        if (timeFilter === 'ALL') return payments;

        const now = new Date();
        return payments.filter(p => {
            if (!p.paidAt) return false;
            const paidDate = new Date(p.paidAt);

            if (timeFilter === 'WEEK') {
                const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return paidDate >= oneWeekAgo && paidDate <= now;
            }
            if (timeFilter === 'MONTH') {
                return paidDate.getMonth() === now.getMonth() && paidDate.getFullYear() === now.getFullYear();
            }
            if (timeFilter === 'YEAR') {
                return paidDate.getFullYear() === now.getFullYear();
            }
            return true;
        });
    }, [payments, timeFilter]);

    // Tổng doanh thu chỉ tính các đơn PAID trong danh sách đã lọc
    const totalRevenue = filteredPayments
        .filter(p => p.status === "PAID")
        .reduce((sum, p) => sum + (p.amount || 0), 0);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

    const handleFilterChange = (filter) => {
        setTimeFilter(filter);
        setCurrentPage(1); // Reset page về 1 khi đổi bộ lọc
    };

    return (
        <div className="dashboard-container">
            <Row className="g-4">
                {/* Left Sidebar Menu */}
                <Col xs={12} md={3} lg={2}>
                    <AdminSidebar />
                </Col>

                {/* Right Content */}
                <Col xs={12} md={9} lg={10}>
                    <div className="mb-4 d-flex justify-content-between align-items-center">
                        <div>
                            <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
                                Báo cáo doanh thu
                            </h2>
                            <div style={{ color: "#64748b" }}>
                                Thống kê thu nhập và giao dịch tài chính.
                            </div>
                        </div>

                        <Button variant="outline-primary" className="rounded-3 px-4">
                            Tải báo cáo PDF
                        </Button>
                    </div>

                    <Row className="mb-4 align-items-center">
                        <Col md={12} lg={4}>
                            <Card className="border-0 shadow-sm rounded-4 bg-primary text-white h-100">
                                <Card.Body className="p-4 text-center d-flex flex-column justify-content-center">
                                    <div className="mb-2" style={{ opacity: 0.8 }}>Tổng doanh thu (PAID)</div>
                                    <h2 className="fw-bold mb-0">{formatCurrency(totalRevenue)}</h2>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={12} lg={8}>
                            <Card className="border-0 shadow-sm rounded-4 h-100">
                                <Card.Body className="d-flex align-items-center justify-content-between p-4">
                                    <div className="fw-semibold text-secondary">
                                        Bộ lọc thời gian:
                                    </div>
                                    <ButtonGroup>
                                        <Button
                                            variant={timeFilter === 'WEEK' ? 'primary' : 'outline-primary'}
                                            onClick={() => handleFilterChange('WEEK')}
                                        >
                                            Tuần này
                                        </Button>
                                        <Button
                                            variant={timeFilter === 'MONTH' ? 'primary' : 'outline-primary'}
                                            onClick={() => handleFilterChange('MONTH')}
                                        >
                                            Tháng này
                                        </Button>
                                        <Button
                                            variant={timeFilter === 'YEAR' ? 'primary' : 'outline-primary'}
                                            onClick={() => handleFilterChange('YEAR')}
                                        >
                                            Năm nay
                                        </Button>
                                        <Button
                                            variant={timeFilter === 'ALL' ? 'primary' : 'outline-primary'}
                                            onClick={() => handleFilterChange('ALL')}
                                        >
                                            Tất cả
                                        </Button>
                                    </ButtonGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Card className="border-0 shadow-sm rounded-4">
                        <Card.Header className="bg-white border-0 rounded-top-4 pt-4 px-4">
                            <div className="fw-bold fs-5" style={{ color: "#1e293b" }}>
                                Lịch sử giao dịch
                                {timeFilter === 'WEEK' && ' (7 ngày qua)'}
                                {timeFilter === 'MONTH' && ' (Tháng này)'}
                                {timeFilter === 'YEAR' && ' (Năm nay)'}
                            </div>
                        </Card.Header>

                        <Card.Body className="p-4">
                            <div className="table-responsive">
                                <Table hover bordered striped className="align-middle mb-0">
                                    <thead>
                                        <tr style={{ backgroundColor: "#f8fafc" }}>
                                            <th className="py-3">Mã GD (Payment ID)</th>
                                            <th className="py-3">Khách hàng</th>
                                            <th className="py-3">Phương thức</th>
                                            <th className="py-3 text-end">Số tiền</th>
                                            <th className="py-3 text-center">Thời gian thanh toán</th>
                                            <th className="py-3 text-center">Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.length > 0 ? (
                                            currentItems.map((p) => (
                                                <tr key={p.id}>
                                                    <td className="fw-semibold text-secondary">PAY-{p.id}</td>
                                                    <td className="fw-semibold">{getUserName(p.customerId)}</td>
                                                    <td>{p.method}</td>
                                                    <td className="text-end fw-bold text-success">{formatCurrency(p.amount)}</td>
                                                    <td className="text-center">{new Date(p.paidAt).toLocaleString("vi-VN")}</td>
                                                    <td className="text-center">
                                                        <span className={`badge bg-${p.status === 'PAID' ? 'success' : 'warning text-dark'} px-3 py-2 rounded-pill`}>
                                                            {p.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4 text-muted">
                                                    Chưa có giao dịch nào trong khoảng thời gian này
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>

                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center mt-4">
                                    <Pagination>
                                        <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                                        {[...Array(totalPages)].map((_, idx) => (
                                            <Pagination.Item key={idx + 1} active={idx + 1 === currentPage} onClick={() => setCurrentPage(idx + 1)}>
                                                {idx + 1}
                                            </Pagination.Item>
                                        ))}
                                        <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                                    </Pagination>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
