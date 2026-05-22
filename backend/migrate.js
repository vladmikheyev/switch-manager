// backend/migrate.js
const fs = require('fs');
const path = require('path');

// Пути к файлам
const OLD_DATA_PATH = path.join(__dirname, 'migrate-old-data.json');
const NEW_DB_PATH = path.join(__dirname, 'data', 'switches.json');

// Чтение старых данных
console.log('📥 Чтение старых данных...');
const oldData = JSON.parse(fs.readFileSync(OLD_DATA_PATH, 'utf8'));

// Преобразование документов: старая структура → новая
const transformDocument = (doc, switchId, index) => ({
  id: Date.now() + index, // Уникальный ID для документа
  switchId,               // Связь с коммутатором
  filename: path.basename(doc.path), // Извлекаем имя файла из пути
  originalName: doc.name, // Оригинальное имя
  mimetype: doc.type,     // MIME-тип
  size: doc.size,         // Размер в байтах
  uploadedAt: doc.uploadDate // Дата загрузки
});

// Преобразование коммутатора: старая структура → новая
const transformSwitch = (sw, index) => {
  const now = new Date().toISOString();
  
  return {
    // Основные поля (сопоставление имен)
    id: sw.id,
    name: sw.name,
    model: sw.model,
    location: sw.location,
    serialNumber: sw.serialNumber || null,
    requestNumber: sw.requestNumber || null,
    technician: sw.technician || null,
    ports: sw.ports,
    status: sw.status || 'active',
    vendor: sw.vendor || null,
    purchaseDate: sw.purchaseDate || null,
    comment: sw.comment || null,
    
    // Новые обязательные поля
    createdAt: sw.createdAt || now,
    updatedAt: sw.updatedAt || now,
    
    // Документы: преобразуем массив
    documents: (sw.documents || []).map((doc, idx) => 
      transformDocument(doc, sw.id, index * 100 + idx)
    )
  };
};

// Преобразование всех записей
const newSwitches = oldData.map(transformSwitch);

// Формируем новую структуру БД
const newDb = {
  switches: newSwitches,
  documents: [] // В новой версии документы хранятся внутри switches
};

// Создаём папку data если нет
const dataDir = path.dirname(NEW_DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Запись новой БД
console.log('💾 Запись новой базы данных...');
fs.writeFileSync(NEW_DB_PATH, JSON.stringify(newDb, null, 2), 'utf8');

// Статистика
const totalSwitches = newSwitches.length;
const totalDocs = newSwitches.reduce((sum, sw) => sum + (sw.documents?.length || 0), 0);
const byStatus = {
  active: newSwitches.filter(s => s.status === 'active').length,
  maintenance: newSwitches.filter(s => s.status === 'maintenance').length,
  offline: newSwitches.filter(s => s.status === 'offline').length
};

console.log(`
✅ Миграция завершена!

📊 Статистика:
   • Коммутаторов: ${totalSwitches}
   • Документов: ${totalDocs}
   • Активных: ${byStatus.active}
   • На складе: ${byStatus.maintenance}
   • Неизвестно: ${byStatus.offline}

📁 Файл сохранён: ${NEW_DB_PATH}
🔄 Теперь перезапустите бэкенд: npm run dev
`);