const CollecteDAO = require('../DAO/CollecteDAO');

const CollecteController = {
    async getAllCollectes(req, res, next) {
        try {
            const collectes = await CollecteDAO.getAllCollectes();
            res.json(collectes);
        } catch (err) {
            next(err);
        }
    },
    
    async createCollecte(req, res, next) {
        try {
            const newCollecte = await CollecteDAO.createCollecte(req.body);
            res.status(201).json(newCollecte);
        } catch (err) {
            next(err);
        }
    },

    async getCollecte(req, res, next) {
        try {
            const collecte = await CollecteDAO.getCollecteById(req.params.id);
            if (!collecte) return res.status(404).json({ message: 'Collecte non trouvée' });
            res.json(collecte);
        } catch (err) {
            next(err);
        }
    },


    async updateCollecte(req, res, next) {
        try {
            const updatedCollecte = await CollecteDAO.updateCollecte(req.params.id, req.body);
            if (!updatedCollecte) return res.status(404).json({ message: 'Collecte non trouvée' });
            res.json(updatedCollecte);
        } catch (err) {
            next(err);
        }
    },

    async deleteCollecte(req, res, next) {
        try {
            const deletedCollecte = await CollecteDAO.deleteCollecte(req.params.id);
            if (!deletedCollecte) return res.status(404).json({ message: 'Collecte non trouvée' });
            res.json({ message: 'Collecte supprimée' });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = CollecteController;
