const { readDB, insert } = require('../utils/db');
const { generateId } = require('../utils/id');
const { nowISO } = require('../utils/time');
const { hashPassword } = require('../utils/password');

async function ensureAdminSeed() {
  const db = await readDB();
  const admin = db.users.find((u) => u.role === 'ADMIN' && u.phone === '0900000000');
  if (admin) return admin;

  const now = nowISO();
  const newAdmin = {
    id: generateId('usr'),
    phone: '0900000000',
    fullName: 'Default Admin',
    role: 'ADMIN',
    passwordHash: hashPassword('admin123'),
    status: 'ACTIVE',
    createdAt: now,
    updatedAt: now,
  };

  await insert('users', newAdmin);
  return newAdmin;
}

module.exports = { ensureAdminSeed };
