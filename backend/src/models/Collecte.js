const mongoose = require('mongoose');

const CollecteSchema = new mongoose.Schema({
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    poubelle: { type: mongoose.Schema.Types.ObjectId, ref: 'Poubelle', required: true },
    collectedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Collecte', CollecteSchema);
