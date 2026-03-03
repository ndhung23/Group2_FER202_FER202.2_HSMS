import { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { getServices } from "../api/client.js";

const ServicesPage = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getServices();
        setServices(res.data.data || []);
      } catch (error) {
        alert("Không tải được danh sách dịch vụ (stub).");
      }
    };

    fetchServices();
  }, []);

  return (
    <div>
      <h1 className="mb-3">Danh sách dịch vụ</h1>
      <Row>
        {services.map((service) => (
          <Col md={4} className="mb-3" key={service.id}>
            <Card>
              <Card.Body>
                <Card.Title>{service.name}</Card.Title>
                <Card.Text>{service.description}</Card.Text>
                <Card.Text>
                  <strong>Giá: </strong>
                  {service.price?.toLocaleString("vi-VN")} đ
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
        {services.length === 0 && (
          <p>Hiện chưa có dịch vụ (stub hoặc lỗi API).</p>
        )}
      </Row>
    </div>
  );
};

export default ServicesPage;

