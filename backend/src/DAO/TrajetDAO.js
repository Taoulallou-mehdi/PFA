const Trajet = require('../models/Trajet');

const TrajetDAO = {
    async createTrajet(data) {
        const trajet = new Trajet(data);
        return await trajet.save();
    },
    
    async getTrajetById(id) {
        return await Trajet.findById(id).populate('agent').populate('route');
    },
    
    async getAllTrajets() {
        return await Trajet.find().populate('agent').populate('route');
    },
    
    async updateTrajet(id, updateData) {
        return await Trajet.findByIdAndUpdate(id, updateData, { new: true });
    },
    
    async deleteTrajet(id) {
        return await Trajet.findByIdAndDelete(id);
    }
};

module.exports = TrajetDAO;
