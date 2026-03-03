import express from "express";
import { sendSuccess } from "../src/utils/response.js";

const router = express.Router();

// In-memory stub bookings
const bookings = [
  {
    id: 1,
    customerName: "Nguyễn Văn A",
    serviceId: 1,
    serviceName: "Dọn dẹp nhà cửa",
    startTime: "2026-03-04T09:00:00",
    endTime: "2026-03-04T11:00:00",
    note: "Dọn dẹp phòng khách và bếp",
    status: "PENDING",
  },
];

router.get("/", (req, res) => {
  return sendSuccess(res, {
    data: bookings,
    message: "Fetched bookings (stub)",
  });
});

router.post("/", (req, res) => {
  const { serviceId, startTime, endTime, note } = req.body || {};

  const newBooking = {
    id: bookings.length + 1,
    customerName: "Khách hàng demo",
    serviceId,
    serviceName: "Dịch vụ demo",
    startTime,
    endTime,
    note,
    status: "PENDING",
  };

  bookings.push(newBooking);

  return sendSuccess(res, {
    data: newBooking,
    message: "Created booking (stub)",
  });
});

export default router;

