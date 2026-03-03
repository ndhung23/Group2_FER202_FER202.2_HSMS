# Team Workspace Scaffold (6 Members - JavaScript only)

Tài liệu này là **khung làm việc** để 6 thành viên code song song, giảm conflict và rõ trách nhiệm.

## 1) Nhánh chuẩn cho team

- `main`: branch demo ổn định.
- `develop`: branch tích hợp chính.
- `feature/member-1-auth-users`
- `feature/member-2-services-bookings`
- `feature/member-3-helper-module`
- `feature/member-4-payment-review`
- `feature/member-5-admin-report-coupon`
- `feature/member-6-frontend-integration`

> Tạo tự động bằng script:

```bash
npm run setup:branches
```

## 2) Contract chung (để khỏi đụng nhau)

- Response format thống nhất:
  - success: `{ success: true, data, message }`
  - error: `{ success: false, message, errorCode }`
- Chỉ dùng JavaScript CommonJS cho backend.
- Không đổi tên route đã public nếu chưa thống nhất trên group.
- Mọi member rebase `develop` trước khi mở PR.

## 3) Chia module theo người

### Member 1 – Auth + Users
**Owned files**
- `backend/controllers/authController.js`
- `backend/controllers/usersController.js`
- `backend/routes/authRoutes.js`
- `backend/routes/usersRoutes.js`
- `backend/middlewares/authMiddleware.js`

**Deliverables**
- Register/Login + JWT middleware.
- User profile CRUD cơ bản.

### Member 2 – Services + Bookings
**Owned files**
- `backend/controllers/servicesController.js`
- `backend/controllers/bookingsController.js`
- `backend/routes/servicesRoutes.js`
- `backend/routes/bookingsRoutes.js`
- `backend/utils/calculatePricing.js`

**Deliverables**
- Booking flow chính + pricing formula.
- Rule hủy trước/sau 2h.

### Member 3 – Helper module
**Owned files**
- `backend/controllers/helpersController.js`
- `backend/routes/helpersRoutes.js`
- `backend/database.json` (helperProfiles, helperSchedules)

**Deliverables**
- Helper profile, skills, schedule.
- Rule không trùng giờ + nhận/từ chối job.

### Member 4 – Payment + Review
**Owned files**
- `backend/controllers/paymentsController.js`
- `backend/controllers/reviewsController.js`
- `backend/routes/paymentsRoutes.js`
- `backend/routes/reviewsRoutes.js`

**Deliverables**
- Payment, payout, commission 20%.
- Chỉ review booking COMPLETED.

### Member 5 – Admin + Report + Coupon
**Owned files**
- `backend/controllers/adminController.js`
- `backend/routes/adminRoutes.js`
- `backend/services/dbService.js`
- `backend/database.json` (coupons, auditLogs)

**Deliverables**
- Dashboard report, coupon management, audit logs.

### Member 6 – Frontend + API Integration
**Owned files**
- `src/**`

**Deliverables**
- Router + Dashboard cho customer/helper/admin.
- Kết nối API bằng Axios + JWT flow.

## 4) Checklist merge PR

- [ ] Code chạy local.
- [ ] Không dùng TypeScript.
- [ ] Không sửa vùng ownership của người khác (hoặc đã sync).
- [ ] Đã rebase `develop` mới nhất.
- [ ] PR mô tả rõ API/logic đã thêm.

## 5) Quy tắc commit ngắn gọn

- `feat(auth): register/login skeleton`
- `feat(booking): add pricing + status flow`
- `feat(helper): add schedule conflict check`
- `feat(payment): create payout + review guard`
- `feat(admin): add coupon and report endpoints`
- `feat(frontend): wire dashboards and routes`
