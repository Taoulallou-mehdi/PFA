const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authenticateToken = require('../middleware/auth');

// Public Routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);

// Protected Routes
router.get('/', authenticateToken, UserController.getAllUsers);
router.get('/me', authenticateToken, UserController.getUserSelf);
router.get('/:id', authenticateToken, UserController.getUserById);
router.put('/:id', authenticateToken, UserController.updateUser);
router.delete('/:id', authenticateToken, UserController.deleteUser);

// Update user points and coins
router.post('/update', authenticateToken, UserController.updateUserPointsAndCoins);

// Get leaderboard
router.get('/leaderboard', UserController.getLeaderboard);

module.exports = router;
