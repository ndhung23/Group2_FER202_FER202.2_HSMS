import express from "express";
import { sendSuccess } from "../src/utils/response.js";

const router = express.Router();

router.get("/", (req, res) => {
  return sendSuccess(
    res,
    {
      data: { ok: true },
      message: "Health check OK",
    },
    200
  );
});

export default router;

