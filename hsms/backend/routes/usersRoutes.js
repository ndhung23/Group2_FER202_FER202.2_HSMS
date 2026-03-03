const express = require('express');
const { getUsers, getUserById, updateUser } = require('../controllers/usersController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { ROLES } = require('../constants/roles');

const router = express.Router();

router.get('/', verifyToken, checkRole(ROLES.ADMIN), getUsers);
router.get('/:id', verifyToken, getUserById);
router.patch('/:id', verifyToken, updateUser);

module.exports = router;
