const PoubelleDAO = require('../DAO/PoubelleDAO');

const PoubelleController = {
    async createPoubelle(req, res) {
        try {
            const newPoubelle = await PoubelleDAO.createPoubelle(req.body);
            res.status(201).json(newPoubelle);
        } catch (err) {
            res.status(500).json({ message: 'Erreur serveur', error: err.message });
        }
    },

    async getPoubelle(req, res) {
        try {
            const poubelle = await PoubelleDAO.getPoubelleById(req.params.id);
            if (!poubelle) return res.status(404).json({ message: 'Poubelle non trouvée' });
            res.json(poubelle);
        } catch (err) {
            res.status(500).json({ message: 'Erreur serveur', error: err.message });
        }
    }
};

module.exports = PoubelleController;