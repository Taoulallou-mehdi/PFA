const UserDAO = require('../DAO/UserDAO');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken');

const UserController = {
    // Register a new user
    async register(req, res, next) {
        try {
            const { name, email, password, role } = req.body;
            const existingUser = await UserDAO.getUserByEmail(email);
            if (existingUser) return res.status(400).json({ message: 'Email déjà utilisé' });

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await UserDAO.createUser({ name, email, password: hashedPassword, role });
            res.status(201).json(newUser);
        } catch (err) {
            next(err);
        }
    },

    // Login a user
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await UserDAO.getUserByEmail(email);
            if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, user });
        } catch (err) {
            next(err);
        }
    },

    // Get all users
    async getAllUsers(req, res, next) {
        try {
            const users = await UserDAO.getAllUsers();
            res.json(users);
        } catch (err) {
            next(err);
        }
    },

    // Get user by ID
    async getUserById(req, res, next) {
        try {
            const { id } = req.params;
            const user = await UserDAO.getUserById(id);
            if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
            res.json(user);
        } catch (err) {
            next(err);
        }
    },

    // Update user info
    async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const updatedUser = await UserDAO.updateUser(id, req.body);
            if (!updatedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });
            res.json(updatedUser);
        } catch (err) {
            next(err);
        }
    },

    // Delete user
    async deleteUser(req, res, next) {
        try {
            const { id } = req.params;
            const deletedUser = await UserDAO.deleteUser(id);
            if (!deletedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });
            res.json({ message: 'Utilisateur supprimé' });
        } catch (err) {
            next(err);
        }
    },

    // Get self info (current user)
    async getUserSelf(req, res, next) {
        try {
            const userId = req.user.id; // Assuming user ID is stored in req.user after authentication
            const user = await UserDAO.getUserById(userId);
            if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
            res.json(user);
        } catch (err) {
            next(err);
        }
    },

    // Update user's points and coins
    async updateUserPointsAndCoins(req, res, next) {
        try {
            const { userId, pointsToAdd } = req.body;

            // Validate points to add
            if (typeof pointsToAdd !== 'number' || pointsToAdd <= 0) {
                return res.status(400).json({ message: 'Invalid points to add' });
            }

            // Fetch user and update points and coins
            const user = await UserDAO.getUserById(userId);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const updatedPoints = user.points + pointsToAdd; // Add points
            const updatedCoins = updatedPoints * 20; // Each point is worth 20 coins

            // Save updated data
            user.points = updatedPoints;
            user.coins = updatedCoins;
            await user.save();  // Ensure the user object is saved with updated data

            return res.json(user); // Return updated user
        } catch (err) {
            next(err);
        }
    },

    // Get leaderboard sorted by coins (descending)
    async getLeaderboard(req, res, next) {
        try {
            const leaderboard = await UserDAO.getAllUsers().sort({ coins: -1 }).limit(10); // Limit to top 10
            // Only send name and coins in the leaderboard
            const leaderboardData = leaderboard.map(user => ({
                name: user.name,
                coins: user.coins
            }));

            return res.json(leaderboardData); // Return leaderboard data
        } catch (err) {
            next(err);
        }
    }
};


module.exports = UserController;
