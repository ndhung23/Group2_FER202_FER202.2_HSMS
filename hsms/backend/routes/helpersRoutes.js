const express = require('express');
const {
  getHelpers,
  getHelperById,
  updateHelper,
  helperDashboard,
} = require('../controllers/helpersController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.get('/dashboard', verifyToken, checkRole(ROLES.HELPER), helperDashboard);
router.get('/', getHelpers);
router.get('/:id', getHelperById);
router.patch('/:id', verifyToken, checkRole(ROLES.HELPER, ROLES.ADMIN), updateHelper);

module.exports = router;
