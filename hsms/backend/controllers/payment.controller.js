const { insert } = require('../utils/db');
const { generateId } = require('../utils/id');
const { nowISO } = require('../utils/time');

async function createPayment(req, res, next) {
  try {
    const { bookingId, method } = req.body;
    const now = nowISO();
    const data = await insert('payments', {
      id: generateId('pay'),
      bookingId,
      customerId: req.user.sub,
      method: method || 'CASH',
      status: 'PAID',
      paidAt: now,
      createdAt: now,
      updatedAt: now,
    });
    return res.status(201).json({ success: true, data, message: 'Payment created', error: null });
  } catch (error) {
    return next(error);
  }
}

module.exports = { createPayment };
