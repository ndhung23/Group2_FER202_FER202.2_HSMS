import React, { useEffect, useState, useMemo } from 'react';
import { Card, Row, Col, Badge, Table, Pagination } from "react-bootstrap";
import axios from 'axios';
import HelperSidebar from './components/HelperSidebar';

export default function HelperReviews() {
  const [helper, setHelper] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

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
      const [resReviews, resUsers] = await Promise.all([
        axios.get(`http://localhost:9999/reviews?helperId=${helperId}`),
        axios.get(`http://localhost:9999/users`)
      ]);
      setReviews(resReviews.data || []);
      setUsers(resUsers.data || []);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu Đánh Giá:", error);
    }
  };

  const getCustomerName = (customerId) => {
    const user = users.find(u => String(u.id) === String(customerId));
    return user ? user.fullName : "Khách ẩn danh";
  };

  const sortedReviews = useMemo(() => {
      // Sắp xếp mới nhất lên đầu
      return [...reviews].sort((a,b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [reviews]);

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";
    
  const count5Stars = reviews.filter(r => r.rating === 5).length;
  const count4Stars = reviews.filter(r => r.rating === 4).length;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedReviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedReviews.length / itemsPerPage) || 1;

  const renderStars = (rating) => {
    return [...Array(5)].map((star, index) => {
      index += 1;
      return (
        <span key={index} style={{ color: index <= rating ? "#fbbf24" : "#e2e8f0", fontSize: "16px" }}>
          ★
        </span>
      );
    });
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
                Đánh giá của khách hàng
              </h2>
              <div style={{ color: "#64748b" }}>
                Chất lượng dịch vụ 5 sao luôn là kim chỉ nam của chúng tôi.
              </div>
            </div>
            
            <div className="d-flex text-end bg-white p-3 rounded-4 shadow-sm border align-items-center gap-4">
               <div>
                  <div className="text-muted" style={{ fontSize: "13px" }}>Trung bình môn</div>
                  <h3 className="fw-bold text-warning mb-0">{avgRating} <span style={{fontSize: "20px"}}>★</span></h3>
               </div>
               <div className="border-start ps-4">
                  <div className="text-muted" style={{ fontSize: "13px" }}>Tổng lượt đánh giá</div>
                  <h4 className="fw-bold text-dark mb-0">{reviews.length}</h4>
               </div>
            </div>
          </div>

          <Card className="shadow-sm border-0 rounded-4">
            <Card.Header className="bg-white border-0 rounded-top-4 p-4 text-dark fw-bold fs-5">
               Tất cả đánh giá ({reviews.length})
            </Card.Header>
            <Card.Body className="p-4">
              <Table striped bordered hover responsive className="mb-0 align-middle">
                <thead>
                  <tr style={{ backgroundColor: "#f8fafc" }}>
                    <th className="py-3 text-center" style={{ width: "60px" }}>STT</th>
                    <th className="py-3">Khách hàng</th>
                    <th className="py-3">Mã Đơn</th>
                    <th className="py-3 text-center">Đánh giá (Sao)</th>
                    <th className="py-3">Nội dung / Nhận xét</th>
                    <th className="py-3 text-center">Ngày gửi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((r, idx) => (
                      <tr key={r.id}>
                        <td className="text-center">{indexOfFirstItem + idx + 1}</td>
                        <td className="fw-semibold text-dark">{getCustomerName(r.customerId)}</td>
                        <td className="text-secondary fw-bold">{r.bookingId}</td>
                        <td className="text-center">
                          {renderStars(r.rating)}
                        </td>
                        <td>
                          <p className="mb-1 text-dark" style={{ fontSize: "14px" }}>
                            {r.comment || <span className="fst-italic text-muted">Không có bình luận</span>}
                          </p>
                          {r.tags && r.tags.length > 0 && (
                            <div className="d-flex gap-1 flex-wrap mt-1">
                              {r.tags.map((t, i) => (
                                 <Badge key={i} bg="primary" bgOpacity={10} text="primary" pill className="fw-normal border border-primary px-2 py-1" style={{ fontSize: "11px" }}>
                                    ✓ {t}
                                 </Badge>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="text-center text-muted" style={{ fontSize: "13px" }}>
                           {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        Chưa có đánh giá nào từ khách hàng gửi về.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination className="mb-0">
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
