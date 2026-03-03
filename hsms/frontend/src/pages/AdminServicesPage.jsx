import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { getServices } from "../api/client.js";

const AdminServicesPage = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getServices();
        setServices(res.data.data || []);
      } catch (error) {
        alert("Không tải được dịch vụ (stub).");
      }
    };

    fetchServices();
  }, []);

  return (
    <div>
      <h1 className="mb-3">Quản lý dịch vụ</h1>
      <div className="mb-3">
        <Button variant="success" size="sm">
          Add (stub)
        </Button>
      </div>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên dịch vụ</th>
            <th>Mô tả</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {services.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.name}</td>
              <td>{s.description}</td>
              <td>{s.price?.toLocaleString("vi-VN")} đ</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                >
                  Edit
                </Button>
                <Button variant="outline-danger" size="sm">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
          {services.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center">
                Chưa có dịch vụ nào (stub).
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminServicesPage;

