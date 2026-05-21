// backend/config/database.js
const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, '../data');
const dbFile = path.join(dbDir, 'switches.json');

// Создаем папку и файл, если их нет
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify({ switches: [], documents: [] }, null, 2));
}

// Чтение БД
const readDb = () => {
  try {
    return JSON.parse(fs.readFileSync(dbFile, 'utf8'));
  } catch {
    return { switches: [], documents: [] };
  }
};

// Запись в БД
const writeDb = (data) => {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
};

console.log('✅ JSON Database ready at:', dbFile);

module.exports = { readDb, writeDb };