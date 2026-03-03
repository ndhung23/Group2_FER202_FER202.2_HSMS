export const sendSuccess = (res, { data = null, message = "OK" } = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
    error: null,
  });
};

export const sendError = (
  res,
  { message = "Something went wrong", statusCode = 500, error = null } = {}
) => {
  return res.status(statusCode).json({
    success: false,
    data: null,
    message,
    error,
  });
};

