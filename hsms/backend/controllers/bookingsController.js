const { getCollection, insertOne, readDB, writeDB } = require('../services/dbService');
const { generateId } = require('../utils/generateId');
const { calculatePricing } = require('../utils/calculatePricing');
const { BOOKING_STATUS, ALLOWED_BOOKING_STATUS } = require('../constants/bookingStatus');

async function createBooking(req, res, next) {
  try {
    const { customerId, serviceId, durationHours, surge = 0, discount = 0 } = req.body;
    const numericDuration = Number(durationHours);

    if (Number.isNaN(numericDuration) || numericDuration <= 0) {
      return res.status(400).json({ message: 'durationHours must be a positive number' });
    }

    const services = await getCollection('services');
    const service = services.find((item) => item.id === serviceId);

    if (!service) return res.status(404).json({ message: 'Service not found' });

    const pricing = calculatePricing({
      basePrice: Number(service.basePrice || 0),
      durationHours: numericDuration,
      surge: Number(surge || 0),
      discount: Number(discount || 0),
      commissionRate: 0.2,
    });

    const now = new Date().toISOString();
    const booking = {
      id: generateId('booking'),
      customerId,
      serviceId,
      durationHours: numericDuration,
      status: BOOKING_STATUS.PENDING_MATCH,
      pricing,
      createdAt: now,
      updatedAt: now,
    };

    await insertOne('bookings', booking);
    return res.status(201).json({ message: 'Booking created', data: booking });
  } catch (error) {
    return next(error);
  }
}

async function getBookings(req, res, next) {
  try {
    const bookings = await getCollection('bookings');
    return res.json({ data: bookings });
  } catch (error) {
    return next(error);
  }
}

async function getBookingById(req, res, next) {
  try {
    const bookings = await getCollection('bookings');
    const booking = bookings.find((item) => item.id === req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    return res.json({ data: booking });
  } catch (error) {
    return next(error);
  }
}

async function updateBookingStatus(req, res, next) {
  try {
    const { status } = req.body;

    if (!ALLOWED_BOOKING_STATUS.has(status)) {
      return res.status(400).json({ message: 'Invalid booking status' });
    }

    const db = await readDB();
    const index = db.bookings.findIndex((item) => item.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'Booking not found' });

    db.bookings[index].status = status;
    db.bookings[index].updatedAt = new Date().toISOString();

    await writeDB(db);
    return res.json({ message: 'Booking status updated', data: db.bookings[index] });
  } catch (error) {
    return next(error);
  }
}

module.exports = { createBooking, getBookings, getBookingById, updateBookingStatus };
