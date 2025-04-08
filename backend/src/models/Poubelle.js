const mongoose = require('mongoose');

const PoubelleSchema = new mongoose.Schema({
    location: { type: { lat: Number, lng: Number }, required: true },
    fillLevel: { type: Number, required: true, min: 0, max: 100 },
    lastCollectedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Poubelle', PoubelleSchema);
