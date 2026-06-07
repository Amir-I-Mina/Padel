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
        type: String,
        required: true,
        trim: true
    },
    time: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        default: 450
    },
    paymentMethod: {
        type: String,
        enum: ["Cash", "Credit Card", "Debit Card"],
        default: "Cash"
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