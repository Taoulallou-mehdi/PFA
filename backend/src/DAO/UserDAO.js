const User = require('../models/User');

const UserDAO = {
    // Create a new user
    async createUser(userData) {
        try {
            const newUser = await User.create(userData);
            return newUser;
        } catch (err) {
            throw new Error('Error creating user: ' + err.message);
        }
    },

    // Get user by email
    async getUserByEmail(email) {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch (err) {
            throw new Error('Error fetching user by email: ' + err.message);
        }
    },

    // Get all users
    async getAllUsers() {
        try {
            const users = await User.find();
            return users;
        } catch (err) {
            throw new Error('Error fetching all users: ' + err.message);
        }
    },

    // Get user by ID
    async getUserById(id) {
        try {
            const user = await User.findById(id);
            return user;
        } catch (err) {
            throw new Error('Error fetching user by ID: ' + err.message);
        }
    },

    // Update user data
    async updateUser(id, updateData) {
        try {
            const updatedUser = await User.findByIdAndUpdate(id, updateData, {
                new: true,
                runValidators: true,
            });
            return updatedUser;
        } catch (err) {
            throw new Error('Error updating user: ' + err.message);
        }
    },

    // Delete user
    async deleteUser(id) {
        try {
            const deletedUser = await User.findByIdAndDelete(id);
            return deletedUser;
        } catch (err) {
            throw new Error('Error deleting user: ' + err.message);
        }
    }
};

module.exports = UserDAO;
