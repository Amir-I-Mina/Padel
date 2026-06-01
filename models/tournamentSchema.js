const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    status: { 
        type: String, 
        enum: ["OPEN", "ONGOING", "FINISHED"], 
        default: "OPEN" 
    },
    // This allows the Admin to define pairings for the tournament
    matches: [{
        teamA: { type: String, required: true },
        teamB: { type: String, required: true },
        scoreA: { type: Number, default: 0 },
        scoreB: { type: Number, default: 0 },
        round: { type: String, default: "Group Stage" }
    }]
}, { timestamps: true });

module.exports = mongoose.model("Tournament", tournamentSchema);