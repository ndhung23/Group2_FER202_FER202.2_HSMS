import { useState } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (value) => {
    if (!value.trim()) return "Email không được để trống.";
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(value.trim())) {
      return "Email phải đúng định dạng.";
    }
    return "";
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setSuccess("");
    setErrors((prev) => ({
      ...prev,
      email: validateEmail(value),
      general: ""
    }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setSuccess("");
    setErrors({});

    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get("http://localhost:9999/users", {
        params: { email: email.trim() }
      });

      const users = res.data;

      if (!users || users.length === 0) {
        setErrors({
          email: "Không tìm thấy tài khoản với email này."
        });
        return;
      }

      const user = users[0];

      await axios.post("http://localhost:5000/send-otp", {
        email: user.email
      });

      setSuccess("Đã gửi OTP về email. Đang chuyển trang...");

      setTimeout(() => {
        navigate("/change-password", {
          state: {
            userId: user.id,
            username: user.username,
            email: user.email
          }
        });
      }, 1000);
    } catch (err) {
      console.error(err);
      setErrors({
        general: err?.response?.data?.message || "Có lỗi xảy ra khi gửi OTP."
      });
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
              <h2 className="mt-2 mb-1">Quên mật khẩu</h2>
              <div className="hj-muted">
                Nhập email để nhận mã OTP đặt lại mật khẩu.
              </div>
            </div>

            <Form onSubmit={handleSendOtp}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="name@gmail.com"
                  isInvalid={!!errors.email}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
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
                {loading ? "Đang gửi OTP..." : "Gửi mã OTP"}
              </Button>

              <div className="text-center hj-muted mt-3">
                Đã nhớ mật khẩu?{" "}
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