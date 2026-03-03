const { registerUser, loginUser } = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const { phone, fullName, password, role } = req.body;
    if (!phone || !fullName || !password || !['CUSTOMER', 'HELPER'].includes(role)) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid payload', error: 'BAD_REQUEST' });
    }

    const data = await registerUser({ phone, fullName, password, role });
    return res.status(201).json({ success: true, data, message: 'Register success', error: null });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ success: false, data: null, message: 'Missing phone/password', error: 'BAD_REQUEST' });
    }

    const data = await loginUser({ phone, password });
    return res.json({ success: true, data, message: 'Login success', error: null });
  } catch (error) {
    return next(error);
  }
}

module.exports = { register, login };
