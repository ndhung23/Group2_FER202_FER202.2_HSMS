import React, { useEffect, useState, useMemo } from 'react';
import { Card, Table, Badge, Form, Row, Col, Button, Pagination } from 'react-bootstrap';
import axios from 'axios';

export default function FeedbackCustomer() {
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const getData = async () => {
      try {
        const [resReviews, resUsers] = await Promise.all([
          axios.get("http://localhost:9999/reviews"),
          axios.get("http://localhost:9999/users")
        ]);
        setReviews(resReviews.data || []);
        setUsers(resUsers.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    getData();
  }, []);

  const getUserName = React.useCallback((id) => {
    const u = users.find(user => String(user.id) === String(id));
    return u ? u.fullName : "Unknown";
  }, [users]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const customerName = getUserName(r.customerId).toLowerCase();
      const helperName = getUserName(r.helperId).toLowerCase();
      const comment = (r.comment || "").toLowerCase();
      const keyword = search.trim().toLowerCase();

      const matchSearch = customerName.includes(keyword) || helperName.includes(keyword) || comment.includes(keyword);
      const matchRating = selectedRating ? String(r.rating) === selectedRating : true;

      return matchSearch && matchRating;
    });
  }, [reviews, search, selectedRating, getUserName]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  return (
    <Card className="border-0 shadow-sm rounded-4">
      <Card.Header className="bg-white border-0 rounded-top-4 pt-4 px-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <div className="fw-bold fs-5" style={{ color: "#1e293b" }}>
            Quản lý Feedback từ Khách hàng
          </div>
          <div style={{ fontSize: "14px", color: "#64748b" }}>
            Theo dõi đánh giá phản hồi của khách hàng về dịch vụ
          </div>
        </div>
      </Card.Header>

      <Card.Body className="p-4">
        <Row className="g-3 mb-4">
          <Col md={12} lg={6}>
            <Form.Control
              placeholder="Tìm kiếm theo tên khách hàng, tên người giúp việc, nội dung..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-3"
              style={{ height: "46px" }}
            />
          </Col>

          <Col md={6} lg={4}>
            <Form.Select
              value={selectedRating}
              onChange={(e) => {
                setSelectedRating(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-3"
              style={{ height: "46px" }}
            >
              <option value="">-- Lọc theo đánh giá --</option>
              <option value="5">5 Sao (Tuyệt vời)</option>
              <option value="4">4 Sao (Tốt)</option>
              <option value="3">3 Sao (Khá)</option>
              <option value="2">2 Sao (Kém)</option>
              <option value="1">1 Sao (Tệ)</option>
            </Form.Select>
          </Col>

          <Col md={12} lg={2}>
            <Button
              variant="light"
              className="w-100 rounded-3 border"
              style={{ height: "46px" }}
              onClick={() => {
                setSearch("");
                setSelectedRating("");
                setCurrentPage(1);
              }}
            >
              Xóa lọc
            </Button>
          </Col>
        </Row>

        <div className="table-responsive">
          <Table hover bordered striped className="align-middle mb-0">
            <thead>
              <tr style={{ backgroundColor: "#f8fafc" }}>
                <th className="py-3">Mã đơn</th>
                <th className="py-3">Khách hàng</th>
                <th className="py-3">Người giúp việc</th>
                <th className="py-3 text-center">Đánh giá</th>
                <th className="py-3">Nội dung</th>
                <th className="py-3">Ngày gửi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((r) => (
                  <tr key={r.id}>
                    <td className="fw-semibold">#{r.bookingId}</td>
                    <td>{getUserName(r.customerId)}</td>
                    <td>{getUserName(r.helperId)}</td>
                    <td className="text-center">
                      <Badge bg={r.rating >= 4 ? "success" : r.rating === 3 ? "warning" : "danger"} pill className="px-3 py-2">
                        {r.rating} Sao
                      </Badge>
                    </td>
                    <td>{r.comment || "Không có nội dung"}</td>
                    <td>{new Date(r.createdAt).toLocaleString("vi-VN")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    Không có feedback nào phù hợp
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
  );
}
