# HSMS Backend

## Setup

```bash
npm install
npm run dev
```

- Default port: `4000`
- Health: `GET /health`
- Default admin seeded on startup:
  - phone: `0900000000`
  - password: `admin123`
  - role: `ADMIN`

## API response shape

```json
{
  "success": true,
  "data": {},
  "message": "...",
  "error": null
}
```
