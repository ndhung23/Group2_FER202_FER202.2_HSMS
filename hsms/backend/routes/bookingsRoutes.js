const express = require('express');
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
} = require('../controllers/bookingsController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { requireFields } = require('../middlewares/validateMiddleware');

const router = express.Router();

router.use(verifyToken);
router.post('/', requireFields(['customerId', 'serviceId', 'durationHours']), createBooking);
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.patch('/:id/status', requireFields(['status']), updateBookingStatus);

module.exports = router;
