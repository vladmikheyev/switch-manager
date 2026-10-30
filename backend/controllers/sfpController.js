// backend/controllers/sfpController.js
const SfpModule = require('../models/SfpModule');

exports.getSfpList = (req, res) => {
  try {
    const items = SfpModule.getAll();
    res.json({ success: true, data: items, count: items.length });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.createSfp = (req, res) => {
  try {
    const item = SfpModule.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.updateSfp = (req, res) => {
  try {
    const item = SfpModule.update(req.params.id, req.body);
    if (!item) return res.status(404).json({ error: 'SFP модуль не найден' });
    res.json({ success: true, data: item });
  } catch (e) { res.status(400).json({ error: e.message }); }
};

exports.deleteSfp = (req, res) => {
  try {
    const result = SfpModule.delete(req.params.id);
    res.json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
};

exports.getSfpHistory = (req, res) => {
  try {
    const history = SfpModule.getHistory(req.params.id, parseInt(req.query.limit) || 50);
    res.json({ success: true, data: history });
  } catch (e) { res.status(500).json({ error: e.message }); }
};

const path = require('path');
const fs = require('fs');

exports.uploadSfpDocument = async (req, res, next) => {
  try {
    const sfpId = req.params.id;
    if (!req.file) return res.status(400).json({ error: 'Файл не выбран' });

    const sfp = require('../models/SfpModule').getById(sfpId);
    if (!sfp) {
      const filePath = path.join(process.cwd(), 'uploads', req.file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(404).json({ error: 'SFP модуль не найден' });
    }

    const doc = require('../models/SfpModule').addDocument(sfpId, {
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    res.status(201).json({ success: true, document: doc });
  } catch (error) { next(error); }
};

exports.deleteSfpDocument = async (req, res, next) => {
  try {
    const { id, filename } = req.params;
    const deleted = require('../models/SfpModule').deleteDocument(id, filename);
    if (deleted) {
      const filePath = path.join(process.cwd(), 'uploads', filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    res.json({ success: true });
  } catch (error) { next(error); }
};