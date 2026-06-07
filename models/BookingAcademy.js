const mongoose = require("mongoose");

const bookingmodel = new mongoose.Schema({

    //userId: {
        //type: mongoose.Schema.Types.ObjectId,
        //ref: "User",
        //required: true
    //},

    coachId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coach",
        required: true
    },

    trainingType: {
        type: String,
        enum: ["private", "group"],
        required: true
    },

    location: {
        type: String,
        required: true,
        trim: true
    },

    day: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["confirmed", "cancelled"],
        default: "confirmed"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("BookingAcademy", bookingmodel);