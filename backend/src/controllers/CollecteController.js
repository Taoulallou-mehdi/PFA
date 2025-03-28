const CollecteDAO = require('../DAO/CollecteDAO');

const CollecteController = {
    async createCollecte(req, res) {
        try {
            const newCollecte = await CollecteDAO.createCollecte(req.body);
            res.status(201).json(newCollecte);
        } catch (err) {
            res.status(500).json({ message: 'Erreur serveur', error: err.message });
        }
    },

    async getCollecte(req, res) {
        try {
            const collecte = await CollecteDAO.getCollecteById(req.params.id);
            if (!collecte) return res.status(404).json({ message: 'Collecte non trouvée' });
            res.json(collecte);
        } catch (err) {
            res.status(500).json({ message: 'Erreur serveur', error: err.message });
        }
    }
};

module.exports = CollecteController;
