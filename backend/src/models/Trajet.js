const mongoose = require('mongoose');

const TrajetSchema = new mongoose.Schema({
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    route: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Poubelle' }],
    optimized: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trajet', TrajetSchema);
