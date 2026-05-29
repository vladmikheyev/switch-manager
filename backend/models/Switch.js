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
      documents: [], // Новые коммутаторы создаются без документов
      history: []    // ✅ Инициализируем историю для нового коммутатора
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
  // Методы для работы с документами
  // ============================================

  static getDocuments(switchId) {
    const { documents } = readDb();
    if (!Array.isArray(documents)) return [];
    
    return documents.filter(d => String(d.switchId) === String(switchId));
  }

  static addDocument(switchId, fileData) {
    const db = readDb();
    
    if (!Array.isArray(db.documents)) {
      db.documents = [];
    }
    
    const newDoc = {
      id: Date.now(),
      switchId: String(switchId),
      filename: fileData.filename,
      originalName: fileData.originalname,
      mimetype: fileData.mimetype,
      size: fileData.size,
      uploadedAt: new Date().toISOString()
    };
    
    db.documents.push(newDoc);
    writeDb(db);
    
    return newDoc;
  }

  static deleteDocument(switchId, filename) {
    const db = readDb();
    
    if (!Array.isArray(db.documents)) return false;
    
    const before = db.documents.length;
    
    db.documents = db.documents.filter(d => 
      !(String(d.switchId) === String(switchId) && d.filename === filename)
    );
    
    writeDb(db);
    return db.documents.length < before;
  }

  // ============================================
  // ✅ Методы для работы с историей изменений
  // ============================================

  /**
   * Добавить запись в историю изменений коммутатора
   * @param {string|number} switchId - ID коммутатора
   * @param {string} action - Тип действия: 'create' | 'update' | 'delete'
   * @param {Object} changes - Объект с изменениями { field: { old, new } }
   * @param {string} user - Имя пользователя/техника
   * @returns {Object} Созданная запись истории
   */
  static addHistory(switchId, action, changes, user = 'Система') {
    const db = readDb();
    const idx = db.switches.findIndex(s => String(s.id) === String(switchId));
    if (idx === -1) return null;
    
    // Инициализируем историю если нет
    if (!Array.isArray(db.switches[idx].history)) {
      db.switches[idx].history = [];
    }

    // Добавляем запись
    db.switches[idx].history.push({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action, // 'create' | 'update' | 'delete'
      user,
      changes
    });

    // Храним только последние 100 записей, чтобы JSON не раздувался
    if (db.switches[idx].history.length > 100) {
      db.switches[idx].history.shift();
    }
    
    writeDb(db);
    return db.switches[idx].history[db.switches[idx].history.length - 1];
  }

  /**
   * Получить историю коммутатора (новые записи в начале)
   * @param {string|number} switchId - ID коммутатора
   * @param {number} limit - Максимальное количество записей
   * @returns {Array} Массив записей истории
   */
  static getHistory(switchId, limit = 50) {
    const { switches } = readDb();
    const sw = switches.find(s => String(s.id) === String(switchId));
    
    if (!sw || !Array.isArray(sw.history)) return [];
    
    // Возвращаем от новых к старым, с ограничением
    return [...sw.history].reverse().slice(0, limit);
  }

  /**
   * Сравнить два объекта и вернуть только изменённые поля
   * @param {Object} oldObj - Старое состояние
   * @param {Object} newObj - Новое состояние
   * @returns {Object} Объект различий { field: { old, new } }
   */
  static getChanges(oldObj, newObj) {
    const changes = {};
    const fields = [
      'name', 'model', 'location', 'serialNumber', 'requestNumber',
      'technician', 'vendor', 'status', 'ports', 'purchaseDate', 'comment'
    ];
    
    for (const f of fields) {
      const old = oldObj?.[f];
      const curr = newObj?.[f];
      
      // Сравниваем, приводя к строке для надёжности
      if (String(old ?? '') !== String(curr ?? '')) {
        changes[f] = { old: old ?? null, new: curr ?? null };
      }
    }
    
    return changes;
  }
}

module.exports = Switch;