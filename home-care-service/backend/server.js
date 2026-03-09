import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const otpStore = new Map();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});
app.get("/", (req, res) => {
  res.send("Backend OTP đang chạy");
});
app.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Email không được để trống."
      });
    }
    //Tạo OTP 6 chữ số (0.234234 × 900000 = 210810) 100000 + 210810 = 310810
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    //300000s
    const expires = Date.now() + 5 * 60 * 1000;
    otpStore.set(email, {
      otp,
      expires
    });
    console.log("OTP của", email, "là", otp);
    await transporter.sendMail({
      from: `"HomeCare" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Mã OTP đặt lại mật khẩu",
      html: `
        <div style="font-family: Arial, sans-serif">
          <h2>HomeCare</h2>
          <p>Mã OTP của bạn là:</p>
          <h1 style="letter-spacing: 6px;">${otp}</h1>
          <p>Mã có hiệu lực trong 5 phút.</p>
        </div>
      `
    });
    return res.json({
      message: "Đã gửi OTP về email."
    });
  } catch (error) {
    console.error("Lỗi gửi OTP:", error);
    return res.status(500).json({
      message: "Không gửi được OTP."
    });
  }
});
app.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore.get(email);
  if (!record) {
    return res.status(400).json({
      message: "OTP không tồn tại."
    });
  }
  if (Date.now() > record.expires) {
    otpStore.delete(email);
    return res.status(400).json({
      message: "OTP đã hết hạn."
    });
  }
  if (record.otp !== otp) {
    return res.status(400).json({
      message: "OTP không đúng."
    });
  }
  otpStore.delete(email);
  return res.json({
    message: "OTP hợp lệ."
  });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend chạy tại http://localhost:${PORT}`);
});