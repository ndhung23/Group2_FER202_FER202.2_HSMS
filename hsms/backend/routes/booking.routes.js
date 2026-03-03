const express = require('express');
const { create, list, updateStatus } = require('../controllers/booking.controller');
const { verifyToken, requireRole } = require('../middlewares/auth');

const router = express.Router();

router.use(verifyToken);
router.post('/', requireRole(['CUSTOMER']), create);
router.get('/', requireRole(['CUSTOMER', 'HELPER', 'ADMIN']), list);
router.patch('/:id/status', requireRole(['CUSTOMER', 'HELPER', 'ADMIN']), updateStatus);

module.exports = router;
