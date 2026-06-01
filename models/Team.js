const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    teamName: { type: String, required: true, trim: true },
    player1: { type: String, required: true },
    player2: { type: String }, // Optional for solo play
    points: { type: Number, default: 0 },
    tournamentId: { type: mongoose.Schema.Types.ObjectId, ref: "Tournament" } // Links team to a tournament
}, { timestamps: true });

module.exports = mongoose.model("Team", teamSchema);