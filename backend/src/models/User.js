const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['admin', 'agent', 'citoyen'], 
        default: 'citoyen' 
    },
    points: { 
        type: Number, 
        default: 0  // Default to 0 points
    },
    coins: { 
        type: Number, 
        default: 0  // Default to 0 coins (each point is worth 20 coins)
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Export the User model based on the schema
module.exports = mongoose.model('User', UserSchema);
