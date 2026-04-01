import axios from "axios";
import { useState, useEffect } from "react";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

function ChangePasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
     const storedStr = localStorage.getItem('user');
     if(storedStr) setCurrentUser(JSON.parse(storedStr));
  }, []);

  const userId = location.state?.userId || currentUser?.id;
  const username = location.state?.username || currentUser?.username;
  const email = location.state?.email || currentUser?.email;
  
  // Nếu không có user trong localStorage nhưng có state truyền sang -> Mode lấy lại mật khẩu bằng OTP
  const isForgotPasswordMode = !currentUser && !!location.state?.email;

  const [form, setForm] = useState({
    otp: "",
    oldPassword: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateChangePassword = (name, value, currentForm = form) => {
    switch (name) {
      case "otp":
        if (isForgotPasswordMode && !value) return "Vui lòng nhập mã OTP.";
        if (isForgotPasswordMode && value.length !== 6) return "Mã OTP phải có 6 chữ số.";
        return "";

      case "oldPassword":
        if (!isForgotPasswordMode && !value) return "Vui lòng nhập mật khẩu hiện tại.";
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
        if (!value) return "Vui lòng nhập lại mật khẩu mới.";
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

    if (!userId) {
      newErrors.general = "Phiên đổi mật khẩu không hợp lệ (Không tìm thấy ID người dùng). Vui lòng đăng nhập lại.";
    }

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
      [name]: validateChangePassword(name, value, updatedForm),
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

      if (isForgotPasswordMode) {
        // Verify OTP
        try {
          await axios.post("http://localhost:5000/verify-otp", {
            email: email,
            otp: form.otp
          });
        } catch (otpErr) {
          setErrors((prev) => ({ ...prev, otp: "Mã OTP không đúng hoặc đã hết hạn." }));
          setLoading(false);
          return;
        }
      } else {
        // Verify old password
        const res = await axios.get(`http://localhost:9999/users/${userId}`);
        if (res.data.passwordHash !== form.oldPassword) {
           setErrors((prev) => ({ ...prev, oldPassword: "Mật khẩu hiện tại không đúng. Vui lòng thử lại." }));
           setLoading(false);
           return;
        }
      }

      // Update new password
      await axios.patch(`http://localhost:9999/users/${userId}`, {
        passwordHash: form.password,
        updatedAt: new Date().toISOString()
      });

      setSuccess("Đổi mật khẩu thành công! Đang chuyển hướng...");

      setForm({
        otp: "",
        oldPassword: "",
        password: "",
        confirmPassword: ""
      });

      setTimeout(() => {
        // Log out user for safety to re-login with new password
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');

        navigate("/login", {
          state: { username }
        });
      }, 1500);
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        general: err?.response?.data?.message || "Có lỗi mạng xảy ra khi đổi mật khẩu."
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center" style={{ minHeight: "75vh", paddingTop: "40px" }}>
      <div className="w-100" style={{ maxWidth: 440 }}>
        <div className="mb-3 d-flex justify-content-between">
          <Button variant="link" className="text-decoration-none p-0" onClick={() => navigate(-1)}>
            ← Quay lại
          </Button>
          <span className="text-muted fw-bold">Tài khoản: {username}</span>
        </div>

        <Card className="shadow-sm border-0 rounded-4">
          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-4">
              <div className="hj-logo mb-2">H</div>
              <div className="fw-bold fs-5" style={{ color: "#0d6efd" }}>
                HomeCare Security
              </div>
              <h2 className="mt-2 mb-1 fs-3">Đổi mật khẩu</h2>
              <div className="hj-muted">
                {isForgotPasswordMode 
                   ? `Kiểm tra mã OTP 6 số được gửi về email ${email} của bạn.`
                   : "Bạn không cần OTP nữa, chỉ cần xác nhận mật khẩu cũ của bạn."
                }
              </div>
            </div>

            <Form onSubmit={handleSubmit}>
              
              {isForgotPasswordMode ? (
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Mã xác thực OTP</Form.Label>
                  <Form.Control
                    type="text"
                    name="otp"
                    value={form.otp}
                    onChange={handleChange}
                    placeholder="Nhập mã 6 số"
                    maxLength={6}
                    isInvalid={!!errors.otp}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.otp}
                  </Form.Control.Feedback>
                </Form.Group>
              ) : (
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Mật khẩu hiện tại</Form.Label>
                  <Form.Control
                    type="password"
                    name="oldPassword"
                    value={form.oldPassword}
                    onChange={handleChange}
                    placeholder="Nhập mật khẩu đang dùng"
                    isInvalid={!!errors.oldPassword}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.oldPassword}
                  </Form.Control.Feedback>
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Mật khẩu mới</Form.Label>
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
                <Form.Label className="fw-semibold">Xác nhận mật khẩu mới</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu mới"
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
                className="w-100 rounded-3 py-2 fw-bold"
                disabled={loading}
                variant="primary"
                style={{ boxShadow: "0 4px 14px 0 rgba(13,110,253,0.39)" }}
              >
                {loading ? "Đang xử lý..." : "Cập nhật Mật khẩu"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default ChangePasswordPage;