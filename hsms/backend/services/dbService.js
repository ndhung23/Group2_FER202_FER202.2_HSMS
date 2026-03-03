const fs = require('fs/promises');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'database.json');

async function readDB() {
  const raw = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

async function writeDB(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

async function getCollection(collectionName) {
  const db = await readDB();
  return db[collectionName] || [];
}

async function insertOne(collectionName, doc) {
  const db = await readDB();
  db[collectionName] = db[collectionName] || [];
  db[collectionName].push(doc);
  await writeDB(db);
  return doc;
}

module.exports = {
  readDB,
  writeDB,
  getCollection,
  insertOne,
};
