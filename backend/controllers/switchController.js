// backend/controllers/switchController.js
const Switch = require("../models/Switch");
const path = require("path");
const fs = require("fs");

// ============================================
// ПОЛУЧЕНИЕ ДАННЫХ
// ============================================

// GET /api/switches - Получить список коммутаторов
exports.getSwitches = async (req, res, next) => {
  try {
    const { status, search, limit } = req.query;
    const switches = Switch.getAll({ status, search, limit });

    res.json({
      success: true,
      data: switches,
      count: switches.length,
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
      return res.status(404).json({ error: "Коммутатор не найден" });
    }

    res.json({
      success: true,
      data: switchItem,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/switches/:id/history - ✅ Получить историю изменений коммутатора
exports.getSwitchHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    // Проверяем существование коммутатора
    const sw = Switch.getById(id);
    if (!sw) {
      return res.status(404).json({ error: "Коммутатор не найден" });
    }

    const history = Switch.getHistory(id, limit);
    
    res.json({
      success: true,
      switchId: id,
      switchName: sw.name,
      history,
      count: history.length
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

// GET /api/switches/search - Поиск коммутаторов
exports.searchSwitches = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q || q.length < 2) {
      return res
        .status(400)
        .json({ error: "Поисковый запрос должен содержать минимум 2 символа" });
    }

    const result = Switch.search(q, parseInt(page), parseInt(limit));

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// CRUD ОПЕРАЦИИ (С АВТОМАТИЧЕСКОЙ ЗАПИСЬЮ В ИСТОРИЮ)
// ============================================

// POST /api/switches - Создать новый коммутатор
exports.createSwitch = async (req, res, next) => {
  try {
    const newSwitch = Switch.create(req.body);

    // ✅ Запись в историю о создании
    Switch.addHistory(newSwitch.id, 'create', {
      name: { old: null, new: newSwitch.name },
      model: { old: null, new: newSwitch.model }
    }, req.body.technician || 'Система');

    res.status(201).json({
      success: true,
      message: "Коммутатор успешно создан",
      data: newSwitch,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/switches/:id - Обновить коммутатор
exports.updateSwitch = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Получаем старое состояние ДО обновления
    const oldSwitch = Switch.getById(id);
    if (!oldSwitch) {
      return res.status(404).json({ error: "Коммутатор не найден" });
    }

    // Обновляем коммутатор
    const updated = Switch.update(id, { 
      ...req.body, 
      updatedAt: new Date().toISOString() 
    });

    // ✅ Вычисляем и записываем изменения в историю
    const changes = Switch.getChanges(oldSwitch, updated);
    if (Object.keys(changes).length > 0) {
      Switch.addHistory(id, 'update', changes, req.body.technician || 'Администратор');
      console.log(`📝 История: обновлено ${Object.keys(changes).length} полей у коммутатора ${id}`);
    }

    res.json({
      success: true,
      message: "Коммутатор успешно обновлён",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/switches/:id - Удалить коммутатор
exports.deleteSwitch = async (req, res, next) => {
  try {
    const switchId = req.params.id;
    console.log(`🗑️  Запрос на удаление коммутатора ID: ${switchId}`);

    // Получаем данные коммутатора ПЕРЕД удалением для истории
    const oldSwitch = Switch.getById(switchId);

    const result = Switch.delete(switchId);

    // ✅ Запись в историю об удалении
    if (result.deleted && oldSwitch) {
      Switch.addHistory(switchId, 'delete', {
        status: { old: oldSwitch.status, new: 'deleted' },
        location: { old: oldSwitch.location, new: null },
        name: { old: oldSwitch.name, new: null }
      }, 'Система');
    }

    res.json({
      success: true,
      message: result.deleted
        ? "Коммутатор успешно удалён"
        : "Коммутатор не найден (уже удалён?)",
      deleted: result.deleted,
    });
  } catch (error) {
    console.error("❌ Ошибка при удалении:", error);
    next(error);
  }
};

// ============================================
// РАБОТА С ФАЙЛАМИ
// ============================================

// POST /api/upload/:switchId - Загрузить файл
exports.uploadFile = async (req, res, next) => {
  try {
    const switchId = req.params.switchId;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не выбран' });
    }

    const switchItem = Switch.getById(switchId);
    if (!switchItem) {
      const filePath = path.join(process.cwd(), 'uploads', req.file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(404).json({ error: 'Коммутатор не найден' });
    }

    // Сохраняем документ в БД
    const document = await Switch.addDocument(switchId, {
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    res.status(201).json({
      success: true,
      message: 'Файл успешно загружен',
      document: {
        id: document.id,
        name: document.originalName,
        filename: document.filename,
        mimetype: document.mimetype,
        size: document.size,
        uploadedAt: document.uploadedAt
      }
    });
  } catch (error) {
    console.error('❌ Ошибка загрузки файла:', error);
    if (req.file?.path) {
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// DELETE /api/document/:switchId/:filename - Удалить документ
exports.deleteDocument = async (req, res, next) => {
  try {
    const { switchId, filename } = req.params;

    const result = await Switch.deleteDocument(switchId, filename);

    // Удаляем файл с диска если он был удалён из БД
    if (result) {
      const filePath = path.join(process.cwd(), "uploads", filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({
      success: true,
      message: "Документ успешно удалён",
    });
  } catch (error) {
    console.error("❌ Ошибка удаления документа:", error);
    next(error);
  }
};