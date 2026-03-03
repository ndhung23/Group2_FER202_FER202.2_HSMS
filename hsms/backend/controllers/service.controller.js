const { readDB } = require('../utils/db');
const { insert, update, remove } = require('../utils/db');
const { generateId } = require('../utils/id');
const { nowISO } = require('../utils/time');

async function getServices(req, res, next) {
  try {
    const db = await readDB();
    return res.json({ success: true, data: db.services, message: 'Services fetched', error: null });
  } catch (error) {
    return next(error);
  }
}

async function createService(req, res, next) {
  try {
    const { name, basePrice, description } = req.body;
    if (!name || Number(basePrice) < 0) {
      return res.status(400).json({ success: false, data: null, message: 'Invalid payload', error: 'BAD_REQUEST' });
    }

    const now = nowISO();
    const data = await insert('services', {
      id: generateId('svc'),
      name,
      basePrice: Number(basePrice),
      description: description || '',
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    return res.status(201).json({ success: true, data, message: 'Service created', error: null });
  } catch (error) {
    return next(error);
  }
}

async function patchService(req, res, next) {
  try {
    const data = await update('services', req.params.id, { ...req.body, updatedAt: nowISO() });
    if (!data) return res.status(404).json({ success: false, data: null, message: 'Service not found', error: 'NOT_FOUND' });
    return res.json({ success: true, data, message: 'Service updated', error: null });
  } catch (error) {
    return next(error);
  }
}

async function deleteService(req, res, next) {
  try {
    const ok = await remove('services', req.params.id);
    if (!ok) return res.status(404).json({ success: false, data: null, message: 'Service not found', error: 'NOT_FOUND' });
    return res.json({ success: true, data: { id: req.params.id }, message: 'Service deleted', error: null });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getServices, createService, patchService, deleteService };
