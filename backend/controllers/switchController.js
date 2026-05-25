// backend/controllers/switchController.js
const Switch = require("../models/Switch");

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

// POST /api/switches - Создать новый коммутатор
exports.createSwitch = async (req, res, next) => {
  try {
    const newSwitch = Switch.create(req.body);

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
    const existing = Switch.getById(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: "Коммутатор не найден" });
    }

    const updated = Switch.update(req.params.id, req.body);

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

    const result = Switch.delete(switchId);

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

// POST /api/upload/:switchId - Загрузить файл
// backend/controllers/switchController.js (в методе uploadFile)

exports.uploadFile = async (req, res, next) => {
  try {
    const switchId = req.params.switchId;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не выбран' });
    }

    const switchItem = Switch.getById(switchId);
    if (!switchItem) {
      const fs = require('fs');
      const filePath = path.join(process.cwd(), 'uploads', req.file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(404).json({ error: 'Коммутатор не найден' });
    }

    // ✅ Сохраняем originalname как есть (UTF-8)
    const document = await Switch.addDocument(switchId, {
      filename: req.file.filename,           // uuid.jpg на диске
      originalname: req.file.originalname,   // ✅ Оригинальное имя с кириллицей
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    res.status(201).json({
      success: true,
      message: 'Файл успешно загружен',
      document: {
        id: document.id,
        name: document.originalName,    // ✅ Отправляем оригинальное имя
        filename: document.filename,    // Имя на диске
        mimetype: document.mimetype,
        size: document.size,
        uploadedAt: document.uploadedAt
      }
    });
  } catch (error) {
    console.error('❌ Ошибка загрузки файла:', error);
    if (req.file?.path) {
      const fs = require('fs');
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
      const fs = require("fs");
      const path = require("path");
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
