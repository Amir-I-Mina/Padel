const mongoose = require("mongoose");

const coachSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    age: {
        type: Number,
        required: true,
        min: 18,
        max: 70,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        minlength: 11,
        maxlength: 11,
        trim: true
    },

    location: {
        type: String,
        required: true,
        trim: true
    },

    experience: {
        type: Number,
        required: true,
        min: 0,
        trim: true
    },

    availableDays: [{
        type: String,
        required: true,
        trim:true
    }],

    availableTimes: [{
        type: String,
        required: true,
        trim: true
    }],

    trainingType: [{
        type: String,
        enum: ["private", "group"],
        required: true
    }],

    image: {
        type: String,
        default: "",
        trim: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Coach", coachSchema);