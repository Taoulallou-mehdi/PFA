const TrajetDAO = require('../dao/TrajetDAO');

const TrajetController = {
    async createTrajet(req, res, next) {
        try {
            const newTrajet = await TrajetDAO.createTrajet(req.body);
            res.status(201).json(newTrajet);
        } catch (err) {
            next(err);
        }
    },

    async getTrajet(req, res, next) {
        try {
            const trajet = await TrajetDAO.getTrajetById(req.params.id);
            if (!trajet) return res.status(404).json({ message: 'Trajet non trouvé' });
            res.json(trajet);
        } catch (err) {
            next(err);
        }
    },
    async getAllTrajets(req, res, next) {
        try {
            const trajets = await TrajetDAO.getAllTrajets();
            res.json(trajets);
        } catch (err) {
            next(err);
        }
    },
    async updateTrajet(req, res, next) {
        try {
            const updatedTrajet = await TrajetDAO.updateTrajet(req.params.id, req.body);
            if (!updatedTrajet) return res.status(404).json({ message: 'Trajet non trouvé' });
            res.json(updatedTrajet);
        } catch (err) {
            next(err);
        }
    },
};

module.exports = TrajetController;