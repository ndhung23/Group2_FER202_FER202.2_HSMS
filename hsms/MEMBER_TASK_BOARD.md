# Member Task Board (JS only - Không dùng TypeScript)

> Mục tiêu: mỗi bạn có 1 vùng file rõ ràng để code song song, giảm conflict khi merge.

## Branch map

- Member 1: `feature/member-1-auth-users`
- Member 2: `feature/member-2-services-bookings`
- Member 3: `feature/member-3-helper-module`
- Member 4: `feature/member-4-payment-review`
- Member 5: `feature/member-5-admin-report-coupon`
- Member 6: `feature/member-6-frontend-integration`

## File ownership (khuyến nghị)

### Member 1 – Auth + Users
- `backend/controllers/authController.js`
- `backend/controllers/usersController.js`
- `backend/routes/authRoutes.js`
- `backend/routes/usersRoutes.js`
- `backend/middlewares/authMiddleware.js`
- `backend/middlewares/validateMiddleware.js`

### Member 2 – Services + Bookings
- `backend/controllers/servicesController.js`
- `backend/controllers/bookingsController.js`
- `backend/routes/servicesRoutes.js`
- `backend/routes/bookingsRoutes.js`
- `backend/utils/calculatePricing.js`
- `backend/constants/bookingStatus.js`

### Member 3 – Helper module
- `backend/controllers/helpersController.js`
- `backend/routes/helpersRoutes.js`
- `backend/database.json` (collections helperSchedules, helperProfiles)

### Member 4 – Payment + Review
- `backend/controllers/paymentsController.js`
- `backend/controllers/reviewsController.js`
- `backend/routes/paymentsRoutes.js`
- `backend/routes/reviewsRoutes.js`

### Member 5 – Admin + Audit + Coupons
- `backend/controllers/adminController.js`
- `backend/routes/adminRoutes.js`
- `backend/services/dbService.js` (nếu thêm helper query/report)
- `backend/database.json` (coupons, auditLogs)

### Member 6 – Frontend integration
- `src/**`
- API client layer + dashboard pages
- Chỉ sửa backend khi cần contract API (đi qua PR nhỏ)

## Working agreement

1. Không đổi API response shape của module người khác nếu chưa trao đổi.
2. Tạo PR nhỏ, merge vào `develop` mỗi ngày.
3. Trước khi tạo PR:
   - `npm run server` để smoke API.
   - chạy syntax check backend bằng `node --check`.
4. Chỉ dùng JavaScript (CommonJS), **không dùng TypeScript**.
