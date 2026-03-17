import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

export default function UserEdit() {
  const navigate = useNavigate();
  const { id } = useParams(); // có id => edit, không có => add

  // state dữ liệu form
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [status, setStatus] = useState("ACTIVE");
  const [passwordHash, setPasswordHash] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("OTHER");

  // state lỗi
  const [msgUsername, setMsgUsername] = useState("");
  const [msgFullName, setMsgFullName] = useState("");
  const [msgEmail, setMsgEmail] = useState("");
  const [msgPhone, setMsgPhone] = useState("");
  const [msgPassword, setMsgPassword] = useState("");
  const [msgAge, setMsgAge] = useState("");

  useEffect(() => {
    const getUserById = async () => {
      if (!id) return;

      try {
        const result = await axios.get(`http://localhost:9999/users/${id}`);
        const user = result.data;

        setUsername(user.username || "");
        setFullName(user.fullName || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
        setRole(user.role || "CUSTOMER");
        setStatus(user.status || "ACTIVE");
        setPasswordHash(user.passwordHash || "");
        setAvatarUrl(user.avatarUrl || "");
        setAge(user.age || "");
        setGender(user.gender || "OTHER");
      } catch (error) {
        console.error("Lỗi khi lấy user:", error);
        alert("Không tìm thấy người dùng");
        navigate("/admin");
      }
    };

    getUserById();
  }, [id, navigate]);

  function checkInput() {
    let flag = true;

    if (username.trim().length === 0) {
      flag = false;
      setMsgUsername("Tài khoản không được để trống");
    } else {
      setMsgUsername("");
    }

    if (fullName.trim().length === 0) {
      flag = false;
      setMsgFullName("Họ và tên không được để trống");
    } else {
      setMsgFullName("");
    }

    if (email.trim().length === 0) {
      flag = false;
      setMsgEmail("Email không được để trống");
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      flag = false;
      setMsgEmail("Email không đúng định dạng");
    } else {
      setMsgEmail("");
    }

    if (phone.trim().length === 0) {
      flag = false;
      setMsgPhone("Số điện thoại không được để trống");
    } else if (!/^[0-9]{10,11}$/.test(phone)) {
      flag = false;
      setMsgPhone("Số điện thoại phải gồm 10-11 chữ số");
    } else {
      setMsgPhone("");
    }

    if (!id && passwordHash.trim().length === 0) {
      flag = false;
      setMsgPassword("Mật khẩu không được để trống");
    } else {
      setMsgPassword("");
    }

    if (String(age).trim().length === 0) {
      flag = false;
      setMsgAge("Tuổi không được để trống");
    } else if (isNaN(age) || parseInt(age) < 18) {
      flag = false;
      setMsgAge("Tuổi phải lớn hơn hoặc bằng 18");
    } else {
      setMsgAge("");
    }

    return flag;
  }

  const handleSubmit = async () => {
    if (!checkInput()) return;

    const userData = {
      username,
      fullName,
      email,
      phone,
      role,
      status,
      passwordHash,
      avatarUrl,
      age: parseInt(age),
      gender
    };

    try {
      if (id) {
        const oldUserResult = await axios.get(`http://localhost:9999/users/${id}`);
        const oldUser = oldUserResult.data;

        const updatedUser = {
          ...oldUser,
          ...userData,
          updatedAt: new Date().toISOString()
        };

        await axios.put(`http://localhost:9999/users/${id}`, updatedUser);
        alert("Cập nhật người dùng thành công");
      } else {
        const newUser = {
          ...userData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        await axios.post("http://localhost:9999/users", newUser);
        alert("Thêm người dùng thành công");
      }

      navigate("/admin");
    } catch (error) {
      console.error("Lỗi khi lưu user:", error);
      alert("Thao tác thất bại");
    }
  };

  return (
    <Container fluid style={{ backgroundColor: "#f6f8fb", minHeight: "100vh", padding: "30px" }}>
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">
                {id ? "Cập nhật người dùng" : "Thêm người dùng mới"}
              </h2>

              <Row>
                <Col>
                  {msgUsername && <li style={{ color: "red" }}>{msgUsername}</li>}
                  {msgFullName && <li style={{ color: "red" }}>{msgFullName}</li>}
                  {msgEmail && <li style={{ color: "red" }}>{msgEmail}</li>}
                  {msgPhone && <li style={{ color: "red" }}>{msgPhone}</li>}
                  {msgPassword && <li style={{ color: "red" }}>{msgPassword}</li>}
                  {msgAge && <li style={{ color: "red" }}>{msgAge}</li>}
                </Col>
              </Row>

              <Row className="g-3 mt-1">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Họ và tên</Form.Label>
                    <Form.Control
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nhập họ và tên"
                    />
                    {msgFullName && <span style={{ color: "red" }}>{msgFullName}</span>}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Tài khoản</Form.Label>
                    <Form.Control
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Nhập tài khoản"
                    />
                    {msgUsername && <span style={{ color: "red" }}>{msgUsername}</span>}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control
                      value={passwordHash}
                      onChange={(e) => setPasswordHash(e.target.value)}
                      placeholder="Nhập tài khoản"
                    />
                    {msgPassword && <span style={{ color: "red" }}>{msgPassword}</span>}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Nhập email"
                    />
                    {msgEmail && <span style={{ color: "red" }}>{msgEmail}</span>}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Nhập số điện thoại"
                    />
                    {msgPhone && <span style={{ color: "red" }}>{msgPhone}</span>}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Tuổi</Form.Label>
                    <Form.Control
                      value={age}
                      type="number"
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Nhập tuổi"
                    />
                    {msgAge && <span style={{ color: "red" }}>{msgAge}</span>}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Giới tính</Form.Label>
                    <Form.Select value={gender} onChange={(e) => setGender(e.target.value)}>
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                      <option value="OTHER">Khác</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                {!id && (
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Mật khẩu</Form.Label>
                      <Form.Control
                        type="password"
                        value={passwordHash}
                        onChange={(e) => setPasswordHash(e.target.value)}
                        placeholder="Nhập mật khẩu"
                      />
                      {msgPassword && <span style={{ color: "red" }}>{msgPassword}</span>}
                    </Form.Group>
                  </Col>
                )}

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Avatar URL</Form.Label>
                    <Form.Control
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="Nhập link ảnh đại diện"
                    />
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Vai trò</Form.Label>
                    <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
                      <option value="ADMIN">Quản trị viên</option>
                      <option value="CUSTOMER">Khách hàng</option>
                      <option value="HELPER">Người giúp việc</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Trạng thái</Form.Label>
                    <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                      <option value="ACTIVE">Hoạt động</option>
                      <option value="INACTIVE">Ngừng</option>
                    </Form.Select>
                  </Form.Group>
                </Col>

                <Col xs={12} className="mt-4 d-flex gap-2">
                  <Button variant="success" onClick={handleSubmit}>
                    {id ? "Cập nhật" : "Thêm mới"}
                  </Button>
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