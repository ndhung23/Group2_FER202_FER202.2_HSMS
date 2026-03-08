import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Table, Badge, Form, Pagination, Button, Modal } from "react-bootstrap";
import axios from 'axios';
import HelperSidebar from './components/HelperSidebar';

export default function HelperIncome() {
  const [helper, setHelper] = useState(null);
  const [payouts, setPayouts] = useState([]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setHelper(parsedUser);
      fetchData(parsedUser.id);
    }
  }, []);

  const fetchData = async (helperId) => {
    try {
      const resPayouts = await axios.get(`http://localhost:9999/payouts?helperId=${helperId}`);
      setPayouts(resPayouts.data || []);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Thu nhập:", error);
    }
  };

  const formatCurrency = (value) => Number(value).toLocaleString("vi-VN") + " đ";

  // Tổng quan thu nhập
  const totalEarningsAllTime = payouts
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + (p.helperAmount || 0), 0);

  const pendingEarnings = payouts
    .filter(p => p.status === 'PENDING' || p.status !== 'PAID')
    .reduce((sum, p) => sum + (p.helperAmount || 0), 0);

  // Lọc tìm kiếm mã booking/trạng thái trong ds Payouts
  const filteredPayouts = payouts.filter(p => {
    const keyword = search.trim().toLowerCase();
    const bCode = (p.bookingId || "").toString().toLowerCase(); 
    return bCode.includes(keyword) || p.status.toLowerCase().includes(keyword);
  }).sort((a,b) => new Date(b.paidAt || b.createdAt || 0) - new Date(a.paidAt || a.createdAt || 0));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayouts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayouts.length / itemsPerPage) || 1;

  const handleOpenDetail = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <div className="dashboard-container" style={{ minHeight: "80vh", padding: "20px" }}>
      <Row className="g-4">
        {/* Left Sidebar Menu */}
        <Col xs={12} md={4} lg={3}>
          <HelperSidebar />
        </Col>

        {/* Right Content */}
        <Col xs={12} md={8} lg={9}>
          <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
                Thu nhập của tôi
              </h2>
              <div style={{ color: "#64748b" }}>
                Bảng kê dòng tiền thực tế sau khi đã trừ phí hoa hồng môi giới.
              </div>
            </div>
            
            <div className="d-flex gap-3 text-end bg-white p-3 rounded-4 shadow-sm border">
               <div>
                  <div className="text-muted" style={{ fontSize: "14px" }}>Tổng tiền mặt (PAID)</div>
                  <h4 className="fw-bold text-success mb-0">{formatCurrency(totalEarningsAllTime)}</h4>
               </div>
               <div className="border-start ps-3">
                  <div className="text-muted" style={{ fontSize: "14px" }}>Đang chờ xử lý (PENDING)</div>
                  <h4 className="fw-bold text-warning mb-0">{formatCurrency(pendingEarnings)}</h4>
               </div>
            </div>
          </div>

          <Card className="shadow-sm border-0 rounded-4">
            <Card.Header className="bg-white border-0 rounded-top-4 pt-4 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div className="fw-bold fs-5" style={{ color: "#1e293b" }}>
                Lịch sử thanh toán chi tiết (Payouts Logs)
              </div>
              <Form.Control 
                placeholder="Tìm mã Booking ID..." 
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="rounded-3"
                style={{ width: "250px" }}
              />
            </Card.Header>
            <Card.Body className="p-4">
              <Table striped bordered hover responsive className="mb-0 align-middle">
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc" }}>
                    <th className="py-3 text-center">STT</th>
                    <th className="py-3">Mã phiếu lương</th>
                    <th className="py-3">Mã Booking</th>
                    <th className="py-3 text-end">Tổng hóa đơn</th>
                    <th className="py-3 text-center">Phí nền tảng</th>
                    <th className="py-3 text-end">Thực lĩnh</th>
                    <th className="py-3 text-center">Trạng thái</th>
                    <th className="py-3 text-center">Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((p, idx) => (
                      <tr key={p.id}>
                        <td className="text-center">{indexOfFirstItem + idx + 1}</td>
                        <td className="fw-semibold text-secondary">PO-{p.id}</td>
                        <td className="fw-bold text-dark">{p.bookingId}</td>
                        <td className="text-end fw-semibold text-secondary">{formatCurrency(p.grossAmount || 0)}</td>
                        <td className="text-center text-danger">{(p.commissionRate * 100)}% ({formatCurrency(p.commissionAmount || 0)})</td>
                        <td className="text-end fw-bold text-success">{formatCurrency(p.helperAmount || 0)}</td>
                        <td className="text-center">
                          <Badge bg={p.status === 'PAID' ? 'success' : 'warning text-dark'} pill className="px-3 py-2">
                             {p.status}
                          </Badge>
                        </td>
                        <td className="text-center">
                          <Button variant="outline-info" size="sm" onClick={() => handleOpenDetail(p)} title="Xem chi tiết">
                            👁️
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4 text-muted">
                        Bạn chưa có bản ghi thanh toán lương nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

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

      {/* Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết thu nhập</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <div className="d-flex flex-column gap-3">
               <div><strong>Mã phiếu (Payout ID):</strong> PO-{selectedItem.id}</div>
               <div><strong>Mã Booking gốc:</strong> {selectedItem.bookingId}</div>
               <div><strong>Tiền khách trả (Gross):</strong> {formatCurrency(selectedItem.grossAmount || 0)}</div>
               <div><strong>Phí dịch vụ nền tảng ({(selectedItem.commissionRate * 100)}%):</strong> <span className="text-danger">-{formatCurrency(selectedItem.commissionAmount || 0)}</span></div>
               <div className="fs-5 mt-2"><strong>Tổng thực nhận ròng (Net):</strong> <span className="text-success fw-bold">{formatCurrency(selectedItem.helperAmount || 0)}</span></div>
               <hr/>
               <div><strong>Trạng thái:</strong> <Badge bg={selectedItem.status === 'PAID' ? 'success' : 'warning'}>{selectedItem.status}</Badge></div>
               <div><strong>Ngày thanh toán:</strong> {selectedItem.paidAt ? new Date(selectedItem.paidAt).toLocaleString("vi-VN") : "Đang chờ gửi tiền"}</div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}
