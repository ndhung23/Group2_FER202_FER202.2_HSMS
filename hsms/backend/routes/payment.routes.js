const express = require('express');
const { createPayment } = require('../controllers/payment.controller');
const { verifyToken, requireRole } = require('../middlewares/auth');

const router = express.Router();

router.post('/', verifyToken, requireRole(['CUSTOMER']), createPayment);

module.exports = router;
