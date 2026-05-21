// backend/controllers/switchController.js
const Switch = require('../models/Switch');
const { db } = require('../config/database');
const path = require('path');
const fs = require('fs');

// GET /api/switches - Получить список коммутаторов
exports.getSwitches = async (req, res, next) => {
  try {
    const { status, search, limit } = req.query;
    const switches = Switch.getAll({ status, search, limit });
    
    res.json({
      success: true,
      data: switches,
      count: switches.length
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/switches/:id - Получить коммутатор по ID
exports.getSwitch = async (req, res, next) => {
  try {
    const switchItem = Switch.getById(req.params.id);
    
    if (!switchItem) {
      return res.status(404).json({ error: 'Коммутатор не найден' });
    }

    // Получаем документы для этого коммутатора
    const documents = db.prepare(`
      SELECT id, filename, original_name, mimetype, size, uploaded_at 
      FROM documents WHERE switch_id = ?
    `).all(req.params.id);

    res.json({
      success: true,
      data: { ...switchItem, documents }
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/switches - Создать новый коммутатор
exports.createSwitch = async (req, res, next) => {
  try {
    const newSwitch = Switch.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Коммутатор успешно создан',
      data: newSwitch
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/switches/:id - Обновить коммутатор
exports.updateSwitch = async (req, res, next) => {
  try {
    const existing = Switch.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Коммутатор не найден' });
    }

    const updated = Switch.update(req.params.id, req.body);
    
    res.json({
      success: true,
      message: 'Коммутатор успешно обновлён',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/switches/:id - Удалить коммутатор
exports.deleteSwitch = async (req, res, next) => {
  try {
    const existing = Switch.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Коммутатор не найден' });
    }

    // Удаляем связанные документы
    const documents = db.prepare(
      'SELECT filename FROM documents WHERE switch_id = ?'
    ).all(req.params.id);

    documents.forEach(doc => {
      const filePath = path.join(process.env.UPLOAD_PATH || './uploads', doc.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    // Удаляем записи из БД
    db.prepare('DELETE FROM documents WHERE switch_id = ?').run(req.params.id);
    Switch.delete(req.params.id);

    res.json({
      success: true,
      message: 'Коммутатор успешно удалён'
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/switches/stats - Получить статистику
exports.getStats = async (req, res, next) => {
  try {
    const stats = Switch.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

// POST /api/upload/:switchId - Загрузить файл
exports.uploadFile = async (req, res, next) => {
  try {
    const switchId = req.params.switchId;
    
    // Проверяем существование коммутатора
    const switchItem = Switch.getById(switchId);
    if (!switchItem) {
      // Удаляем загруженный файл если коммутатор не найден
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ error: 'Коммутатор не найден' });
    }

    // Сохраняем информацию о файле в БД
    const result = db.prepare(`
      INSERT INTO documents (switch_id, filename, original_name, mimetype, size)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      switchId,
      req.file.filename,
      req.file.originalname,
      req.file.mimetype,
      req.file.size
    );

    const document = db.prepare('SELECT * FROM documents WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Файл успешно загружен',
      document: {
        id: document.id,
        name: document.original_name,
        filename: document.filename,
        mimetype: document.mimetype,
        size: document.size,
        uploadedAt: document.uploaded_at
      }
    });
  } catch (error) {
    // Удаляем файл при ошибке
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// DELETE /api/document/:switchId/:filename - Удалить документ
exports.deleteDocument = async (req, res, next) => {
  try {
    const { switchId, filename } = req.params;

    // Проверяем существование документа
    const doc = db.prepare(
      'SELECT * FROM documents WHERE switch_id = ? AND filename = ?'
    ).get(switchId, filename);

    if (!doc) {
      return res.status(404).json({ error: 'Документ не найден' });
    }

    // Удаляем файл с диска
    const filePath = path.join(process.env.UPLOAD_PATH || './uploads', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Удаляем запись из БД
    db.prepare('DELETE FROM documents WHERE id = ?').run(doc.id);

    res.json({
      success: true,
      message: 'Документ успешно удалён'
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/switches/search - Поиск коммутаторов
exports.searchSwitches = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({ error: 'Поисковый запрос должен содержать минимум 2 символа' });
    }

    const result = Switch.search(q, parseInt(page), parseInt(limit));
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};