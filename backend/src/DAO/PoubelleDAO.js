const Poubelle = require('../models/Poubelle');

const PoubelleDAO = {
    async createPoubelle(data) {
        const poubelle = new Poubelle(data);
        return await poubelle.save();
    },
    
    async getPoubelleById(id) {
        return await Poubelle.findById(id);
    },
    
    async updatePoubelle(id, updateData) {
        return await Poubelle.findByIdAndUpdate(id, updateData, { new: true });
    },
    
    async deletePoubelle(id) {
        return await Poubelle.findByIdAndDelete(id);
    }
};

module.exports = PoubelleDAO;
