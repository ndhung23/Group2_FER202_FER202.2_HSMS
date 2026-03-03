const { readDB, insert, update } = require('../utils/db');
const { generateId } = require('../utils/id');
const { nowISO, yyyymmdd } = require('../utils/time');

function generateBookingCode(index) {
  return `BK-${yyyymmdd()}-${String(index).padStart(4, '0')}`;
}

async function createBooking({ customerId, serviceId, addressId, startTime, endTime, note, couponCode }) {
  const db = await readDB();
  const service = db.services.find((s) => s.id === serviceId);
  if (!service) {
    const err = new Error('Service not found');
    err.status = 404;
    throw err;
  }

  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  if (!start || !end || end <= start) {
    const err = new Error('Invalid startTime/endTime');
    err.status = 400;
    throw err;
  }

  const durationMinutes = Math.floor((end - start) / 60000);
  const base = Number(service.basePrice || 0) * (durationMinutes / 60);
  const surge = 0;
  const discount = 0;
  const total = Math.max(0, base + surge - discount);
  const now = nowISO();

  const booking = {
    id: generateId('bok'),
    bookingCode: generateBookingCode((db.bookings || []).length + 1),
    customerId,
    helperId: null,
    serviceId,
    addressId,
    startTime,
    endTime,
    note: note || '',
    couponCode: couponCode || null,
    pricing: { durationMinutes, base, surge, discount, total },
    status: 'PENDING_MATCH',
    createdAt: now,
    updatedAt: now,
  };

  await insert('bookings', booking);
  return booking;
}

async function listBookingsByRole(user) {
  const db = await readDB();
  if (user.role === 'ADMIN') return db.bookings;
  if (user.role === 'CUSTOMER') return db.bookings.filter((b) => b.customerId === user.sub);
  if (user.role === 'HELPER') return db.bookings.filter((b) => b.helperId === user.sub);
  return [];
}

async function updateBookingStatus({ bookingId, user, status }) {
  const db = await readDB();
  const booking = db.bookings.find((b) => b.id === bookingId);
  if (!booking) {
    const err = new Error('Booking not found');
    err.status = 404;
    throw err;
  }

  const customerFlow = ['CANCELLED'];
  const helperFlow = ['IN_PROGRESS', 'COMPLETED'];

  if (user.role === 'CUSTOMER' && booking.customerId !== user.sub) {
    const err = new Error('Cannot update this booking');
    err.status = 403;
    throw err;
  }

  if (user.role === 'CUSTOMER' && !customerFlow.includes(status)) {
    const err = new Error('Customer can only cancel');
    err.status = 400;
    throw err;
  }

  if (user.role === 'HELPER' && !helperFlow.includes(status)) {
    const err = new Error('Helper can only start/complete');
    err.status = 400;
    throw err;
  }

  if (user.role !== 'ADMIN' && user.role !== 'CUSTOMER' && user.role !== 'HELPER') {
    const err = new Error('Forbidden');
    err.status = 403;
    throw err;
  }

  return update('bookings', bookingId, { status, updatedAt: nowISO() });
}

module.exports = { createBooking, listBookingsByRole, updateBookingStatus };
