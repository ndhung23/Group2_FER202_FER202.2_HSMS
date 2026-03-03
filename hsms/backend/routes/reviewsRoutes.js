const express = require('express');
const { createReview } = require('../controllers/reviewsController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', verifyToken, createReview);

module.exports = router;
