const RewardDAO = require('../DAO/RewardDAO');

class RewardController {
  async getUserRewards(req, res) {
    try {
      const reward = await RewardDAO.getByUserId(req.params.userId);
      res.json(reward || { userId: req.params.userId, points: 0, history: [] });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async addRewardPoints(req, res) {
    const { userId, action, points } = req.body;
    try {
      const reward = await RewardDAO.addPoints(userId, action, points);
      res.json(reward);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async resetUserRewards(req, res) {
    const { userId } = req.body;
    try {
      const reward = await RewardDAO.resetPoints(userId);
      res.json(reward);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new RewardController();
