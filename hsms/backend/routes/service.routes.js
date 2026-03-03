const express = require('express');
const { getServices, createService, patchService, deleteService } = require('../controllers/service.controller');
const { verifyToken, requireRole } = require('../middlewares/auth');

const router = express.Router();

router.get('/', getServices);
router.post('/', verifyToken, requireRole(['ADMIN']), createService);
router.patch('/:id', verifyToken, requireRole(['ADMIN']), patchService);
router.delete('/:id', verifyToken, requireRole(['ADMIN']), deleteService);

module.exports = router;
