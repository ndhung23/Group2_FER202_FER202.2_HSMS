const express = require('express');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth.routes');
const serviceRoutes = require('./routes/service.routes');
const bookingRoutes = require('./routes/booking.routes');
const paymentRoutes = require('./routes/payment.routes');
const reviewRoutes = require('./routes/review.routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const { ensureAdminSeed } = require('./services/seed.service');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();
  return next();
});
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ success: true, data: { service: 'backend', status: 'ok' }, message: 'Healthy', error: null });
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);

app.use(notFound);
app.use(errorHandler);

ensureAdminSeed()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to seed admin:', err.message);
    process.exit(1);
  });
