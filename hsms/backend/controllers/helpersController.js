const { getCollection, readDB, writeDB } = require('../services/dbService');

async function getHelpers(req, res, next) {
  try {
    const users = await getCollection('users');
    const helpers = users.filter((user) => user.role === 'HELPER');
    return res.json({ data: helpers });
  } catch (error) {
    return next(error);
  }
}

async function getHelperById(req, res, next) {
  try {
    const users = await getCollection('users');
    const helper = users.find((user) => user.id === req.params.id && user.role === 'HELPER');
    if (!helper) return res.status(404).json({ message: 'Helper not found' });
    return res.json({ data: helper });
  } catch (error) {
    return next(error);
  }
}

async function updateHelper(req, res, next) {
  try {
    const db = await readDB();
    const index = db.users.findIndex((user) => user.id === req.params.id && user.role === 'HELPER');
    if (index === -1) return res.status(404).json({ message: 'Helper not found' });

    db.users[index] = { ...db.users[index], ...req.body, updatedAt: new Date().toISOString() };
    await writeDB(db);
    return res.json({ message: 'Helper updated', data: db.users[index] });
  } catch (error) {
    return next(error);
  }
}

async function helperDashboard(req, res) {
  return res.json({
    message: 'Helper dashboard stub',
    data: {
      helperId: req.user.sub,
      availableJobs: 0,
      myJobs: 0,
      earnings: 0,
    },
  });
}

module.exports = { getHelpers, getHelperById, updateHelper, helperDashboard };
