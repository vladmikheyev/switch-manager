// backend/models/Switch.js
const { readDb, writeDb } = require('../config/database');

class Switch {
  // ============================================
  // CRUD для коммутаторов
  // ============================================

  static getAll(filters = {}) {
    const { switches } = readDb();
    let result = switches;
    
    if (filters.status) {
      result = result.filter(s => s.status === filters.status);
    }
    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(s => 
        (s.name || '').toLowerCase().includes(term) || 
        (s.model || '').toLowerCase().includes(term) ||
        (s.serialNumber || '').toLowerCase().includes(term) ||
        (s.location || '').toLowerCase().includes(term)
      );
    }
    return result.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }

  static getById(id) {
    const { switches } = readDb();
    const sw = switches.find(s => String(s.id) === String(id));
    if (!sw) return null;
    
    // Добавляем документы к коммутатору
    return { ...sw, documents: this.getDocuments(id) };
  }

  static create(data) {
    const db = readDb();
    const now = new Date().toISOString();
    
    const newSwitch = {
      ...data,
      id: Date.now(),
      createdAt: now,
      updatedAt: now,
      documents: [] // Новые коммутаторы создаются без документов
    };
    
    db.switches.push(newSwitch);
    writeDb(db);
    return newSwitch;
  }

  static update(id, updates) {
    const db = readDb();
    const index = db.switches.findIndex(s => String(s.id) === String(id));
    if (index === -1) return null;
    
    db.switches[index] = { 
      ...db.switches[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    writeDb(db);
    return db.switches[index];
  }

  static delete(id) {
    const db = readDb();
    const before = db.switches.length;
    
    // Удаляем коммутатор
    db.switches = db.switches.filter(s => String(s.id) !== String(id));
    
    // Удаляем связанные документы из БД
    db.documents = (db.documents || []).filter(d => String(d.switchId) !== String(id));
    
    writeDb(db);
    return { success: true, deleted: db.switches.length < before };
  }

  // ============================================
  // Статистика и поиск
  // ============================================

  static getStats() {
    const { switches } = readDb();
    return {
      total: switches.length,
      active: switches.filter(s => s.status === 'active').length,
      maintenance: switches.filter(s => s.status === 'maintenance').length,
      offline: switches.filter(s => s.status === 'offline').length,
      archived: switches.filter(s => s.status === 'archived').length,
      totalPorts: switches.reduce((sum, s) => sum + (parseInt(s.ports) || 0), 0)
    };
  }

  static search(query, page = 1, limit = 20) {
    const all = this.getAll({ search: query });
    const start = (page - 1) * limit;
    return {
      data: all.slice(start, start + limit),
      pagination: { 
        page, 
        limit, 
        total: all.length, 
        pages: Math.ceil(all.length / limit) 
      }
    };
  }

  // ============================================
  // ✅ Методы для работы с документами (ДОБАВЛЕНО)
  // ============================================

  /**
   * Получить все документы коммутатора
   * @param {string|number} switchId - ID коммутатора
   * @returns {Array} Массив документов
   */
  static getDocuments(switchId) {
    const { documents } = readDb();
    if (!Array.isArray(documents)) return [];
    
    return documents.filter(d => String(d.switchId) === String(switchId));
  }

  /**
   * Добавить документ к коммутатору
   * @param {string|number} switchId - ID коммутатора
   * @param {Object} fileData - Данные файла от multer
   * @returns {Object} Созданный документ
   */
  static addDocument(switchId, fileData) {
    const db = readDb();
    
    // Инициализируем массив документов если нет
    if (!Array.isArray(db.documents)) {
      db.documents = [];
    }
    
    // Создаём запись документа
    const newDoc = {
      id: Date.now(), // Уникальный ID документа
      switchId: String(switchId), // Связь с коммутатором (строка для надёжности)
      filename: fileData.filename, // Уникальное имя на диске (uuid.jpg)
      originalName: fileData.originalname, // Оригинальное имя файла
      mimetype: fileData.mimetype,
      size: fileData.size,
      uploadedAt: new Date().toISOString()
    };
    
    // Добавляем в БД
    db.documents.push(newDoc);
    writeDb(db);
    
    return newDoc;
  }

  /**
   * Удалить документ коммутатора
   * @param {string|number} switchId - ID коммутатора
   * @param {string} filename - Имя файла для удаления (uuid.jpg)
   * @returns {boolean} Был ли документ удалён
   */
  static deleteDocument(switchId, filename) {
    const db = readDb();
    
    if (!Array.isArray(db.documents)) return false;
    
    const before = db.documents.length;
    
    // Фильтруем: удаляем документ с совпадающим switchId и filename
    db.documents = db.documents.filter(d => 
      !(String(d.switchId) === String(switchId) && d.filename === filename)
    );
    
    writeDb(db);
    return db.documents.length < before;
  }
}

module.exports = Switch;