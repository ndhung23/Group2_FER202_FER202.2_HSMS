import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import healthRouter from "./routers/health.routes.js";
import authRouter from "./routers/auth.routes.js";
import servicesRouter from "./routers/services.routes.js";
import bookingsRouter from "./routers/bookings.routes.js";

import notFound from "./src/middlewares/notFound.js";
import errorHandler from "./src/middlewares/errorHandler.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Global middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// API routes (stubs)
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/services", servicesRouter);
app.use("/api/bookings", bookingsRouter);

// 404 and error handlers (skeleton)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend stub server running on port ${PORT}`);
});
