import express from "express";
import { sendSuccess } from "../src/utils/response.js";

const router = express.Router();

const mockServices = [
  {
    id: 1,
    name: "Dọn dẹp nhà cửa",
    description: "Dịch vụ dọn dẹp nhà cửa cơ bản theo giờ.",
    price: 150000,
  },
  {
    id: 2,
    name: "Giặt ủi quần áo",
    description: "Giặt ủi, gấp quần áo tại nhà.",
    price: 100000,
  },
  {
    id: 3,
    name: "Nấu ăn theo giờ",
    description: "Nấu ăn gia đình theo thực đơn yêu cầu.",
    price: 200000,
  },
];

router.get("/", (req, res) => {
  return sendSuccess(res, {
    data: mockServices,
    message: "Fetched services (stub)",
  });
});

export default router;

