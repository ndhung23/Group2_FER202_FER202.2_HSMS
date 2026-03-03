const crypto = require('crypto');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function comparePassword(plainText, storedHash) {
  const [salt, hash] = String(storedHash).split(':');
  if (!salt || !hash) return false;
  const compare = crypto.pbkdf2Sync(plainText, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(compare));
}

module.exports = { hashPassword, comparePassword };
