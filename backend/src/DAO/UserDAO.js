const User = require('../models/User');

const UserDAO = {
    async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    },
    
    async getUserById(id) {
        return await User.findById(id);
    },
    
    async getUserByEmail(email) {
        return await User.findOne({ email });
    },
    
    async updateUser(id, updateData) {
        return await User.findByIdAndUpdate(id, updateData, { new: true });
    },
    
    async deleteUser(id) {
        return await User.findByIdAndDelete(id);
    }
};

module.exports = UserDAO;

