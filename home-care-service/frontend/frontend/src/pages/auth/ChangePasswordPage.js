import axios from "axios";
import { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";

function ChangePasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = location.state?.userId;
  const username = location.state?.username;
  const email = location.state?.email;

  const [form, setForm] = useState({
    otp: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateChangePassword = (name, value, currentForm = form) => {
    switch (name) {
      case "otp":
        if (!value) return "Vui lòng nhập mã OTP.";
        if (!/^\d{6}$/.test(value)) return "OTP phải gồm 6 chữ số.";
        return "";

      case "password":
        if (!value) return "Mật khẩu không được để trống.";
        if (value.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự.";
        if (!/[A-Z]/.test(value)) return "Mật khẩu phải có ít nhất 1 chữ in hoa.";
        if (!/[0-9]/.test(value)) return "Mật khẩu phải có ít nhất 1 số.";
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

      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(form).forEach((key) => {
      const error = validateChangePassword(key, form[key], form);
      if (error) newErrors[key] = error;
    });

    if (!userId || !email) {
      newErrors.general = "Phiên đổi mật khẩu không hợp lệ. Vui lòng thực hiện lại.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    const finalValue =
      name === "otp" ? value.replace(/\D/g, "").slice(0, 6) : value;

    const updatedForm = { ...form, [name]: finalValue };

    setForm(updatedForm);
    setSuccess("");

    setErrors((prev) => ({
      ...prev,
      [name]: validateChangePassword(name, finalValue, updatedForm),
      ...(name === "password" || name === "confirmPassword"
        ? {
            confirmPassword: validateChangePassword(
              "confirmPassword",
              updatedForm.confirmPassword,
              updatedForm
            )
          }
        : {}),
      general: ""
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    if (!validateForm()) return;

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/verify-otp", {
        email,
        otp: form.otp
      });

      await axios.patch(`http://localhost:9999/users/${userId}`, {
        passwordHash: form.password,
        updatedAt: new Date().toISOString()
      });

      setSuccess("Đổi mật khẩu thành công. Đang chuyển sang trang đăng nhập...");

      setForm({
        otp: "",
        password: "",
        confirmPassword: ""
      });

      setTimeout(() => {
        navigate("/login", {
          state: { username }
        });
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        general: err?.response?.data?.message || "Có lỗi xảy ra khi đổi mật khẩu."
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center" style={{ minHeight: "70vh" }}>
      <div className="w-100" style={{ maxWidth: 440 }}>
        <div className="mb-3">
          <Link to="/login" className="text-decoration-none">
            ← Về đăng nhập
          </Link>
        </div>

        <Card className="shadow-sm border-0 rounded-4">
          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="hj-logo mb-2">H</div>
              <div className="fw-bold" style={{ color: "#f59f00" }}>
                HomeCare
              </div>
              <h2 className="mt-2 mb-1">Đổi mật khẩu</h2>
              <div className="hj-muted">
                Nhập OTP đã gửi tới email và mật khẩu mới.
              </div>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Mã OTP</Form.Label>
                <Form.Control
                  name="otp"
                  value={form.otp}
                  onChange={handleChange}
                  placeholder="Nhập OTP 6 số"
                  isInvalid={!!errors.otp}
                  maxLength={6}
                  className="text-center fw-bold fs-5"
                  style={{ letterSpacing: "8px" }}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.otp}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Mật khẩu mới</Form.Label>
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

              {errors.general && (
                <Alert variant="danger">{errors.general}</Alert>
              )}

              {success && (
                <Alert variant="success">{success}</Alert>
              )}

              <Button
                type="submit"
                className="w-100 rounded-3"
                disabled={loading}
                style={{
                  background:
                    "linear-gradient(90deg, #0d6efd 0%, #0b5ed7 50%, #0aa2c0 100%)",
                  border: "none",
                  boxShadow: "0 12px 30px rgba(13,110,253,0.35)"
                }}
              >
                {loading ? "Đang đổi mật khẩu..." : "Đặt lại mật khẩu"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default ChangePasswordPage;