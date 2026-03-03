import express from "express";
import { sendSuccess } from "../src/utils/response.js";

const router = express.Router();

router.post("/login", (req, res) => {
  const { phone } = req.body || {};

  let role = "CUSTOMER";
  if (phone === "0900000000") {
    role = "ADMIN";
  } else if (phone === "0999999999") {
    role = "HELPER";
  }

  const token = "mock-token";

  return sendSuccess(res, {
    data: {
      token,
      role,
      user: {
        phone,
        role,
      },
    },
    message: "Login stub successful",
  });
});

router.post("/register", (req, res) => {
  const { fullName, phone, role = "CUSTOMER" } = req.body || {};

  return sendSuccess(res, {
    data: {
      id: Date.now(),
      fullName,
      phone,
      role,
    },
    message: "Register stub successful",
  });
});

export default router;

