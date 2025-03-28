const TrajetDAO = require('../dao/TrajetDAO');

const TrajetController = {
    async createTrajet(req, res) {
        try {
            const newTrajet = await TrajetDAO.createTrajet(req.body);
            res.status(201).json(newTrajet);
        } catch (err) {
            res.status(500).json({ message: 'Erreur serveur', error: err.message });
        }
    },

    async getTrajet(req, res) {
        try {
            const trajet = await TrajetDAO.getTrajetById(req.params.id);
            if (!trajet) return res.status(404).json({ message: 'Trajet non trouvé' });
            res.json(trajet);
        } catch (err) {
            res.status(500).json({ message: 'Erreur serveur', error: err.message });
        }
    }
};

module.exports = TrajetController;