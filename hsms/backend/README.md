# HSMS Backend Skeleton (JavaScript)

## Run now (không cần cài thêm package)

```bash
npm run server
```

- Server hiện chạy bằng Node.js `http` thuần để đảm bảo team chạy được ngay.
- Mục tiêu là có API khung ổn định để chia việc.

## Folder structure

```text
backend/
├── routes/
├── controllers/
├── services/
├── middlewares/
├── utils/
├── constants/
├── database.json
├── app.js
└── server.js
```

## Ready endpoints (skeleton)

- `GET /health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users`
- `GET /api/services`
- `POST /api/services`
- `POST /api/bookings`
- `GET /api/bookings`
- `GET /api/bookings/:id`
- `GET /api/helpers`
- `GET /api/helpers/dashboard`
- `POST /api/payments`
- `POST /api/reviews`
- `GET /api/admin/dashboard`

## Notes

- Đây là **khung MVP** để chia việc cho team.
- Dùng JavaScript CommonJS, **không dùng TypeScript**.
- Khi cần full Express, team có thể migrate từ khung controller/route đã tạo.
