const { readDB, insert } = require('../utils/db');
const { generateId } = require('../utils/id');
const { nowISO } = require('../utils/time');

async function createReview(req, res, next) {
  try {
    const { bookingId, rating, comment } = req.body;
    const db = await readDB();
    const booking = db.bookings.find((b) => b.id === bookingId && b.customerId === req.user.sub);

    if (!booking) {
      return res.status(404).json({ success: false, data: null, message: 'Booking not found', error: 'NOT_FOUND' });
    }

    if (booking.status !== 'COMPLETED') {
      return res.status(400).json({ success: false, data: null, message: 'Can only review completed booking', error: 'BAD_REQUEST' });
    }

    const now = nowISO();
    const data = await insert('reviews', {
      id: generateId('rev'),
      bookingId,
      customerId: req.user.sub,
      helperId: booking.helperId,
      rating: Number(rating),
      comment: comment || '',
      createdAt: now,
      updatedAt: now,
    });

    return res.status(201).json({ success: true, data, message: 'Review created', error: null });
  } catch (error) {
    return next(error);
  }
}

module.exports = { createReview };
