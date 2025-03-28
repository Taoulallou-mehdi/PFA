const Collecte = require('../models/Collecte');

const CollecteDAO = {
    async createCollecte(data) {
        const collecte = new Collecte(data);
        return await collecte.save();
    },
    
    async getCollecteById(id) {
        return await Collecte.findById(id).populate('agent').populate('poubelle');
    },
    
    async getAllCollectes() {
        return await Collecte.find().populate('agent').populate('poubelle');
    },
    
    async deleteCollecte(id) {
        return await Collecte.findByIdAndDelete(id);
    }
};

module.exports = CollecteDAO;
