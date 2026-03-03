import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { getBookings } from "../api/client.js";

const CustomerBookingsPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getBookings();
        setBookings(res.data.data || []);
      } catch (error) {
        alert("Không tải được danh sách bookings (stub).");
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <h1 className="mb-3">Lịch đặt dịch vụ của bạn</h1>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Dịch vụ</th>
            <th>Bắt đầu</th>
            <th>Kết thúc</th>
            <th>Ghi chú</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.serviceName}</td>
              <td>{b.startTime}</td>
              <td>{b.endTime}</td>
              <td>{b.note}</td>
              <td>{b.status}</td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center">
                Chưa có lịch đặt nào (stub).
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default CustomerBookingsPage;

