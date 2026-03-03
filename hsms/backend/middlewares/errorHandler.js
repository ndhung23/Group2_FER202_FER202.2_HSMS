function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  return res.status(status).json({
    success: false,
    data: null,
    message: err.message || 'Internal Server Error',
    error: err.error || 'INTERNAL_ERROR',
  });
}

module.exports = errorHandler;
