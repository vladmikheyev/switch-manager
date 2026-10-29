// backend/models/SfpModule.js
const fs = require("fs");
const path = require("path");
const DB_FILE = path.join(__dirname, "../data/sfp_modules.json");

// Гарантируем, что файл существует и содержит валидный массив
function ensureDb() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, "[]");
  }
  try {
    const content = fs.readFileSync(DB_FILE, "utf8").trim();
    if (!content) fs.writeFileSync(DB_FILE, "[]");
  } catch {}
}

function readDb() {
  ensureDb();
  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeDb(data) {
  ensureDb();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

class SfpModule {
  static getAll() {
    return readDb();
  }

  static getById(id) {
    return readDb().find((s) => String(s.id) === String(id)) || null;
  }

  static create(data) {
    const db = readDb();
    const newItem = {
      ...data,
      id: Date.now(),
      quantity: parseInt(data.quantity) || 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      documents: [],
      history: [],
    };
    db.push(newItem);
    writeDb(db);
    this.addHistory(
      newItem.id,
      "create",
      { model: { old: null, new: newItem.model } },
      data.technician || "Система",
    );
    return newItem;
  }

  static update(id, updates) {
    const db = readDb();
    const idx = db.findIndex((s) => String(s.id) === String(id));
    if (idx === -1) return null;

    const oldItem = { ...db[idx] };
    db[idx] = { ...db[idx], ...updates, updatedAt: new Date().toISOString() };
    writeDb(db);

    const changes = this.getChanges(oldItem, db[idx]);
    if (Object.keys(changes).length > 0) {
      this.addHistory(id, "update", changes, updates.technician || "Система");
    }
    return db[idx];
  }

  static delete(id) {
    const db = readDb();
    const before = db.length;
    const filtered = db.filter((s) => String(s.id) !== String(id));
    writeDb(filtered);
    return { success: true, deleted: filtered.length < before };
  }

  // История
  static addHistory(id, action, changes, user = "Система") {
    const db = readDb();
    const item = db.find((s) => String(s.id) === String(id));
    if (!item) return;
    item.history = item.history || [];
    item.history.push({
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action,
      user,
      changes,
    });
    if (item.history.length > 100) item.history.shift();
    writeDb(db);
  }

  static getHistory(id, limit = 50) {
    const db = readDb();
    const item = db.find((s) => String(s.id) === String(id));
    if (!item?.history) return [];
    return [...item.history].reverse().slice(0, limit);
  }

  static getChanges(oldObj, newObj) {
    const changes = {};
    // ✅ Заменили 'laserClass' на 'status'
    const fields = [
      "vendor",
      "model",
      "specs",
      "distance",
      "serialNumber",
      "status",
      "color",
      "location",
      "quantity",
    ];
    fields.forEach((f) => {
      if (String(oldObj[f] ?? "") !== String(newObj[f] ?? "")) {
        changes[f] = { old: oldObj[f] ?? null, new: newObj[f] ?? null };
      }
    });
    return changes;
  }
}

module.exports = SfpModule;
