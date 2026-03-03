function notFound(req, res) {
  return res.status(404).json({
    success: false,
    data: null,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    error: 'NOT_FOUND',
  });
}

module.exports = notFound;
