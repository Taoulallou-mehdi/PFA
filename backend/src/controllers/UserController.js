const UserDAO = require('../DAO/UserDAO');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserController = {
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

    async getAllUsers(req, res, next) {
        try {
            const users = await UserDAO.getAllUsers();
            res.json(users);
        } catch (err) {
            next(err);
        }
    },

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
    async getUserSelf(req, res, next) {
        try {
            const userId = req.user.id; // Assuming user ID is stored in req.user after authentication
            const user = await UserDAO.getUserById(userId);
            if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
            res.json(user);
        } catch (err) {
            next(err);
        }
    }
};

module.exports = UserController;
