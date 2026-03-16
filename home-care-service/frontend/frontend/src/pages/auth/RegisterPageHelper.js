import axios from "axios";
import { useState } from "react";
import { Card, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function RegisterPageHelper() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "OTHER"
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateRegister = (name, value, currentForm = form) => {
    switch (name) {
      case "username":
        if (!value.trim()) return "Tên đăng nhập không được để trống.";
        if (value.trim().length < 2 || value.trim().length > 50) {
          return "Tên đăng nhập phải từ 2 ký tự trở lên.";
        }
        return "";
      case "lastName":
        if (value.trim().length > 0 && (value.trim().length < 2 || value.trim().length > 50)) {
          return "Tên phải từ 2 ký tự trở lên.";
        }
        return "";
      case "firstName":
        if (!value.trim()) return "Tên không được để trống.";
        if (value.trim().length < 2 || value.trim().length > 50) {
          return "Tên phải từ 2 ký tự trở lên.";
        }
        return "";
      case "email":
        if (!value.trim()) return "Email không được để trống.";
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value.trim())) {
          return "Email phải đúng định dạng.";
        }
        return "";
      case "phone":
        if (!value.trim()) return "Số điện thoại không được để trống.";
        if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(value.trim())) {
          return "Số điện thoại phải đúng định dạng.";
        }
        return "";
      case "password":
        if (!value) return "Mật khẩu không được để trống.";
        if (value.length < 6) {
          return "Mật khẩu phải có ít nhất 6 ký tự.";
        }
        if (!/[A-Z]/.test(value)) {
          return "Mật khẩu phải có ít nhất 1 chữ in hoa.";
        }
        if (!/[0-9]/.test(value)) {
          return "Mật khẩu phải có ít nhất 1 số.";
        }
        if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\];'/+=~`]/.test(value)) {
          return "Mật khẩu phải có ít nhất 1 ký tự đặc biệt.";
        }
        return "";
      case "confirmPassword":
        if (!value) return "Vui lòng nhập lại mật khẩu.";
        if (value !== currentForm.password) {
          return "Mật khẩu nhập lại không khớp.";
        }
        return "";
      case "age":
        if (String(value).trim() === "") return "Tuổi không được để trống.";
        if (isNaN(value) || parseInt(value, 10) < 12 || parseInt(value, 10) > 120) {
          return "Tuổi phải lớn hơn hoặc bằng 12.";
        }
        return "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      const error = validateRegister(key, form[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);
    setSuccess("");
    setErrors((prev) => ({
      ...prev,
      [name]: validateRegister(name, value, updatedForm),
      ...(name === "password" || name === "confirmPassword"
        ? {
            confirmPassword: validateRegister(
              "confirmPassword",
              updatedForm.confirmPassword,
              updatedForm
            )
          }
        : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    if (!validateForm()) return;

    try {
      setLoading(true);
      const checkUsername = await axios.get("http://localhost:9999/users", {
        params: { username: form.username.trim() }
      });
      if (checkUsername.data.length > 0) {
        setErrors((prev) => ({
          ...prev,
          username: "Tên đăng nhập đã tồn tại."
        }));
        return;
      }

      const checkEmail = await axios.get("http://localhost:9999/users", {
        params: { email: form.email.trim() }
      });
      if (checkEmail.data.length > 0) {
        setErrors((prev) => ({
          ...prev,
          email: "Email đã được sử dụng."
        }));
        return;
      }

      const newUser = {
        role: "HELPER",
        username: form.username.trim(),
        fullName: `${form.lastName.trim()} ${form.firstName.trim()}`.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        passwordHash: form.password,
        avatarUrl: "",
        status: "ACTIVE",
        age: parseInt(form.age, 10),
        gender: form.gender,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await axios.post("http://localhost:9999/users", newUser);
      setSuccess("Đăng ký nhân viên thành công. Đang chuyển sang trang đăng nhập...");
      setForm({
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        age: "",
        gender: "OTHER"
      });

      setTimeout(() => {
        navigate("/login", {
          state: {
            username: form.username
          }
        });
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        general: "Có lỗi xảy ra khi đăng ký nhân viên."
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center" style={{ minHeight: "70vh" }}>
      <div className="w-100" style={{ maxWidth: 520 }}>
        <div className="mb-3">
          <Link to="/" className="text-decoration-none">
            ← Về trang chủ
          </Link>
        </div>

        <Card className="shadow-sm border-0 rounded-4">
          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="hj-logo mb-2">H</div>
              <div className="fw-bold" style={{ color: "#f59f00" }}>
                HomeCare
              </div>
              <h2 className="mt-2 mb-1">Tạo tài khoản nhân viên</h2>
              <div className="hj-muted">
                Đăng ký trở thành nhân viên HomeCare để nhận và quản lý công việc.
              </div>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="username123"
                  isInvalid={!!errors.username}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </Form.Group>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Họ và tên đệm</Form.Label>
                    <Form.Control
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Nguyễn Long"
                      isInvalid={!!errors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.lastName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Tên</Form.Label>
                    <Form.Control
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="An"
                      isInvalid={!!errors.firstName}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.firstName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@gmail.com"
                  isInvalid={!!errors.email}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="0901234567"
                      isInvalid={!!errors.phone}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Tuổi</Form.Label>
                    <Form.Control
                      name="age"
                      type="number"
                      value={form.age}
                      onChange={handleChange}
                      placeholder="Nhập tuổi"
                      isInvalid={!!errors.age}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.age}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Giới tính</Form.Label>
                <Form.Select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Mật khẩu chứa ít nhất 6 ký tự"
                  isInvalid={!!errors.password}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Xác nhận mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  isInvalid={!!errors.confirmPassword}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>

              {errors.general && <Alert variant="danger">{errors.general}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Button
                type="submit"
                className="w-100 rounded-3"
                disabled={loading}
                style={{
                  background: "linear-gradient(90deg, #0d6efd 0%, #0b5ed7 50%, #0aa2c0 100%)",
                  border: "none",
                  boxShadow: "0 12px 30px rgba(13,110,253,0.35)"
                }}
              >
                {loading ? "Đang đăng ký..." : "Đăng ký nhân viên"}
              </Button>

              <div className="text-center hj-muted mt-3">
                Đã có tài khoản?{" "}
                <Link to="/login" className="text-decoration-none">
                  Đăng nhập
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default RegisterPageHelper;
