const UserDAO = require('../DAO/UserDAO');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserController = {
    async register(req, res) {
        try {
            const { name, email, password, role } = req.body;
            const existingUser = await UserDAO.getUserByEmail(email);
            if (existingUser) return res.status(400).json({ message: 'Email déjà utilisé' });
            
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await UserDAO.createUser({ name, email, password: hashedPassword, role });
            res.status(201).json(newUser);
        } catch (err) {
            res.status(500).json({ message: 'Erreur serveur', error: err.message });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UserDAO.getUserByEmail(email);
            if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ message: 'Mot de passe incorrect' });

            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, user });
        } catch (err) {
            res.status(500).json({ message: 'Erreur serveur', error: err.message });
        }
    }
};

module.exports = UserController;

