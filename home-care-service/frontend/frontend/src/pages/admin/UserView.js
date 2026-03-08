import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

export default function UserView() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [user, setUser] = useState({
        username: "",
        fullName: "",
        email: "",
        phone: "",
        role: "CUSTOMER",
        status: "ACTIVE",
        avatarUrl: "",
        age: "",
        gender: "OTHER",
        passwordHash: "",
    });

    useEffect(() => {
        const getUserById = async () => {
            try {
                const result = await axios.get(`http://localhost:9999/users/${id}`);
                setUser(result.data);
            } catch (error) {
                console.error("Lỗi khi lấy user:", error);
                alert("Không tìm thấy người dùng");
                navigate("/admin");
            }
        };

        if (id) getUserById();
    }, [id, navigate]);

    return (
        <Container fluid style={{ backgroundColor: "#f6f8fb", minHeight: "100vh", padding: "30px" }}>
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <Card className="shadow-sm border-0 rounded-4">
                        <Card.Body className="p-4">
                            <h2 className="text-center mb-4">Chi tiết người dùng</h2>

                            <Row className="g-3 mt-1">
                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label>Họ và tên</Form.Label>
                                        <Form.Control value={user.fullName} readOnly disabled />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Tài khoản</Form.Label>
                                        <Form.Control value={user.username} readOnly disabled />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Mật Khẩu tài khoản</Form.Label>
                                        <Form.Control value={user.passwordHash} readOnly disabled />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control value={user.email} readOnly disabled />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Số điện thoại</Form.Label>
                                        <Form.Control value={user.phone} readOnly disabled />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Tuổi</Form.Label>
                                        <Form.Control value={user.age} readOnly disabled />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Giới tính</Form.Label>
                                        <Form.Select value={user.gender} disabled>
                                            <option value="MALE">Nam</option>
                                            <option value="FEMALE">Nữ</option>
                                            <option value="OTHER">Khác</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Vai trò</Form.Label>
                                        <Form.Select value={user.role} disabled>
                                            <option value="ADMIN">Quản trị viên</option>
                                            <option value="CUSTOMER">Khách hàng</option>
                                            <option value="HELPER">Người giúp việc</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label>Trạng thái</Form.Label>
                                        <Form.Select value={user.status} disabled>
                                            <option value="ACTIVE">Hoạt động</option>
                                            <option value="INACTIVE">Ngừng</option>
                                            <option value="PENDING">Chờ duyệt</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>

                                <Col md={12}>
                                    <Form.Group>
                                        <Form.Label>Avatar URL</Form.Label>
                                        <Form.Control value={user.avatarUrl} readOnly disabled />
                                    </Form.Group>
                                </Col>

                                <Col xs={12} className="mt-4 d-flex justify-content-center">
                                    <Button variant="secondary" onClick={() => navigate("/admin")}>
                                        Quay lại
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
