const crypto = require('crypto');

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

function parseExpiry(value = '7d') {
  const m = String(value).match(/^(\d+)([smhd])$/);
  if (!m) return 7 * 24 * 60 * 60;
  const n = Number(m[1]);
  const unit = m[2];
  const map = { s: 1, m: 60, h: 3600, d: 86400 };
  return n * map[unit];
}

function sign(payload, secret, options = {}) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor(Date.now() / 1000) + parseExpiry(options.expiresIn || '7d');
  const body = { ...payload, exp, iat: Math.floor(Date.now() / 1000) };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedBody = base64url(JSON.stringify(body));
  const data = `${encodedHeader}.${encodedBody}`;
  const signature = crypto.createHmac('sha256', secret).update(data).digest('base64url');

  return `${data}.${signature}`;
}

function verify(token, secret) {
  const [h, p, s] = String(token || '').split('.');
  if (!h || !p || !s) throw new Error('Invalid token');
  const check = crypto.createHmac('sha256', secret).update(`${h}.${p}`).digest('base64url');
  if (check !== s) throw new Error('Invalid signature');
  const payload = JSON.parse(Buffer.from(p, 'base64url').toString('utf-8'));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) throw new Error('Token expired');
  return payload;
}

module.exports = { sign, verify };
