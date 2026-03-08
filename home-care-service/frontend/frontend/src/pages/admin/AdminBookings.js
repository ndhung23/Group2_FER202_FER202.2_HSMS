import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Card, Table, Badge, Button, Form, InputGroup, Modal, Spinner, Pagination } from 'react-bootstrap';
import AdminSidebar from './components/AdminSidebar';
import axios from 'axios';

export default function AdminBookings() {
   const [bookings, setBookings] = useState([]);
   const [services, setServices] = useState([]);
   const [users, setUsers] = useState([]); // Both CUSTOMER and HELPER
   const [loading, setLoading] = useState(true);

   // Filter States
   const [activeTab, setActiveTab] = useState("PENDING"); // "PENDING" or "HISTORY"
   const [search, setSearch] = useState("");
   const [statusFilter, setStatusFilter] = useState("");
   const [dateFilter, setDateFilter] = useState("");

   // Pagination
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 3;

   // Action States
   const [showViewModal, setShowViewModal] = useState(false);
   const [showAssignModal, setShowAssignModal] = useState(false);
   const [selectedBooking, setSelectedBooking] = useState(null);
   const [selectedHelper, setSelectedHelper] = useState("");

   const fetchData = async () => {
      setLoading(true);
      try {
         const [resBookings, resUsers, resServices] = await Promise.all([
            axios.get('http://localhost:9999/bookings'),
            axios.get('http://localhost:9999/users'),
            axios.get('http://localhost:9999/services')
         ]);
         setBookings(resBookings.data);
         setUsers(resUsers.data);
         setServices(resServices.data);
      } catch (error) {
         console.error("Error fetching admin bookings data", error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchData();
   }, []);

   // Reset pagination when filter changes
   useEffect(() => {
      setCurrentPage(1);
   }, [search, statusFilter, dateFilter, activeTab]);

   const helpers = useMemo(() => users.filter(u => u.role === "HELPER" && u.status === "ACTIVE"), [users]);

   const getServiceName = (serviceKey) => {
      const s = services.find(x => String(x.id) === String(serviceKey) || x.code === String(serviceKey));
      return s ? s.name : "N/A";
   };

   const getCustomerName = (id) => {
      const c = users.find(x => String(x.id) === String(id));
      return c ? c.fullName : "N/A";
   };

   const getCustomerPhone = (id) => {
      const c = users.find(x => String(x.id) === String(id));
      return c ? c.phone : "N/A";
   };

   const getHelperName = (id) => {
      if (!id) return "Chưa phân công";
      const h = users.find(x => String(x.id) === String(id));
      return h ? h.fullName : "N/A";
   };

   const getStatusBadge = (status) => {
      switch (status) {
         case 'PENDING': return <Badge bg="warning" text="dark">Chờ xác nhận</Badge>;
         case 'PENDING_DEPOSIT': return <Badge bg="info">Chờ cọc 50%</Badge>;
         case 'PAID_DEPOSIT': return <Badge bg="primary">Đã cọc</Badge>;
         case 'IN_PROGRESS': return <Badge bg="primary">Đang làm</Badge>;
         case 'COMPLETED': return <Badge bg="success">Hoàn thành</Badge>;
         case 'CANCELLED': return <Badge bg="danger">Đã hủy</Badge>;
         default: return <Badge bg="secondary">{status}</Badge>;
      }
   };

   // Filtering Logic
   const filteredBookings = useMemo(() => {
      let result = [...bookings];

      // Tab logic
      if (activeTab === "PENDING") {
         result = result.filter(b => b.status === "PENDING" || b.status === "PENDING_DEPOSIT" || b.status === "PAID_DEPOSIT");
      } else {
         result = result.filter(b => b.status === "IN_PROGRESS" || b.status === "COMPLETED" || b.status === "CANCELLED");
      }

      // Universal logic
      if (search.trim()) {
         const keyword = search.trim().toLowerCase();
         result = result.filter(b => {
             const code = (b.bookingCode || "").toLowerCase();
             const cname = getCustomerName(b.customerId).toLowerCase();
             return code.includes(keyword) || cname.includes(keyword);
         });
      }
      if (statusFilter) {
          result = result.filter(b => b.status === statusFilter);
      }
      if (dateFilter) {
          result = result.filter(b => {
              if(!b.startTime) return false;
              return b.startTime.includes(dateFilter);
          });
      }
      // Sort by newest first
      result.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
      return result;
   }, [bookings, activeTab, search, statusFilter, dateFilter, users, services]);

   // Pagination Logic
   const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
   const currentItems = filteredBookings.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
   );

   const handleApproveWithoutHelper = async (b) => {
       if(!window.confirm(`Xác nhận duyệt lịch ${b.bookingCode} và yêu cầu cọc?`)) return;
       try {
           await axios.patch(`http://localhost:9999/bookings/${b.id}`, {
               status: 'PENDING_DEPOSIT',
               updatedAt: new Date().toISOString()
           });
           fetchData();
       } catch (error) { console.error(error); alert("Lỗi khi duyệt"); }
   };

   const handleCancel = async (b) => {
       if(!window.confirm(`Xác nhận HỦY lịch ${b.bookingCode}?`)) return;
       try {
           await axios.patch(`http://localhost:9999/bookings/${b.id}`, {
               status: 'CANCELLED',
               updatedAt: new Date().toISOString()
           });
           fetchData();
       } catch (error) { console.error(error); alert("Lỗi khi hủy");}
   };

   const openAssignModal = (b) => {
       setSelectedBooking(b);
       setSelectedHelper(b.assignedHelperId || "");
       setShowAssignModal(true);
   };

   const handleAssignSubmmit = async () => {
       if(!selectedHelper) { alert('Vui lòng chọn nhân viên!'); return; }
       try {
           setLoading(true);
           let statusUpdate = selectedBooking.status;
           if(statusUpdate === "PENDING") statusUpdate = "PENDING_DEPOSIT"; // Approve auto

           await axios.patch(`http://localhost:9999/bookings/${selectedBooking.id}`, {
               assignedHelperId: String(selectedHelper),
               status: statusUpdate,
               updatedAt: new Date().toISOString()
           });
           setShowAssignModal(false);
           fetchData();
       } catch (error) {
           console.error(error);
           alert("Lỗi phân công");
           setLoading(false);
       }
   };

    return (
        <>
            <div className="dashboard-container">
                <Row className="g-4">
                {/* Left Sidebar Menu */}
                <Col xs={12} md={3} lg={2}>
                    <AdminSidebar />
                </Col>

                {/* Right Content */}
            <Col xs={12} md={9} lg={10}>
                   <div className="mb-4">
                       <h2 className="fw-bold mb-1" style={{ color: "#1e293b" }}>
                           Duyệt Yêu Cầu Đặt Lịch
                       </h2>
                       <div style={{ color: "#64748b" }}>
                           Quản lý và xét duyệt các yêu cầu dịch vụ từ khách hàng.
                       </div>
                   </div>

                   {/* Nav Tabs */}
                   <div className="d-flex mb-3">
                       <Button 
                          variant={activeTab === "PENDING" ? "primary" : "light"}
                          className={`rounded-top border-bottom-0 me-2 px-4 shadow-sm ${activeTab === "PENDING" ? 'fw-bold' : 'text-muted'}`}
                          onClick={() => setActiveTab("PENDING")}
                       >
                           Đơn cần duyệt ({bookings.filter(x => ["PENDING", "PENDING_DEPOSIT", "PAID_DEPOSIT"].includes(x.status)).length})
                       </Button>
                       <Button 
                          variant={activeTab === "HISTORY" ? "light" : "light"}
                          className={`rounded-top border-bottom-0 px-4 shadow-sm ${activeTab === "HISTORY" ? 'fw-bold text-primary bg-white' : 'text-muted'}`}
                          onClick={() => setActiveTab("HISTORY")}
                          style={activeTab === "HISTORY" ? { borderBottom: "3px solid #0d6efd" } : {}}
                       >
                           Lịch sử
                       </Button>
                   </div>

                   <Card className="border-0 shadow-sm rounded-4 rounded-top-0">
                       <Card.Header className="bg-white border-0 pt-4 px-4">
                           {/* Toolbar */}
                           <Row className="g-3">
                               <Col md={5}>
                                   <InputGroup>
                                       <InputGroup.Text className="bg-white">🔍</InputGroup.Text>
                                       <Form.Control
                                           placeholder="Tìm mã đơn, tên khách hàng..."
                                           value={search}
                                           onChange={(e) => setSearch(e.target.value)}
                                       />
                                   </InputGroup>
                               </Col>
                               <Col md={3}>
                                   <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                       <option value="">Tất cả trạng thái</option>
                                       {activeTab === "PENDING" ? (
                                           <>
                                              <option value="PENDING">Chờ xác nhận</option>
                                              <option value="PENDING_DEPOSIT">Chờ cọc 50%</option>
                                              <option value="PAID_DEPOSIT">Đã cọc 50%</option>
                                           </>
                                       ) : (
                                           <>
                                              <option value="IN_PROGRESS">Đang làm</option>
                                              <option value="COMPLETED">Hoàn thành</option>
                                              <option value="CANCELLED">Đã hủy</option>
                                           </>
                                       )}
                                   </Form.Select>
                               </Col>
                               <Col md={3}>
                                   <Form.Control
                                       type="date"
                                       value={dateFilter}
                                       onChange={(e) => setDateFilter(e.target.value)}
                                   />
                               </Col>
                               <Col md={1}>
                                   <Button variant="outline-danger" className="w-100" onClick={() => {setSearch(''); setStatusFilter(''); setDateFilter('');}}>Xóa</Button>
                               </Col>
                           </Row>
                       </Card.Header>
                       
                       <Card.Body className="p-4">
                           {/* Table */}
                               {loading ? (
                                   <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
                               ) : (
                                   <div className="table-responsive">
                                       <Table hover bordered striped className="align-middle mb-0">
                                           <thead>
                                               <tr style={{ backgroundColor: "#f8fafc" }}>
                                                   <th className="py-3">Mã Đơn</th>
                                                   <th className="py-3">Khách hàng</th>
                                                   <th className="py-3">Dịch vụ</th>
                                                   <th className="py-3">Thời gian</th>
                                                   <th className="py-3">Phân công</th>
                                                   <th className="py-3">Trạng thái</th>
                                                   <th className="py-3 text-center">Thao tác</th>
                                               </tr>
                                           </thead>
                                           <tbody>
                                               {currentItems.length > 0 ? currentItems.map(b => (
                                                   <tr key={b.id}>
                                                       <td className="fw-bold text-primary">{b.bookingCode}</td>
                                                       <td>
                                                           <div className="fw-semibold">{getCustomerName(b.customerId)}</div>
                                                           <small className="text-muted">{getCustomerPhone(b.customerId)}</small>
                                                       </td>
                                                       <td>{getServiceName(b.serviceId)}</td>
                                                       <td>
                                                           <div>{new Date(b.startTime).toLocaleDateString('vi-VN')}</div>
                                                           <small className="text-success fw-bold">
                                                              {new Date(b.startTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}
                                                           </small>
                                                       </td>
                                                       <td>
                                                           {b.assignedHelperId ? (
                                                              <Badge bg="info" className="text-dark bg-opacity-25 border border-info px-2 py-1">
                                                                 🧑‍🔧 {getHelperName(b.assignedHelperId)}
                                                              </Badge>
                                                           ) : (
                                                              <span className="text-muted fst-italic">-- Trống --</span>
                                                           )}
                                                       </td>
                                                       <td>{getStatusBadge(b.status)}</td>
                                                       <td className="text-end">
                                                           {activeTab === "PENDING" && (
                                                               <div className="d-flex justify-content-end gap-1 mb-1">
                                                                   {b.status === "PENDING" && (
                                                                      <Button size="sm" variant="success" onClick={()=>handleApproveWithoutHelper(b)} title="Duyệt đơn và yêu cầu cọc thẳng">
                                                                          ✓ Duyệt
                                                                      </Button>
                                                                   )}
                                                                   <Button size="sm" variant="primary" onClick={()=>openAssignModal(b)} title="Phân công nhân viên">
                                                                       🧑‍🔧 Phân công
                                                                   </Button>
                                                                   <Button size="sm" variant="danger" onClick={()=>handleCancel(b)} title="Hủy đơn này">
                                                                       ✕
                                                                   </Button>
                                                               </div>
                                                           )}
                                                           <Button size="sm" variant="outline-secondary" className="w-100" onClick={()=>{setSelectedBooking(b); setShowViewModal(true);}}>
                                                               Xem chi tiết
                                                           </Button>
                                                       </td>
                                                   </tr>
                                               )) : (
                                                   <tr><td colSpan="7" className="text-center py-4 text-muted">Không tìm thấy yêu cầu nào</td></tr>
                                               )}
                                           </tbody>
                                       </Table>
                                   </div>
                               )}

                               {/* Pagination */}
                               {!loading && totalPages > 1 && (
                                   <div className="d-flex justify-content-center mt-4">
                                     <Pagination>
                                       <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                                       {[...Array(totalPages)].map((_, idx) => (
                                         <Pagination.Item key={idx + 1} active={idx + 1 === currentPage} onClick={() => setCurrentPage(idx + 1)}>
                                           {idx + 1}
                                         </Pagination.Item>
                                       ))}
                                       <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                                     </Pagination>
                                   </div>
                               )}

                           </Card.Body>
                       </Card>
                   </Col>
               </Row>
           </div>
           {/* View Modal */}
           <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg" centered>
               <Modal.Header closeButton>
                   <Modal.Title>Chi tiết Đơn {selectedBooking?.bookingCode}</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                   {selectedBooking && (
                       <Row className="g-3">
                           <Col md={6}>
                               <div className="bg-light p-3 rounded h-100">
                                   <h6>👤 Thông tin khách hàng</h6>
                                   <p className="mb-1"><strong>Họ tên:</strong> {getCustomerName(selectedBooking.customerId)}</p>
                                   <p className="mb-1"><strong>SĐT:</strong> {getCustomerPhone(selectedBooking.customerId)}</p>
                                   <p className="mb-0"><strong>Địa chỉ:</strong> {selectedBooking.fullAddress}</p>
                               </div>
                           </Col>
                           <Col md={6}>
                               <div className="bg-light p-3 rounded h-100">
                                   <h6>🛠 Dịch vụ</h6>
                                   <p className="mb-1"><strong>Loại:</strong> {getServiceName(selectedBooking.serviceId)}</p>
                                   <p className="mb-1"><strong>Thời lượng:</strong> {selectedBooking.durationMinutes} phút</p>
                                   <p className="mb-0"><strong>Trạng thái:</strong> {getStatusBadge(selectedBooking.status)}</p>
                               </div>
                           </Col>
                           <Col md={12}>
                               <div className="border p-3 rounded">
                                   <Row>
                                       <Col md={6}>
                                           <p className="mb-1"><strong>Bắt đầu:</strong> {new Date(selectedBooking.startTime).toLocaleString('vi-VN')}</p>
                                           <p className="mb-1"><strong>Kết thúc:</strong> {new Date(selectedBooking.endTime).toLocaleString('vi-VN')}</p>
                                           <p className="mb-1"><strong>Nhân viên đảm nhận:</strong> {getHelperName(selectedBooking.assignedHelperId)}</p>
                                       </Col>
                                       <Col md={6} className="text-md-end">
                                           <p className="mb-1"><strong>Tổng tiền:</strong> {Number(selectedBooking.pricing.total).toLocaleString()} đ</p>
                                           <p className="mb-1"><strong>Thanh toán cọc:</strong> {selectedBooking.paymentStatus.deposit}</p>
                                           <p className="mb-0"><strong>Thanh toán cuối:</strong> {selectedBooking.paymentStatus.final}</p>
                                       </Col>
                                   </Row>
                               </div>
                           </Col>
                           {selectedBooking.note && (
                               <Col md={12}>
                                   <div className="bg-warning bg-opacity-10 text-dark p-3 rounded">
                                       <strong>Ghi chú từ khách:</strong> {selectedBooking.note}
                                   </div>
                               </Col>
                           )}
                       </Row>
                   )}
               </Modal.Body>
               <Modal.Footer>
                   <Button variant="secondary" onClick={() => setShowViewModal(false)}>Đóng</Button>
               </Modal.Footer>
           </Modal>

           {/* Assign Modal */}
           <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)} centered>
               <Modal.Header closeButton>
                   <Modal.Title>Phân công nhân viên</Modal.Title>
               </Modal.Header>
               <Modal.Body>
                   <p className="mb-3 text-muted">
                       Chỉ định Đơn <strong>{selectedBooking?.bookingCode}</strong> cho bộ phận Helper thực hiện. 
                       Hệ thống sẽ tự động cập nhật trạng thái đơn thành Chờ Cọc nếu Đơn đang Pending.
                   </p>
                   <Form.Group>
                       <Form.Label className="fw-bold">Chọn nhân viên Helper</Form.Label>
                       <Form.Select 
                          value={selectedHelper} 
                          onChange={(e) => setSelectedHelper(e.target.value)}
                       >
                           <option value="">-- Chọn nhân viên --</option>
                           {helpers.map(h => (
                               <option key={h.id} value={h.id}>{h.fullName} ({h.phone})</option>
                           ))}
                       </Form.Select>
                   </Form.Group>
               </Modal.Body>
               <Modal.Footer>
                   <Button variant="secondary" onClick={() => setShowAssignModal(false)}>Hủy</Button>
                   <Button variant="primary" onClick={handleAssignSubmmit}>Lưu Phân Công</Button>
               </Modal.Footer>
           </Modal>
        </>
    );
}
