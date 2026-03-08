import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('ALL');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('DEFAULT');

  useEffect(() => {
    axios.get('http://localhost:9999/services')
      .then(res => setServices(res.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleApplyCustomPrice = () => {
     setPriceFilter('CUSTOM');
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setPriceFilter('ALL');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('DEFAULT');
  };

  const filteredServices = useMemo(() => {
    let result = [...services];

    // 1. Keyword search
    if (searchTerm.trim()) {
      const keyword = searchTerm.trim().toLowerCase();
      result = result.filter(
        s => s.name.toLowerCase().includes(keyword) || 
             (s.description && s.description.toLowerCase().includes(keyword))
      );
    }

    // 2. Price filter
    if (priceFilter === 'UNDER_200') {
      result = result.filter(s => s.basePrice < 200000);
    } else if (priceFilter === '200_500') {
      result = result.filter(s => s.basePrice >= 200000 && s.basePrice <= 500000);
    } else if (priceFilter === 'OVER_500') {
      result = result.filter(s => s.basePrice > 500000);
    } else if (priceFilter === 'CUSTOM') {
      if (minPrice) result = result.filter(s => s.basePrice >= parseInt(minPrice));
      if (maxPrice) result = result.filter(s => s.basePrice <= parseInt(maxPrice));
    }

    // 3. Sorting
    switch(sortBy) {
        case 'PRICE_ASC': 
            result.sort((a,b) => Number(a.basePrice) - Number(b.basePrice)); 
            break;
        case 'PRICE_DESC': 
            result.sort((a,b) => Number(b.basePrice) - Number(a.basePrice)); 
            break;
        case 'DURATION_ASC': 
            result.sort((a,b) => Number(a.minDurationMinutes) - Number(b.minDurationMinutes)); 
            break;
        case 'DURATION_DESC': 
            result.sort((a,b) => Number(b.minDurationMinutes) - Number(a.minDurationMinutes)); 
            break;
        default: 
            break;
    }

    return result;
  }, [services, searchTerm, priceFilter, minPrice, maxPrice, sortBy]);

  return (
    <div className="min-vh-100 py-4" style={{ backgroundColor: "#f4f6f8" }}>
      <Container fluid="xl">
        {/* Header Breadcrumb / Title */}
        <div className="mb-4 d-flex align-items-center justify-content-between bg-white p-3 rounded-3 shadow-sm">
           <div className="d-flex align-items-center">
              <h4 className="mb-0 fw-bold" style={{ color: "#1e293b" }}>Trang chủ / Khám phá Dịch vụ</h4>
           </div>
           <div>
              <span className="text-secondary fw-semibold">Tìm thấy {filteredServices.length} kết quả</span>
           </div>
        </div>

        <Row className="g-4">
          {/* Lọc Bên Trái (Sidebar Filters) */}
          <Col lg={3} md={4}>
             <Card className="border-0 shadow-sm rounded-4 sticky-top" style={{ top: "100px", zIndex: 1 }}>
                <Card.Body className="p-4 d-flex flex-column gap-4">
                   <div className="d-flex justify-content-between align-items-center border-bottom pb-2">
                      <h5 className="fw-bold mb-0">Bộ lọc tìm kiếm</h5>
                      <Button variant="link" className="text-decoration-none p-0 text-danger" onClick={handleResetFilters} style={{fontSize: "13px"}}>
                         Xóa bộ lọc
                      </Button>
                   </div>

                   {/* Filter Keyword */}
                   <div>
                      <h6 className="fw-semibold text-dark">Từ khóa tìm kiếm</h6>
                      <Form.Control 
                        type="text" 
                        placeholder="VD: dọn nhà, diệt côn trùng..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="rounded-3"
                      />
                   </div>

                   {/* Filter Price */}
                   <div>
                      <h6 className="fw-semibold text-dark mb-3">Khoảng Giá</h6>
                      
                      <Form.Check 
                         type="radio" 
                         label="Tất cả mức giá" 
                         name="priceFilter" 
                         id="price-all" 
                         className="mb-2"
                         checked={priceFilter === 'ALL'}
                         onChange={() => setPriceFilter('ALL')}
                      />
                      <Form.Check 
                         type="radio" 
                         label="Dưới 200,000 đ" 
                         name="priceFilter" 
                         id="price-under-200" 
                         className="mb-2"
                         checked={priceFilter === 'UNDER_200'}
                         onChange={() => setPriceFilter('UNDER_200')}
                      />
                      <Form.Check 
                         type="radio" 
                         label="Từ 200k đến 500k" 
                         name="priceFilter" 
                         id="price-200-500" 
                         className="mb-2"
                         checked={priceFilter === '200_500'}
                         onChange={() => setPriceFilter('200_500')}
                      />
                      <Form.Check 
                         type="radio" 
                         label="Trên 500,000 đ" 
                         name="priceFilter" 
                         id="price-over-500" 
                         className="mb-3"
                         checked={priceFilter === 'OVER_500'}
                         onChange={() => setPriceFilter('OVER_500')}
                      />

                      <div className="p-3 bg-light rounded-3">
                        <div className="text-muted mb-2 fw-semibold" style={{ fontSize: "14px" }}>Tùy chỉnh khoảng giá</div>
                        <div className="d-flex align-items-center gap-2 mb-2">
                           <Form.Control 
                              type="number" 
                              placeholder="₫ TỐI THIỂU" 
                              value={minPrice} 
                              onChange={(e) => setMinPrice(e.target.value)}
                              size="sm"
                           />
                           <span>-</span>
                           <Form.Control 
                              type="number" 
                              placeholder="₫ TỐI ĐA" 
                              value={maxPrice} 
                              onChange={(e) => setMaxPrice(e.target.value)}
                              size="sm"
                           />
                        </div>
                        <Button 
                           variant="primary" 
                           size="sm" 
                           className="w-100 fw-bold" 
                           onClick={handleApplyCustomPrice}
                           disabled={!minPrice && !maxPrice}
                        >
                           Áp dụng
                        </Button>
                      </div>
                   </div>

                </Card.Body>
             </Card>
          </Col>

          {/* Right Content */}
          <Col lg={9} md={8}>
             <Card className="border-0 shadow-sm rounded-4 mb-4">
                <Card.Body className="p-3 bg-white rounded-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
                   <div className="d-flex align-items-center gap-3">
                      <span className="fw-semibold text-muted">Sắp xếp theo:</span>
                      <Button variant={sortBy === 'DEFAULT' ? 'primary' : 'light'} onClick={() => setSortBy('DEFAULT')} className="px-3">
                         Mặc định
                      </Button>
                      <Button variant={sortBy === 'PRICE_ASC' ? 'primary' : 'light'} onClick={() => setSortBy('PRICE_ASC')} className="px-3">
                         Giá Thấp đến Cao
                      </Button>
                      <Button variant={sortBy === 'PRICE_DESC' ? 'primary' : 'light'} onClick={() => setSortBy('PRICE_DESC')} className="px-3">
                         Giá Cao đến Thấp
                      </Button>
                   </div>
                   <div className="d-flex align-items-center gap-2">
                      <Form.Select 
                         value={sortBy.startsWith('DURATION') ? sortBy : ''} 
                         onChange={(e) => {
                            if(e.target.value) setSortBy(e.target.value);
                         }}
                         style={{ width: "200px" }}
                      >
                         <option value="">Lọc theo thời gian</option>
                         <option value="DURATION_ASC">Sớm nhất (Ít phút)</option>
                         <option value="DURATION_DESC">Dài nhất (Nhiều phút)</option>
                      </Form.Select>
                   </div>
                </Card.Body>
             </Card>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : filteredServices.length > 0 ? (
              <Row className="g-4">
                {filteredServices.map(s => (
                  <Col lg={4} sm={6} key={s.id}>
                    <Card className="h-100 shadow-sm border-0 rounded-4 overflow-hidden service-card-hover">
                      {s.imageUrl ? (
                        <Card.Img 
                          variant="top" 
                          src={s.imageUrl} 
                          style={{ height: "200px", objectFit: "cover" }} 
                        />
                      ) : (
                        <div 
                           className="bg-primary text-white d-flex align-items-center justify-content-center" 
                           style={{ height: "200px", fontSize: "40px", background: "linear-gradient(135deg, #0d6efd 0%, #0aa2c0 100%)" }}
                        >
                           <span>✨</span>
                        </div>
                      )}
                      <Card.Body className="d-flex flex-column p-4">
                        <h5 className="fw-bold mb-2">{s.name}</h5>
                        <p className="text-muted mb-4 flex-grow-1" style={{ fontSize: "14px" }}>
                          {s.description || "Dịch vụ chất lượng cao mang lại sự tiện nghi và sạch sẽ cho ngôi nhà của bạn."}
                        </p>
                        
                        <div className="bg-light p-3 rounded-3 mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                             <span className="text-muted" style={{ fontSize: "13px" }}>⏱ Thời lượng:</span>
                             <span className="fw-bold text-dark">{s.minDurationMinutes} Phút</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                             <span className="text-muted" style={{ fontSize: "13px" }}>💰 Giá hiển thị:</span>
                             <span className="fw-bold text-primary fs-5">{Number(s.basePrice).toLocaleString('vi-VN')} đ</span>
                          </div>
                        </div>

                        <Button as={Link} to="/customer/bookings/new" variant="outline-primary" className="w-100 fw-bold border-2 rounded-pill">
                          Chọn Dịch Vụ
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
                <div className="text-center py-5 bg-white rounded-4 shadow-sm">
                   <div className="mb-3" style={{ fontSize: "50px" }}>🕵️‍♂️</div>
                   <h4 className="fw-bold text-dark">Không tìm thấy kết quả nào</h4>
                   <p className="text-muted">Thử điều chỉnh hoặc xóa bộ lọc để xem các dịch vụ khác.</p>
                   <Button variant="outline-primary" onClick={handleResetFilters} className="px-4 mt-2 rounded-pill">Xóa Bộ Lọc</Button>
                </div>
            )}
          </Col>
        </Row>
      </Container>
      
      <style>{`
        .service-card-hover {
           transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .service-card-hover:hover {
           transform: translateY(-5px);
           box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
}