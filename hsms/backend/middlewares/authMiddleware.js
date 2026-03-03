const { verifyToken: verifyAccessToken } = require('../utils/token');

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Missing access token' });
  }

  try {
    req.user = verifyAccessToken(token, process.env.JWT_SECRET || 'dev_secret_key');
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function checkRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: role not allowed' });
    }
    return next();
  };
}

module.exports = { verifyToken, checkRole };
