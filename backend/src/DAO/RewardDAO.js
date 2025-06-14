const Reward = require('../models/Reward');

class RewardDAO {
  async getByUserId(userId) {
    return await Reward.findOne({ userId });
  }

  async addPoints(userId, action, points) {
    let reward = await Reward.findOne({ userId });
    if (!reward) {
      reward = new Reward({ userId, points: 0, history: [] });
    }

    reward.points += points;
    reward.history.push({ action, pointsEarned: points });
    return await reward.save();
  }

  async resetPoints(userId) {
    return await Reward.findOneAndUpdate(
      { userId },
      { $set: { points: 0, history: [] } },
      { new: true }
    );
  }
}

module.exports = new RewardDAO();
