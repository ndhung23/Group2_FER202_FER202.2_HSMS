import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <h1 className="mb-3">Web Marketplace Dịch vụ Giúp Việc</h1>
      <p className="mb-4">
        Đây là trang chủ (public). Dùng để giới thiệu nền tảng và điều hướng
        tới các trang chính.
      </p>
      <div className="d-flex flex-wrap gap-2">
        <Button as={Link} to="/services" variant="primary">
          Xem danh sách dịch vụ
        </Button>
        <Button as={Link} to="/login" variant="outline-secondary">
          Đăng nhập
        </Button>
        <Button as={Link} to="/register" variant="outline-secondary">
          Đăng ký
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
