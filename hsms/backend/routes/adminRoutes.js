const express = require('express');
const { adminDashboard } = require('../controllers/adminController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.use(verifyToken, checkRole(ROLES.ADMIN));
router.get('/dashboard', adminDashboard);

module.exports = router;
