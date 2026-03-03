const http = require('http');
const { URL } = require('url');

const PORT = Number(process.env.PORT || 5000);

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
  });
  res.end(JSON.stringify(payload));
}

function notFound(res) {
  return sendJson(res, 404, { message: 'Route not found' });
}

function routeStub(method, pathname, req, res) {
  const registry = {
    'POST /api/auth/register': 'register stub',
    'POST /api/auth/login': 'login stub',
    'GET /api/users': 'users list stub',
    'GET /api/services': 'services list stub',
    'POST /api/services': 'create service stub',
    'POST /api/bookings': 'create booking stub',
    'GET /api/bookings': 'bookings list stub',
    'PATCH /api/bookings/status': 'booking status update stub',
    'GET /api/helpers': 'helpers list stub',
    'GET /api/helpers/dashboard': 'helper dashboard stub',
    'POST /api/payments': 'create payment stub',
    'POST /api/reviews': 'create review stub',
    'GET /api/admin/dashboard': 'admin dashboard stub',
  };

  const key = `${method} ${pathname}`;
  if (!registry[key]) {
    return false;
  }

  sendJson(res, 200, {
    message: registry[key],
    path: pathname,
    method,
    note: 'Backend khung (JavaScript only). Team implement dần theo module.',
  });
  return true;
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    return sendJson(res, 204, { message: 'ok' });
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  if (req.method === 'GET' && pathname === '/health') {
    return sendJson(res, 200, {
      message: 'HSMS backend is running',
      port: PORT,
    });
  }

  // Dynamic booking id stub support
  if (req.method === 'GET' && pathname.startsWith('/api/bookings/')) {
    return sendJson(res, 200, {
      message: 'booking detail stub',
      bookingId: pathname.replace('/api/bookings/', ''),
    });
  }

  // Keep path shape close to requested API.
  if (routeStub(req.method, pathname, req, res)) {
    return;
  }

  return notFound(res);
});

server.listen(PORT, () => {
  console.log(`HSMS backend listening at http://localhost:${PORT}`);
});
