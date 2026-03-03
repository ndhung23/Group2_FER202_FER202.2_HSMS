const { verify } = require('../utils/jwt');

function verifyToken(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ success: false, data: null, message: 'Missing token', error: 'UNAUTHORIZED' });
  }

  try {
    req.user = verify(token, process.env.JWT_SECRET || 'dev_secret');
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, data: null, message: 'Invalid token', error: error.message });
  }
}

function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, data: null, message: 'Forbidden', error: 'FORBIDDEN' });
    }
    return next();
  };
}

module.exports = { verifyToken, requireRole };
