import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Card } from "react-bootstrap";
import { createBooking, getServices } from "../api/client.js";

const CustomerCreateBookingPage = () => {
  const [serviceId, setServiceId] = useState("");
  const [services, setServices] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getServices();
        const list = res.data.data || [];
        setServices(list);
        if (list.length > 0) {
          setServiceId(String(list[0].id));
        }
      } catch (error) {
        alert("Không tải được dịch vụ (stub).");
      }
    };

    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createBooking({
        serviceId,
        startTime,
        endTime,
        note,
      });
      alert("Tạo booking stub thành công!");
      navigate("/customer/bookings", { replace: true });
    } catch (error) {
      alert("Tạo booking thất bại (stub).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title className="mb-3">Tạo lịch đặt dịch vụ</Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="bookingService">
            <Form.Label>Dịch vụ</Form.Label>
            <Form.Select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="bookingStart">
            <Form.Label>Thời gian bắt đầu</Form.Label>
            <Form.Control
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="bookingEnd">
            <Form.Label>Thời gian kết thúc</Form.Label>
            <Form.Control
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="bookingNote">
            <Form.Label>Ghi chú</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Yêu cầu thêm (nếu có)"
            />
          </Form.Group>

          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Đang tạo..." : "Tạo lịch đặt"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CustomerCreateBookingPage;

