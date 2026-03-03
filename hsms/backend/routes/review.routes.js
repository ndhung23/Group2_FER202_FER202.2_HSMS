const express = require('express');
const { createReview } = require('../controllers/review.controller');
const { verifyToken, requireRole } = require('../middlewares/auth');

const router = express.Router();

router.post('/', verifyToken, requireRole(['CUSTOMER']), createReview);

module.exports = router;
