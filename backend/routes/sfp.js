// backend/routes/sfp.js
const express = require('express');
const router = express.Router();
const sfpCtrl = require('../controllers/sfpController');

router.get('/', sfpCtrl.getSfpList);
router.post('/', sfpCtrl.createSfp);
router.get('/:id/history', sfpCtrl.getSfpHistory);
router.put('/:id', sfpCtrl.updateSfp);
router.delete('/:id', sfpCtrl.deleteSfp);

module.exports = router;