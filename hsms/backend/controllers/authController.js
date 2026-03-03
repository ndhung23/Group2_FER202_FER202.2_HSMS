const jwt = require('jsonwebtoken');
const { getCollection, insertOne } = require('../services/dbService');
const { generateId } = require('../utils/generateId');
const { hashPassword, comparePassword } = require('../utils/password');
const { ROLES } = require('../constants/roles');

function sanitizeUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

async function register(req, res, next) {
  try {
    const { fullName, email, password, role = ROLES.CUSTOMER } = req.body;
    const users = await getCollection('users');

    if (users.find((user) => user.email === email)) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    if (!Object.values(ROLES).includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const now = new Date().toISOString();
    const newUser = {
      id: generateId('user'),
      fullName,
      email,
      passwordHash: hashPassword(password),
      role,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    };

    await insertOne('users', newUser);
    return res.status(201).json({ message: 'Register success', data: sanitizeUser(newUser) });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const users = await getCollection('users');
    const user = users.find((item) => item.email === email);

    if (!user || !comparePassword(password, user.passwordHash)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { sub: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'dev_secret_key',
      { expiresIn: '7d' },
    );

    return res.json({
      message: 'Login success',
      data: {
        accessToken: token,
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { register, login };
