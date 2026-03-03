import { sendError } from "../utils/response.js";

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return sendError(res, {
    statusCode,
    message,
    error: process.env.NODE_ENV === "production" ? null : err.stack || err,
  });
};

export default errorHandler;

