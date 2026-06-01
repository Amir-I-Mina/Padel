const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", // Links to the user in your system
        required: true 
    },
    tournamentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Tournament", // Links to the tournament event
        required: true 
    },
    teamName: { type: String, required: true, trim: true },
    captainName: { type: String, required: true, trim: true },
    status: { 
        type: String, 
        enum: ["PENDING", "APPROVED", "REJECTED"], 
        default: "PENDING" 
    },
    points: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("TournamentRegistration", registrationSchema);