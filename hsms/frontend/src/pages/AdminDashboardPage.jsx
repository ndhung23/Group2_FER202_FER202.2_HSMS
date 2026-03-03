import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const AdminDashboardPage = () => {
  return (
    <div>
      <h1 className="mb-3">Trang quản trị</h1>
      <p className="mb-4">
        Đây là dashboard admin (chỉ khung). Dùng để điều hướng tới các chức
        năng quản trị.
      </p>
      <Button as={Link} to="/admin/services" variant="primary">
        Quản lý dịch vụ
      </Button>
    </div>
  );
};

export default AdminDashboardPage;

