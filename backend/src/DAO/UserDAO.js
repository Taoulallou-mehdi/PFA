const User = require('../models/User');

const UserDAO = {
    async createUser(userData) {
        return await User.create(userData);
    },

    async getUserByEmail(email) {
        return await User.findOne({ email });
    },

    async getAllUsers() {
        return await User.find();
    },

    async getUserById(id) {
        return await User.findById(id);
    },

    async updateUser(id, updateData) {
        return await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    },

    async deleteUser(id) {
        return await User.findByIdAndDelete(id);
    }
};

module.exports = UserDAO;
