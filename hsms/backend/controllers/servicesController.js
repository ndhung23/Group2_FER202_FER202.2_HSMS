const { getCollection, insertOne } = require('../services/dbService');
const { generateId } = require('../utils/generateId');

async function getServices(req, res, next) {
  try {
    const services = await getCollection('services');
    return res.json({ data: services });
  } catch (error) {
    return next(error);
  }
}

async function createService(req, res, next) {
  try {
    const payload = {
      id: generateId('svc'),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await insertOne('services', payload);
    return res.status(201).json({ message: 'Service created', data: payload });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getServices, createService };
