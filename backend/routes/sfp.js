// backend/routes/sfp.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // ✅ Без фигурных скобок!
const sfpCtrl = require('../controllers/sfpController');

router.get('/', sfpCtrl.getSfpList);
router.post('/', sfpCtrl.createSfp);
router.get('/:id/history', sfpCtrl.getSfpHistory);
router.put('/:id', sfpCtrl.updateSfp);
router.delete('/:id', sfpCtrl.deleteSfp);

// ✅ Маршруты для документов SFP
router.post('/upload/:id', upload.single('file'), sfpCtrl.uploadSfpDocument);
router.delete('/document/:id/:filename', sfpCtrl.deleteSfpDocument);

module.exports = router;