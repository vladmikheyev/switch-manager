// backend/models/Switch.js
const { readDb, writeDb } = require('../config/database');

class Switch {
  static getAll(filters = {}) {
    let { switches } = readDb();
    if (filters.status) switches = switches.filter(s => s.status === filters.status);
    if (filters.search) {
      const term = filters.search.toLowerCase();
      switches = switches.filter(s => 
        (s.name || '').toLowerCase().includes(term) || 
        (s.model || '').toLowerCase().includes(term) ||
        (s.serialNumber || '').toLowerCase().includes(term)
      );
    }
    return switches.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }

  static getById(id) {
    const { switches } = readDb();
    return switches.find(s => s.id == id) || null;
  }

  static create(data) {
    const db = readDb();
    const newSwitch = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: []
    };
    db.switches.push(newSwitch);
    writeDb(db);
    return newSwitch;
  }

  static update(id, updates) {
    const db = readDb();
    const index = db.switches.findIndex(s => s.id == id);
    if (index === -1) return null;
    
    db.switches[index] = { ...db.switches[index], ...updates, updatedAt: new Date().toISOString() };
    writeDb(db);
    return db.switches[index];
  }

  static delete(id) {
    const db = readDb();
    const before = db.switches.length;
    db.switches = db.switches.filter(s => s.id != id);
    db.documents = (db.documents || []).filter(d => d.switchId != id);
    writeDb(db);
    return db.switches.length < before;
  }

  // ✅ ДОБАВЛЕНО: Статистика
  static getStats() {
    const { switches } = readDb();
    return {
      total: switches.length,
      active: switches.filter(s => s.status === 'active').length,
      maintenance: switches.filter(s => s.status === 'maintenance').length,
      offline: switches.filter(s => s.status === 'offline').length,
      totalPorts: switches.reduce((sum, s) => sum + (s.ports || 0), 0)
    };
  }

  // ✅ ДОБАВЛЕНО: Поиск с пагинацией
  static search(query, page = 1, limit = 20) {
    const all = this.getAll({ search: query });
    const start = (page - 1) * limit;
    return {
      data: all.slice(start, start + limit),
      pagination: { page, limit, total: all.length, pages: Math.ceil(all.length / limit) }
    };
  }
}

module.exports = Switch;