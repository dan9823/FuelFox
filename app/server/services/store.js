const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getFilePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

function readCollection(collection) {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

function writeCollection(collection, data) {
  const filePath = getFilePath(collection);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function findById(collection, id) {
  const items = readCollection(collection);
  return items.find((item) => item.id === id) || null;
}

function findByField(collection, field, value) {
  const items = readCollection(collection);
  return items.find((item) => item[field] === value) || null;
}

function filterByField(collection, field, value) {
  const items = readCollection(collection);
  return items.filter((item) => item[field] === value);
}

function insert(collection, item) {
  const items = readCollection(collection);
  items.push(item);
  writeCollection(collection, items);
  return item;
}

function update(collection, id, updates) {
  const items = readCollection(collection);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;
  items[index] = { ...items[index], ...updates };
  writeCollection(collection, items);
  return items[index];
}

function remove(collection, id) {
  const items = readCollection(collection);
  const filtered = items.filter((item) => item.id !== id);
  writeCollection(collection, filtered);
  return filtered.length < items.length;
}

module.exports = {
  readCollection,
  writeCollection,
  findById,
  findByField,
  filterByField,
  insert,
  update,
  remove,
};
