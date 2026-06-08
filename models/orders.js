const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [
        {
            productId: String,
            name: String,
            price: Number,
            quantity: Number,
            options: String
        }
    ],
    total: Number,
    deliveryFee: {
        type: Number,
        default: 60
    },
    customer: {
        name: String,
        phone: String,
        address: String
    },
    status: {
        type: String,
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);