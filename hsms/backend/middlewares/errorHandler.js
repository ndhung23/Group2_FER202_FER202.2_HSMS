function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err);
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
  });
}

module.exports = { errorHandler };
