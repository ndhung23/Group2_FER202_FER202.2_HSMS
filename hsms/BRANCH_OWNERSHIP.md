# Branch Ownership Matrix (6 Members)

Mục tiêu: mỗi người có vùng code chính để làm song song, hạn chế conflict.

| Member | Branch | Main Scope | API/Feature Focus |
|---|---|---|---|
| 1 | `feature/member-1-auth-users` | `backend/controllers/authController.js`, `backend/controllers/usersController.js`, `backend/routes/authRoutes.js`, `backend/routes/usersRoutes.js`, `backend/middlewares/authMiddleware.js` | register/login, user profile |
| 2 | `feature/member-2-services-bookings` | `backend/controllers/servicesController.js`, `backend/controllers/bookingsController.js`, `backend/routes/servicesRoutes.js`, `backend/routes/bookingsRoutes.js`, `backend/utils/calculatePricing.js` | service CRUD, booking flow, pricing |
| 3 | `feature/member-3-helper-module` | `backend/controllers/helpersController.js`, `backend/routes/helpersRoutes.js`, `backend/database.json` (helperProfiles/helperSchedules) | helper profile, schedule, accept/reject jobs |
| 4 | `feature/member-4-payment-review` | `backend/controllers/paymentsController.js`, `backend/controllers/reviewsController.js`, `backend/routes/paymentsRoutes.js`, `backend/routes/reviewsRoutes.js` | payment, payout, review rules |
| 5 | `feature/member-5-admin-report-coupon` | `backend/controllers/adminController.js`, `backend/routes/adminRoutes.js`, `backend/services/dbService.js`, `backend/database.json` (coupons/auditLogs) | admin dashboard, coupon, audit |
| 6 | `feature/member-6-frontend-integration` | `src/**` | frontend pages, dashboard, axios integration |

## Shared rules

1. Không dùng TypeScript.
2. Rebase `develop` trước khi mở PR.
3. Không sửa ownership của người khác nếu chưa thống nhất.
4. Giữ response format: `{ success, data, message, errorCode? }`.
