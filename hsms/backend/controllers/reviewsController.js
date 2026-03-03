const { getCollection, insertOne } = require('../services/dbService');
const { generateId } = require('../utils/generateId');

async function createReview(req, res, next) {
  try {
    const { bookingId } = req.body;
    const bookings = await getCollection('bookings');
    const booking = bookings.find((item) => item.id === bookingId);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'COMPLETED') {
      return res.status(400).json({ message: 'Only completed booking can be reviewed' });
    }

    const review = {
      id: generateId('review'),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await insertOne('reviews', review);
    return res.status(201).json({ message: 'Review created', data: review });
  } catch (error) {
    return next(error);
  }
}

module.exports = { createReview };
