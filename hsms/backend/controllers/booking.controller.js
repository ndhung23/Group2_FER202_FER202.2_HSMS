const { createBooking, listBookingsByRole, updateBookingStatus } = require('../services/booking.service');

async function create(req, res, next) {
  try {
    const { serviceId, addressId, startTime, endTime, note, couponCode } = req.body;
    const data = await createBooking({ customerId: req.user.sub, serviceId, addressId, startTime, endTime, note, couponCode });
    return res.status(201).json({ success: true, data, message: 'Booking created', error: null });
  } catch (error) {
    return next(error);
  }
}

async function list(req, res, next) {
  try {
    const data = await listBookingsByRole(req.user);
    return res.json({ success: true, data, message: 'Bookings fetched', error: null });
  } catch (error) {
    return next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    const data = await updateBookingStatus({ bookingId: req.params.id, user: req.user, status });
    return res.json({ success: true, data, message: 'Booking status updated', error: null });
  } catch (error) {
    return next(error);
  }
}

module.exports = { create, list, updateStatus };
