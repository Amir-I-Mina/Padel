const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, default: 'General' },
    status: { type: String, enum: ['OPEN', 'CLOSED', 'UPCOMING'], default: 'OPEN' }
}, { timestamps: true });

module.exports = mongoose.model('Tournament', tournamentSchema);
