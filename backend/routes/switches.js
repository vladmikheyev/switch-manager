// backend/routes/switches.js
const path = require('path');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const switchController = require('../controllers/switchController');
const { upload } = require('../middleware/upload');

// ============================================
// Схемы валидации Joi
// ============================================
const switchSchema = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    model: Joi.string().min(2).max(100).required(),
    location: Joi.string().min(2).max(200).required(),
    ports: Joi.number().integer().min(1).max(48).required(),
    status: Joi.string().valid('active', 'maintenance', 'offline', 'archived').default('active'),
    serialNumber: Joi.string().max(100).allow('', null).optional(),
    requestNumber: Joi.string().max(50).allow('', null).optional(),
    technician: Joi.string().max(100).allow('', null).optional(),
    vendor: Joi.string().max(100).allow('', null).optional(),
    purchaseDate: Joi.string().isoDate().allow('', null).optional(),
    comment: Joi.string().max(500).allow('', null).optional()
  }).unknown(true), // Игнорируем лишние поля от фронтенда

  update: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    model: Joi.string().min(2).max(100).optional(),
    location: Joi.string().min(2).max(200).optional(),
    ports: Joi.number().integer().min(1).max(48).optional(),
    status: Joi.string().valid('active', 'maintenance', 'offline', 'archived').optional(),
    serialNumber: Joi.string().max(100).allow('', null).optional(),
    requestNumber: Joi.string().max(50).allow('', null).optional(),
    technician: Joi.string().max(100).allow('', null).optional(),
    vendor: Joi.string().max(100).allow('', null).optional(),
    purchaseDate: Joi.string().isoDate().allow('', null).optional(),
    comment: Joi.string().max(500).allow('', null).optional()
  }).unknown(true)
};

// ============================================
// Middleware валидации
// ============================================
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({
      error: 'Ошибка валидации',
      details: error.details.map(d => d.message)
    });
  }
  req.body = value;
  next();
};

// ============================================
// Middleware для корректной отдачи файлов с русскими именами
// ============================================
const serveUploads = (req, res, next) => {
  // Если это запрос к файлу в uploads
  if (req.path.startsWith('/uploads/')) {
    const filename = path.basename(req.path);
    
    // ✅ Кодируем имя файла по стандарту RFC 6266 для поддержки UTF-8
    // Это позволяет браузерам корректно отображать русские имена при скачивании
    const encodedName = encodeURIComponent(filename)
      .replace(/['()]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase())
      .replace(/\*/g, '%2A');
    
    // Устанавливаем заголовки для корректного отображения имени файла
    res.setHeader('Content-Disposition', `inline; filename="${filename}"; filename*=UTF-8''${encodedName}`);
    res.setHeader('Content-Type', 'application/octet-stream');
  }
  next();
};

// ============================================
// Маршруты API
// ============================================

// Получение данных
router.get('/', switchController.getSwitches);
router.get('/stats', switchController.getStats);
router.get('/search', switchController.searchSwitches);
router.get('/:id(\\d+)', switchController.getSwitch);

// CRUD операции
router.post('/', validate(switchSchema.create), switchController.createSwitch);
router.put('/:id(\\d+)', validate(switchSchema.update), switchController.updateSwitch);
router.delete('/:id(\\d+)', switchController.deleteSwitch);

// Загрузка и удаление файлов
router.post('/upload/:switchId(\\d+)', upload.single('file'), switchController.uploadFile);
router.delete('/document/:switchId(\\d+)/:filename', switchController.deleteDocument);

// ✅ Статика для загруженных файлов (с поддержкой русских имён)
// Middleware serveUploads должен идти ПЕРЕД express.static
router.use('/uploads', serveUploads, express.static(path.join(__dirname, '../uploads')));

module.exports = router;