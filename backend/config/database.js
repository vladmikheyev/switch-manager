// backend/config/database.js
const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, '../data');
const dbFile = path.join(dbDir, 'switches.json');

// Создаем папку, если её нет
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

// Если файла нет, создаем правильную структуру
if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify({ switches: [], documents: [] }, null, 2));
}

// Чтение БД (с защитой от старой структуры [])
const readDb = () => {
  try {
    const data = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
    
    // Если файл содержит просто массив [], преобразуем его в объект
    if (Array.isArray(data)) {
      return { switches: data, documents: [] };
    }
    
    // Если объект, проверяем наличие ключей
    return {
      switches: Array.isArray(data.switches) ? data.switches : [],
      documents: Array.isArray(data.documents) ? data.documents : []
    };
  } catch {
    return { switches: [], documents: [] };
  }
};

// Запись БД (всегда сохраняет в правильном формате)
const writeDb = (data) => {
  const safeData = {
    switches: Array.isArray(data.switches) ? data.switches : [],
    documents: Array.isArray(data.documents) ? data.documents : []
  };
  fs.writeFileSync(dbFile, JSON.stringify(safeData, null, 2));
};

console.log('✅ JSON Database ready at:', dbFile);

module.exports = { readDb, writeDb };