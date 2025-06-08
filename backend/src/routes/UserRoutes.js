const express = require('express');
const UserController = require('../controllers/UserController');
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Existing Routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/', UserController.getAllUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

// GET /me - Fetch authenticated user's information
router.get('/me', authenticateToken, UserController.getUserSelf);

// New Routes

// POST /update - Update user points and coins
router.post('/update', authenticateToken, async (req, res) => {
  const { userId, pointsToAdd } = req.body; // Use pointsToAdd to increment points
  
  if (typeof pointsToAdd !== 'number' || pointsToAdd <= 0) {
    return res.status(400).json({ message: 'Invalid points to add' });
  }

  try {
    // Update user points and coins by calling the controller's method
    const user = await UserController.updateUserPointsAndCoins(userId, pointsToAdd);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user); // Return the updated user
  } catch (error) {
    console.error('Error updating user data:', error);
    return res.status(500).json({ message: 'Error updating user data' });
  }
});

// GET /leaderboard - Get leaderboard of users sorted by coins
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await UserController.getLeaderboard();
    return res.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

module.exports = router;
