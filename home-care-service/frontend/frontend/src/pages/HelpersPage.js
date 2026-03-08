import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function HelpersPage() {
    const [helpers, setHelpers] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState("");
    const [ratingFilter, setRatingFilter] = useState("ALL");

    useEffect(() => {
        const fetchHelpersData = async () => {
            try {
                const [resUsers, resProfiles] = await Promise.all([
                    axios.get('http://localhost:9999/users?role=HELPER&status=ACTIVE'),
                    axios.get('http://localhost:9999/helperProfiles')
                ]);
                setHelpers(resUsers.data || []);
                setProfiles(resProfiles.data || []);
            } catch (error) {
                console.error("Lỗi tải dữ liệu người giúp việc:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHelpersData();
    }, []);

    // Ghép users với helperProfiles
    const combinedHelpers = useMemo(() => {
        return helpers.map(h => {
            const profile = profiles.find(p => String(p.userId) === String(h.id)) || {};
            return {
                ...h,
                ...profile
            };
        });
    }, [helpers, profiles]);

    // Apply Filters
    const filteredHelpers = useMemo(() => {
        let result = combinedHelpers;

        // Tên (Search Keyword)
        if (search) {
            const keyword = search.trim().toLowerCase();
            result = result.filter(h => h.fullName?.toLowerCase().includes(keyword));
        }

        // Lọc sao Rating
        if (ratingFilter !== "ALL") {
            const minRating = parseFloat(ratingFilter);
            result = result.filter(h => h.avgRating >= minRating);
        }

        // Sắp xếp ưu tiên: Theo đánh giá cao nhất -> Hoàn thành nhiều nhất
        result.sort((a, b) => {
            if (b.avgRating !== a.avgRating) {
                return (b.avgRating || 0) - (a.avgRating || 0);
            }
            return (b.completedJobs || 0) - (a.completedJobs || 0);
        });

        return result;
    }, [combinedHelpers, search, ratingFilter]);

    return (
        <div style={{ backgroundColor: "#f4f6f8", minHeight: "100vh", paddingBottom: "60px", paddingTop: "24px" }}>
            <Container>
                {/* Header / Hero Section */}
                <div className="bg-primary text-white py-5 mb-4 rounded-4 shadow-sm" style={{
                    background: "linear-gradient(135deg, #ebae45 0%, #e5e97f 100%)"
                }}>
                    <Container>
                    <Row className="align-items-center">
                        <Col md={10} lg={8}>
                            <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill mb-3 fw-bold shadow-sm">
                                Đội Ngũ Chuyên Ngiệp
                            </Badge>
                            <h1 className="fw-bold display-5 mb-3">Người Giúp Việc HomeCare</h1>
                            <p className="lead mb-0 text-white-50">
                                Đều đặn mỗi ngày, hàng nghìn nhân sự của chúng tôi đang nỗ lực mang lại không gian sống sạch sẽ và ngăn nắp cho các gia đình Việt.
                            </p>
                        </Col>
                    </Row>
                    </Container>
                </div>

                {/* Thanh Lọc & Tìm Kiếm */}
                <Card className="border-0 shadow-sm rounded-4 mb-5">
                    <Card.Body className="p-4">
                        <Row className="g-3">
                            <Col md={8} lg={9}>
                                <InputGroup className="input-group-lg">
                                    <InputGroup.Text className="bg-white border-end-0 text-muted">
                                        🔍
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder="Tìm kiếm theo tên người giúp việc..."
                                        className="border-start-0 ps-0 shadow-none"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={4} lg={3}>
                                <Form.Select
                                    className="form-select-lg shadow-none border-light-subtle"
                                    value={ratingFilter}
                                    onChange={(e) => setRatingFilter(e.target.value)}
                                >
                                    <option value="ALL">Mọi đánh giá sao</option>
                                    <option value="4.8">Từ 4.8 Sao trở lên ⭐⭐⭐⭐⭐</option>
                                    <option value="4.5">Từ 4.5 Sao trở lên ⭐⭐⭐⭐</option>
                                    <option value="4.0">Từ 4.0 Sao trở lên ⭐⭐⭐⭐</option>
                                </Form.Select>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Danh sách Card Helpers */}
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                        <div className="mt-3 text-muted">Đang tìm cộng tác viên...</div>
                    </div>
                ) : (
                    <>
                        {filteredHelpers.length === 0 ? (
                            <div className="text-center py-5">
                                <span className="display-1">🕵️</span>
                                <h4 className="mt-3 text-muted">Không tìm thấy người giúp việc phù hợp với bộ lọc</h4>
                            </div>
                        ) : (
                            <Row className="g-4">
                                {filteredHelpers.map(helper => (
                                    <Col key={helper.id} xs={12} sm={6} lg={4} xl={3}>
                                        <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden helper-card-hover" style={{ transition: "transform 0.2s" }}>
                                            <div className="text-center pt-4 pb-2 bg-light">
                                                <div
                                                    style={{
                                                        width: '100px',
                                                        height: '100px',
                                                        borderRadius: '50%',
                                                        margin: '0 auto',
                                                        backgroundImage: `url(${helper.avatarUrl || "https://img.freepik.com/premium-vector/avatar-icon002_750950-52.jpg"})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                        border: '4px solid white',
                                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                                    }}
                                                />
                                            </div>
                                            <Card.Body className="text-center">
                                                <h5 className="fw-bold mb-1">{helper.fullName}</h5>
                                                <div className="text-muted small mb-2">
                                                    {helper.gender === "FEMALE" ? "Nữ" : helper.gender === "MALE" ? "Nam" : "Khác"} • {helper.age || (new Date().getFullYear() - helper.birthYear)} tuổi
                                                </div>

                                                <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
                                                    <Badge bg="warning" text="dark" className="d-flex align-items-center gap-1 rounded-pill px-2">
                                                        ⭐ {helper.avgRating || "Mới"}
                                                    </Badge>
                                                    <span className="text-muted small">
                                                        ({helper.totalReviews || 0} Đánh giá)
                                                    </span>
                                                </div>

                                                <p className="card-text text-muted" style={{ fontSize: '14px', minHeight: '42px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {helper.bio || "Người giúp việc tận tâm theo tiêu chuẩn của HomeCare."}
                                                </p>

                                                <div className="border-top pt-3 d-flex justify-content-between text-muted" style={{ fontSize: '13px' }}>
                                                    <div>
                                                        <strong>{helper.completedJobs || 0}</strong> Chuyến
                                                    </div>
                                                    <div>
                                                        <span className="text-success">✔ Đã kiểm duyệt</span>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </>
                )}
            </Container>

            <style>{`
                .helper-card-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) !important;
                }
            `}</style>
        </div>
    );
}
