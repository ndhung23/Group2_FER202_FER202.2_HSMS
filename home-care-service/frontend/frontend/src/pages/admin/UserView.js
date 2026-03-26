import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Button, Col, Container, Form, Row, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

export default function UserView() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [helperProfile, setHelperProfile] = useState(null);

  useEffect(() => {
    const getUserById = async () => {
      try {
        const userRes = await axios.get(`http://localhost:9999/users/${id}`);
        const userData = userRes.data || {};
        setUser(userData);

        if (userData.role === "HELPER") {
          const helperRes = await axios.get(`http://localhost:9999/helperProfiles?userId=${id}`);
          const profile = Array.isArray(helperRes.data) ? helperRes.data[0] : null;
          setHelperProfile(profile || null);
        } else {
          setHelperProfile(null);
        }
      } catch (error) {
        console.error("Loi khi lay user:", error);
        alert("Khong tim thay nguoi dung");
        navigate("/admin");
      }
    };

    if (id) getUserById();
  }, [id, navigate]);

  const userFields = useMemo(() => {
    if (!user) return [];
    return Object.entries(user);
  }, [user]);

  const helperFields = useMemo(() => {
    if (!helperProfile) return [];
    return Object.entries(helperProfile);
  }, [helperProfile]);

  const formatValue = (value) => {
    if (typeof value === "string") return value === "" ? "\"\"" : value;
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }
    return String(value);
  };

  const isImageUrl = (value) => {
    if (typeof value !== "string") return false;
    const normalized = value.toLowerCase();
    const isHttp = normalized.startsWith("http://") || normalized.startsWith("https://");
    const isPublicPath = normalized.startsWith("/");
    const hasImageExt = /\.(png|jpe?g|gif|webp|svg)$/i.test(normalized);
    return isHttp || isPublicPath || hasImageExt;
  };

  const renderValueField = (key, value) => {
    if (Array.isArray(value) && value.every((item) => typeof item === "string" && isImageUrl(item))) {
      return (
        <>
          <Form.Control value={formatValue(value)} readOnly disabled className="mb-2" />
          <div className="d-flex flex-wrap gap-2">
            {value.map((url, index) => (
              <img
                key={`${key}-${index}`}
                src={url}
                alt={`${key}-${index}`}
                style={{ width: "120px", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e2e8f0" }}
              />
            ))}
          </div>
        </>
      );
    }

    if (isImageUrl(value)) {
      return (
        <>
          <Form.Control value={formatValue(value)} readOnly disabled className="mb-2" />
          <img
            src={value}
            alt={key}
            style={{ width: "100%", maxHeight: "180px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e2e8f0" }}
          />
        </>
      );
    }

    return <Form.Control value={formatValue(value)} readOnly disabled />;
  };

  return (
    <Container fluid style={{ backgroundColor: "#f6f8fb", minHeight: "100vh", padding: "30px" }}>
      <Row className="justify-content-center">
        <Col md={11} lg={10}>
          <Card className="shadow-sm border-0 rounded-4">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4">Chi tiet nguoi dung</h2>

              <h5 className="mb-3">Thong tin tai khoan</h5>
              <Row className="g-3 mt-1">
                {userFields.map(([key, value]) => (
                  <Col md={6} key={key}>
                    <Form.Group>
                      <Form.Label>{key}</Form.Label>
                      {renderValueField(key, value)}
                    </Form.Group>
                  </Col>
                ))}
              </Row>

              {helperFields.length > 0 && (
                <>
                  <h5 className="mt-4 mb-3">Thong tin helper profile</h5>
                  <Row className="g-3">
                    {helperFields.map(([key, value]) => (
                      <Col md={6} key={`helper-${key}`}>
                        <Form.Group>
                          <Form.Label>{key}</Form.Label>
                          {renderValueField(key, value)}
                        </Form.Group>
                      </Col>
                    ))}
                  </Row>
                </>
              )}

              <Row className="mt-1">
                <Col xs={12} className="mt-4 d-flex justify-content-center">
                  <Button variant="secondary" onClick={() => navigate("/admin")}>
                    Quay lai
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
