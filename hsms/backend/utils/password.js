const crypto = require('crypto');

function hashPassword(plainText = '') {
  return crypto.createHash('sha256').update(String(plainText)).digest('hex');
}

function comparePassword(plainText, passwordHash) {
  return hashPassword(plainText) === passwordHash;
}

module.exports = { hashPassword, comparePassword };
