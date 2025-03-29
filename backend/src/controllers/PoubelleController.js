const PoubelleDAO = require('../DAO/PoubelleDAO');

const PoubelleController = {
    async createPoubelle(req, res, next) {
        try {
            const newPoubelle = await PoubelleDAO.createPoubelle(req.body);
            res.status(201).json(newPoubelle);
        } catch (err) {
            next(err);
        }
    },

    async getPoubelle(req, res, next) {
        try {
            const poubelle = await PoubelleDAO.getPoubelleById(req.params.id);
            if (!poubelle) return res.status(404).json({ message: 'Poubelle non trouvée' });
            res.json(poubelle);
        } catch (err) {
            next(err);
        }
    },

    async getAllPoubelles(req, res, next) {
        try {
            const poubelles = await PoubelleDAO.getAllPoubelles();
            res.json(poubelles);
        } catch (err) {
            next(err);
        }
    },

    async updatePoubelle(req, res, next) {
        try {
            const updatedPoubelle = await PoubelleDAO.updatePoubelle(req.params.id, req.body);
            if (!updatedPoubelle) return res.status(404).json({ message: 'Poubelle non trouvée' });
            res.json(updatedPoubelle);
        } catch (err) {
            next(err);
        }
    },

    async deletePoubelle(req, res, next) {
        try {
            const deletedPoubelle = await PoubelleDAO.deletePoubelle(req.params.id);
            if (!deletedPoubelle) return res.status(404).json({ message: 'Poubelle non trouvée' });
            res.json({ message: 'Poubelle supprimée' });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = PoubelleController;