import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const CustomerDashboardPage = () => {
  return (
    <div>
      <h1 className="mb-3">Trang khách hàng</h1>
      <p className="mb-4">
        Đây là trang dashboard cho khách hàng sau khi đăng nhập.
      </p>
      <div className="d-flex flex-wrap gap-2">
        <Button as={Link} to="/customer/bookings" variant="primary">
          Xem lịch đặt dịch vụ
        </Button>
        <Button as={Link} to="/customer/bookings/new" variant="outline-primary">
          Tạo lịch đặt mới
        </Button>
      </div>
    </div>
  );
};

export default CustomerDashboardPage;

