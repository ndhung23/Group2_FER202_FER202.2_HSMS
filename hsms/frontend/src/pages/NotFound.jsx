import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="text-center">
      <h1 className="mb-3">404 - Không tìm thấy trang</h1>
      <p className="mb-4">Đường dẫn bạn truy cập không tồn tại.</p>
      <Button as={Link} to="/" variant="primary">
        Về trang chủ
      </Button>
    </div>
  );
};

export default NotFound;