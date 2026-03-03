const crypto = require('crypto');

function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
}

module.exports = { generateId };
