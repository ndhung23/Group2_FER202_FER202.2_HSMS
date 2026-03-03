const { getCollection, readDB, writeDB } = require('../services/dbService');

async function getUsers(req, res, next) {
  try {
    const users = await getCollection('users');
    return res.json({ data: users });
  } catch (error) {
    return next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const users = await getCollection('users');
    const user = users.find((u) => u.id === req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ data: user });
  } catch (error) {
    return next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const db = await readDB();
    const index = db.users.findIndex((u) => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ message: 'User not found' });

    db.users[index] = { ...db.users[index], ...req.body, updatedAt: new Date().toISOString() };
    await writeDB(db);
    return res.json({ message: 'User updated', data: db.users[index] });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getUsers, getUserById, updateUser };
