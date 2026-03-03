const { insertOne } = require('../services/dbService');
const { generateId } = require('../utils/generateId');

async function createPayment(req, res, next) {
  try {
    const payment = {
      id: generateId('pay'),
      ...req.body,
      status: req.body.status || 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await insertOne('payments', payment);
    return res.status(201).json({ message: 'Payment created', data: payment });
  } catch (error) {
    return next(error);
  }
}

module.exports = { createPayment };
