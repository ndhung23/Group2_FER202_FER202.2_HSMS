const express = require('express');
const { getServices, createService } = require('../controllers/servicesController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.get('/', getServices);
router.post('/', verifyToken, checkRole(ROLES.ADMIN), createService);

module.exports = router;
