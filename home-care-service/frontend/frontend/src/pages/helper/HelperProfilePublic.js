import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Badge, Spinner } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function HelperProfilePublic() {
  const { id } = useParams();
  const [helper, setHelper] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHelper = async () => {
      try {
        const [resUser, resProfiles] = await Promise.all([
          axios.get(`http://localhost:9999/users/${id}`),
          axios.get(`http://localhost:9999/helperProfiles`)
        ]);

        // ✅ GHÉP GIỐNG TRANG LIST
        const profile = resProfiles.data.find(p => String(p.userId) === String(id)) || {};

        setHelper({
          ...resUser.data,
          ...profile
        });

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHelper();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-5"><Spinner /></div>;
  }

  if (!helper) return <div className="text-center mt-5">Không tìm thấy helper</div>;

  return (
    <div style={{ minHeight: "100vh", padding: "20px", background: "#f1f5f9" }}>
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-sm border-0 rounded-4">

            <Card.Header className="bg-white border-0 rounded-top-4 p-4 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">

                <div
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: "50%",
                    backgroundImage: `url(${helper.avatarUrl || "https://img.freepik.com/premium-vector/avatar-icon002_750950-52.jpg"})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                  }}
                />

                <div>
                  <div className="fw-bold fs-4">{helper.fullName}</div>

                  <div className="text-muted small">
                    {helper.gender === "FEMALE" ? "Nữ" : helper.gender === "MALE" ? "Nam" : "Khác"} • {helper.age || (new Date().getFullYear() - helper.birthYear)} tuổi
                  </div>

                  <div className="d-flex align-items-center gap-2 mt-1">
                    <Badge bg="warning" text="dark">
                      ⭐ {helper.avgRating || "Mới"}
                    </Badge>
                    <span className="text-muted small">
                      ({helper.totalReviews || 0} đánh giá)
                    </span>
                  </div>

                  <div className="text-muted small mt-1">
                    {helper.completedJobs || 0} chuyến đã hoàn thành
                  </div>
                </div>
              </div>

              <Badge bg={helper.status === 'ACTIVE' ? 'success' : 'danger'}>
                {helper.status}
              </Badge>
            </Card.Header>

            <Card.Body className="p-4 pt-0">
              <Row className="g-4">

                <Col md={12}>
                  <div className="text-muted">Giới thiệu</div>
                  <div className="fw-semibold">
                    {helper.bio || "Chưa có mô tả"}
                  </div>
                </Col>

                <Col md={6}>
                  <div className="text-muted">Trạng thái xác minh</div>
                  <div className="fw-semibold">
                    {helper.verifiedStatus === "VERIFIED" ? "Đã xác minh ✔" : "Chưa xác minh"}
                  </div>
                </Col>

                <Col md={6}>
                  <div className="text-muted">Tỷ lệ huỷ</div>
                  <div className="fw-semibold">
                    {((helper.cancellationRate || 0) * 100).toFixed(0)}%
                  </div>
                </Col>

                <Col md={6}>
                  <div className="text-muted">Đánh giá trung bình</div>
                  <div className="fw-semibold">
                    ⭐ {helper.avgRating || "Chưa có"}
                  </div>
                </Col>

                <Col md={6}>
                  <div className="text-muted">Số chuyến</div>
                  <div className="fw-semibold">
                    {helper.completedJobs || 0}
                  </div>
                </Col>

              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}