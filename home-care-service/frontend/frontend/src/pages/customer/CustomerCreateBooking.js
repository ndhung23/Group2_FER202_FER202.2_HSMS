import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import CustomerSidebar from './components/CustomerSidebar';

export default function CustomerCreateBooking() {
  const [customer, setCustomer] = useState(null);
  const [services, setServices] = useState([]);

  // Form states
  const [formData, setFormData] = useState({
    serviceId: "",
    date: "",
    time: "",
    duration: 120, // default 2 hours
    basePrice: 0,
    address: "",
    note: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userObj = JSON.parse(storedUser);
      setCustomer(userObj);
      // Optional: populate default user address if your DB supports it
      setFormData(prev => ({ ...prev, address: userObj.address || "" }));
    }

    // Lấy DS dịch vụ để load lên Select Box
    axios.get(`http://localhost:9999/services`)
      .then(res => {
        const list = res.data || [];
        setServices(list);

        const stateServiceId = location.state?.selectedServiceId;
        const queryServiceId = new URLSearchParams(location.search).get("serviceId");
        const preselectedServiceId = stateServiceId || queryServiceId;
        if (!preselectedServiceId) return;

        const selected = list.find(s => String(s.id) === String(preselectedServiceId));
        if (!selected) return;

        setFormData(prev => ({
          ...prev,
          serviceId: String(selected.id),
          duration: Number(selected.minDurationMinutes || 120),
          basePrice: Number(selected.basePrice || 0)
        }));
      })
      .catch(err => console.error(err));

  }, [location.search, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === "serviceId") {
        const srv = services.find(s => String(s.id) === String(value));
        if (srv) {
          updated.duration = srv.minDurationMinutes;
          updated.basePrice = srv.basePrice;
        } else {
          updated.basePrice = 0;
        }
      }
      return updated;
    });
  };

  const getEndTimeStr = () => {
    if (!formData.time || !formData.duration) return "--:--";
    const [h, m] = formData.time.split(':');
    let d = new Date();
    d.setHours(h);
    d.setMinutes(parseInt(m) + parseInt(formData.duration));
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.serviceId || !formData.date || !formData.time || !formData.address) {
      setError("Vui lòng nhập đầy đủ các thông tin bắt buộc.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const srv = services.find(s => String(s.id) === String(formData.serviceId));
      let costBase = 0;
      if (srv) {
        costBase = Number(srv.basePrice || 0);
      } else {
        costBase = Number(formData.basePrice || 0);
      }

      // Convert Date + Time into ISO 8601 string
      const startDateTimeStr = `${formData.date}T${formData.time}:00Z`;

      const payload = {
        id: Date.now().toString(), // Mock ID gen
        bookingCode: `BK-R${Math.floor(Math.random() * 100000)}`,
        customerId: String(customer.id),
        serviceId: String(formData.serviceId),
        addressId: "1", // Hardcode fallback cho v1
        fullAddress: formData.address,
        startTime: startDateTimeStr,
        endTime: new Date(new Date(startDateTimeStr).getTime() + formData.duration * 60000).toISOString(),
        durationMinutes: parseInt(formData.duration),
        note: formData.note,
        status: "PENDING",
        assignedHelperId: null, // Chưa có ai nhận
        pricing: {
          base: costBase,
          surge: 0,
          discount: 0,
          total: costBase,
          currency: "VND"
        },
        paymentStatus: {
          deposit: "PENDING",
          final: "PENDING"
        },
        evidenceMedia: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await axios.post('http://localhost:9999/bookings', payload);
      setSuccess(true);

      setTimeout(() => {
        navigate('/customer/bookings');
      }, 2000);

    } catch (err) {
      setError("Có lỗi khi tạo yêu cầu. Hệ thống backend từ chối.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container" style={{ minHeight: "80vh", padding: "20px" }}>
      <Row className="g-4">
        {/* Sidebar */}
        <Col xs={12} md={4} lg={3}>
          <CustomerSidebar />
        </Col>

        {/* Content */}
        <Col xs={12} md={8} lg={9}>
          <div className="mb-4">
            <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
              Tiến hành Đặt Dịch Vụ
            </h2>
            <div style={{ color: "#64748b" }}>
              Hãy cung cấp đầy đủ thông tin để HomeJoy có thể phục vụ bạn được tốt nhất. Hệ thống sẽ kiếm tìm Helper phù hợp sau khi đơn được tiếp nhận.
            </div>
          </div>

          <Card className="shadow-sm border-0 rounded-4">
            <Card.Header className="bg-white border-0 rounded-top-4 p-4 pb-0 text-dark fw-bold fs-5">
              Phiếu Yêu Cầu (Request Form)
            </Card.Header>
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">Tạo Yêu cầu Thành công! Đang chuyển hướng về Lịch sử...</Alert>}

              <Form onSubmit={handleSubmit}>
                <Row className="g-4">
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">1. Lựa chọn Gói Dịch Vụ <span className="text-danger">*</span></Form.Label>
                      <Form.Select name="serviceId" value={formData.serviceId} onChange={handleChange}>
                        <option value="">-- Click để chọn --</option>
                        {services.map(s => (
                          <option key={s.id} value={s.id}>{s.name} - (Khung {s.minDurationMinutes} phút - {Number(s.basePrice).toLocaleString()} đ)</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">2. Ngày thi công <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">3. Giờ bắt đầu <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="time" name="time" value={formData.time} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Giờ kết thúc dự kiến</Form.Label>
                      <Form.Control readOnly value={getEndTimeStr()} className="bg-light fw-bold text-success" />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">4. Thời lượng ước tính (Phút) <span className="text-danger">*</span></Form.Label>
                      <Form.Control readOnly value={`${formData.duration} phút`} className="bg-light" />
                      <Form.Text className="text-muted">Thời lượng được tự động tính dựa trên gói dịch vụ bạn đã chọn.</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">4.1 Giá dịch vụ (VNĐ)</Form.Label>
                      <Form.Control
                        readOnly
                        value={Number(formData.basePrice || 0).toLocaleString("vi-VN") + " đ"}
                        className="bg-light text-primary fw-bold"
                      />
                      <Form.Text className="text-muted">Giá được tự động lấy theo gói dịch vụ đã chọn.</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">5. Địa chỉ cung cấp dịch vụ <span className="text-danger">*</span></Form.Label>
                      <Form.Control placeholder="Nhập địa chỉ căn nhà/căn hộ của bạn thật rõ ràng..." name="address" value={formData.address} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">6. Ghi chú đặc biệt cho Helper (Không bắt buộc)</Form.Label>
                      <Form.Control as="textarea" rows={3} placeholder="VD: Nhà em có nuôi cún, lau kĩ lông trên thảm giúp em. Khi vào gọi bảo vệ tòa nhà..." name="note" value={formData.note} onChange={handleChange} />
                    </Form.Group>
                  </Col>

                  <Col xs={12} className="mt-5 text-end border-top pt-4">
                    <Button variant="light" className="me-2 px-4" as={Link} to="/customer">Hủy Bỏ</Button>
                    <Button variant="primary" type="submit" className="px-5 fw-bold shadow-sm" disabled={loading}>
                      {loading ? "Đang gửi Server..." : "Xác Nhận Đặt Lịch"}
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
