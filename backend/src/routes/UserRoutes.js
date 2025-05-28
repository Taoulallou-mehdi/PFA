const express = require('express');
const UserController = require('../controllers/UserController');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
router.get('/me', authenticateToken, UserController.getUserSelf);

module.exports = router;
