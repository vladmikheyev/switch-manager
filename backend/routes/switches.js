// backend/routes/switches.js
const express = require('express');
const router = express.Router();
const Joi = require('joi'); // ✅ Правильный импорт
const switchController = require('../controllers/switchController');
const { upload } = require('../middleware/upload');

// Схемы валидации
const switchSchema = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    model: Joi.string().min(2).max(100).required(),
    location: Joi.string().min(2).max(200).required(),
    serialNumber: Joi.string().max(100).optional(),
    requestNumber: Joi.string().max(50).optional(),
    technician: Joi.string().max(100).optional(),
    ports: Joi.number().integer().min(1).max(48).required(),
    status: Joi.string().valid('active', 'maintenance', 'offline', 'archived').default('active'),
    vendor: Joi.string().max(100).optional(),
    purchaseDate: Joi.string().isoDate().optional(),
    comment: Joi.string().max(500).optional()
  }),
  update: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    model: Joi.string().min(2).max(100).optional(),
    location: Joi.string().min(2).max(200).optional(),
    serialNumber: Joi.string().max(100).optional(),
    requestNumber: Joi.string().max(50).optional(),
    technician: Joi.string().max(100).optional(),
    ports: Joi.number().integer().min(1).max(48).optional(),
    status: Joi.string().valid('active', 'maintenance', 'offline', 'archived').optional(),
    vendor: Joi.string().max(100).optional(),
    purchaseDate: Joi.string().isoDate().optional(),
    comment: Joi.string().max(500).optional()
  })
};

// Middleware валидации
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
// Маршруты API
// ============================================

router.get('/', switchController.getSwitches);
router.get('/stats', switchController.getStats);
router.get('/search', switchController.searchSwitches);
router.get('/:id', switchController.getSwitch);

router.post('/', validate(switchSchema.create), switchController.createSwitch);
router.put('/:id', validate(switchSchema.update), switchController.updateSwitch);
router.delete('/:id', switchController.deleteSwitch);

router.post('/upload/:switchId', upload.single('file'), switchController.uploadFile);
router.delete('/document/:switchId/:filename', switchController.deleteDocument);

// Статика для загруженных файлов
router.use('/uploads', express.static('uploads'));

module.exports = router;