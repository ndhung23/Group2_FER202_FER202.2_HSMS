import { sendError } from "../utils/response.js";

const notFound = (req, res, next) => {
  return sendError(res, {
    statusCode: 404,
    message: "Route not found",
  });
};

export default notFound;

