const { v4: uuidv4 } = require('uuid');

function generateId(prefix = 'id') {
  return `${prefix}_${uuidv4().replace(/-/g, '').slice(0, 12)}`;
}

module.exports = { generateId };
