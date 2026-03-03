const crypto = require('crypto');

function toBase64Url(value) {
  return Buffer.from(value).toString('base64url');
}

function fromBase64Url(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function parseDurationToMs(duration = '7d') {
  const match = String(duration).trim().match(/^(\d+)([smhd])$/i);
  if (!match) return 7 * 24 * 60 * 60 * 1000;

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const unitMap = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return amount * unitMap[unit];
}

function createSignature(data, secret) {
  return crypto.createHmac('sha256', secret).update(data).digest('base64url');
}

function signToken(payload, secret, options = {}) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const expiresInMs = parseDurationToMs(options.expiresIn || '7d');

  const tokenPayload = {
    ...payload,
    iat: Date.now(),
    exp: Date.now() + expiresInMs,
  };

  const encodedHeader = toBase64Url(JSON.stringify(header));
  const encodedPayload = toBase64Url(JSON.stringify(tokenPayload));
  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = createSignature(data, secret);

  return `${data}.${signature}`;
}

function verifyToken(token, secret) {
  if (!token || typeof token !== 'string') {
    throw new Error('Token is required');
  }

  const [encodedHeader, encodedPayload, signature] = token.split('.');
  if (!encodedHeader || !encodedPayload || !signature) {
    throw new Error('Malformed token');
  }

  const data = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = createSignature(data, secret);

  if (signature !== expectedSignature) {
    throw new Error('Invalid token signature');
  }

  const payload = JSON.parse(fromBase64Url(encodedPayload));

  if (payload.exp && Date.now() > payload.exp) {
    throw new Error('Token expired');
  }

  return payload;
}

module.exports = {
  signToken,
  verifyToken,
};
