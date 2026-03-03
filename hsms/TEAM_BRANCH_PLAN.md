# Team Branch Plan (6 Members)

## Quy ước branch

- `main`: branch ổn định để demo.
- `develop`: branch tích hợp chung.
- Branch thành viên theo module:
  - `feature/member-1-auth-users`
  - `feature/member-2-services-bookings`
  - `feature/member-3-helper-module`
  - `feature/member-4-payment-review`
  - `feature/member-5-admin-report-coupon`
  - `feature/member-6-frontend-integration`

> Tạo nhanh toàn bộ branch bằng lệnh:

```bash
npm run setup:branches
```

## Chia việc chi tiết

### Member 1 – Auth + Users
- Hoàn thiện: `/api/auth/register`, `/api/auth/login`.
- Bổ sung hash password + validate input + refresh token (nếu cần).
- Hoàn thiện: `GET /api/users`, `GET /api/users/:id`, `PATCH /api/users/:id`.

### Member 2 – Services + Booking Core
- Hoàn thiện service CRUD.
- Booking flow chính:
  - tạo booking
  - tính giá (`basePrice * duration + surge - discount`)
  - update status
- Rule huỷ trước/sau 2h.

### Member 3 – Helper Module
- Profile helper + skills + schedules.
- Rule không trùng giờ helper.
- Nhận/từ chối job.
- Xử lý no-show >3 lần.

### Member 4 – Payment + Review
- Thanh toán booking.
- Tạo payout cho helper.
- Logic commission mặc định 20%.
- Chỉ cho review khi booking `COMPLETED`.

### Member 5 – Admin + Audit + Coupons
- API admin dashboard/report.
- Quản lý coupons.
- Ghi audit logs cho action quan trọng.

### Member 6 – Frontend + Integration
- React routing cho public/customer/helper/admin.
- Trang: login/register, booking history, helper dashboard, admin dashboard.
- Gọi API backend bằng Axios, xử lý JWT.

## Git workflow đề xuất

1. Mỗi người code trên branch riêng.
2. Merge vào `develop` bằng Pull Request.
3. Chạy test + smoke API trước khi merge.
4. Cuối sprint merge `develop -> main` để demo.

## Định nghĩa Done cho mỗi branch

- Endpoint chạy được với Postman.
- Có validate cơ bản và mã lỗi rõ ràng.
- Không phá vỡ contract JSON response chung.
- Rebase branch mới nhất từ `develop` trước khi tạo PR.

## Quy tắc công nghệ

- Dùng JavaScript (Node.js CommonJS), **không dùng TypeScript**.
- Chi tiết ownership theo file: xem `MEMBER_TASK_BOARD.md` và `docs/TEAM_WORKSPACE.md`.
