const express = require('express');
const router = express.Router();
const RewardController = require('../controllers/RewardController');

router.get('/:userId', RewardController.getUserRewards);
router.post('/add', RewardController.addRewardPoints);
router.post('/reset', RewardController.resetUserRewards);

module.exports = router;
