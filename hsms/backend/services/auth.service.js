const { readDB, insert } = require('../utils/db');
const { generateId } = require('../utils/id');
const { nowISO } = require('../utils/time');
const { hashPassword, comparePassword } = require('../utils/password');
const { sign } = require('../utils/jwt');

async function registerUser({ phone, fullName, password, role }) {
  const db = await readDB();
  const exists = db.users.find((u) => u.phone === phone);
  if (exists) {
    const err = new Error('Phone already exists');
    err.status = 409;
    throw err;
  }

  const now = nowISO();
  const user = {
    id: generateId('usr'),
    phone,
    fullName,
    role,
    passwordHash: hashPassword(password),
    status: 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  };

  await insert('users', user);
  const { passwordHash, ...safe } = user;
  return safe;
}

async function loginUser({ phone, password }) {
  const db = await readDB();
  const user = db.users.find((u) => u.phone === phone);
  if (!user || !comparePassword(password, user.passwordHash)) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const token = sign({ sub: user.id, role: user.role, phone: user.phone }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '7d' });
  const { passwordHash, ...safe } = user;
  return { accessToken: token, user: safe };
}

module.exports = { registerUser, loginUser };
