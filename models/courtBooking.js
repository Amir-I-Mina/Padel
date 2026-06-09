const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    club: {
        type: String,
        required: true,
        trim: true
    },
    court: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        default: 450
    },
    paymentMethod: {
        type: String,
        enum: ["Cash", "Credit Card", "Debit Card", null],
        default: null
    },
    promoCode: {
        type: String,
        default: "",
        trim: true
    },
    status: {
        type: String,
        enum: ["confirmed", "cancelled"],
        default: "confirmed"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Booking", bookingSchema);