const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 15,
        trim: true
    },

    password: {
        type: String,
        required: true,
        minlength: 8
    },

    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }


}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);