const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    teamName: { type: String, required: true },
    tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' },
    points: { type: Number, default: 0 },
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" }
}, { timestamps: true });

module.exports = mongoose.model("TournamentRegistration", registrationSchema);