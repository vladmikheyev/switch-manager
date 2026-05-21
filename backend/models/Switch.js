// backend/models/Switch.js
const { readDb, writeDb } = require("../config/database");

class Switch {
  static getAll(filters = {}) {
    const { switches } = readDb();
    let result = switches;

    if (filters.status)
      result = result.filter((s) => s.status === filters.status);
    if (filters.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(
        (s) =>
          (s.name || "").toLowerCase().includes(term) ||
          (s.model || "").toLowerCase().includes(term) ||
          (s.serialNumber || "").toLowerCase().includes(term),
      );
    }
    return result.sort((a, b) =>
      (b.createdAt || "").localeCompare(a.createdAt || ""),
    );
  }

  static getById(id) {
    const { switches } = readDb();
    return switches.find((s) => s.id == id) || null;
  }

  static create(data) {
    const db = readDb();
    const newSwitch = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Сохраняем документы, если они пришли с фронтенда, иначе пустой массив
      documents: Array.isArray(data.documents) ? data.documents : [],
    };

    // Теперь это сработает, так как readDb гарантирует наличие switches
    db.switches.push(newSwitch);
    writeDb(db);
    return newSwitch;
  }

  static update(id, updates) {
    const db = readDb();
    const index = db.switches.findIndex((s) => s.id == id);
    if (index === -1) return null;

    db.switches[index] = {
      ...db.switches[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    writeDb(db);
    return db.switches[index];
  }

  // backend/models/Switch.js

  static delete(id) {
    const db = readDb();

    // ✅ Приводим ID к строке для надёжного сравнения
    const idStr = String(id);

    const before = db.switches.length;

    // Фильтруем, сравнивая как строки
    db.switches = db.switches.filter((s) => String(s.id) !== idStr);

    // Удаляем связанные документы
    db.documents = (db.documents || []).filter(
      (d) => String(d.switchId) !== idStr,
    );

    writeDb(db);

    // Возвращаем успешный результат, даже если ничего не удалилось (идемпотентность)
    return { success: true, deleted: db.switches.length < before };
  }

  static getStats() {
    const { switches } = readDb();
    return {
      total: switches.length,
      active: switches.filter((s) => s.status === "active").length,
      maintenance: switches.filter((s) => s.status === "maintenance").length,
      offline: switches.filter((s) => s.status === "offline").length,
      totalPorts: switches.reduce((sum, s) => sum + (s.ports || 0), 0),
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
        pages: Math.ceil(all.length / limit),
      },
    };
  }
}

module.exports = Switch;
