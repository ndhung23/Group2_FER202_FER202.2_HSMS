const fs = require('fs/promises');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'database.json');
let writeQueue = Promise.resolve();

async function readDB() {
  const raw = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

async function writeDB(data) {
  writeQueue = writeQueue.then(async () => {
    const tempPath = `${DB_PATH}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    await fs.rename(tempPath, DB_PATH);
  });

  return writeQueue;
}

async function findById(collection, id) {
  const db = await readDB();
  return (db[collection] || []).find((x) => x.id === id) || null;
}

async function insert(collection, obj) {
  const db = await readDB();
  db[collection] = db[collection] || [];
  db[collection].push(obj);
  await writeDB(db);
  return obj;
}

async function update(collection, id, patch) {
  const db = await readDB();
  db[collection] = db[collection] || [];
  const idx = db[collection].findIndex((x) => x.id === id);
  if (idx < 0) return null;
  db[collection][idx] = { ...db[collection][idx], ...patch };
  await writeDB(db);
  return db[collection][idx];
}

async function remove(collection, id) {
  const db = await readDB();
  db[collection] = db[collection] || [];
  const before = db[collection].length;
  db[collection] = db[collection].filter((x) => x.id !== id);
  await writeDB(db);
  return before !== db[collection].length;
}

module.exports = { readDB, writeDB, findById, insert, update, remove };
