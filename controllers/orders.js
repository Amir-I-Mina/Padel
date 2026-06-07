const Order = require('../models/orders');

exports.createOrder = async (req, res) => {
    try {
        const { items, total, customer } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        if (!customer.name || !customer.phone || !customer.address) {
            return res.status(400).json({ success: false, message: 'Customer info missing' });
        }

        const order = new Order({ items, total, customer });
        await order.save();

        res.json({ success: true, message: 'Order placed!', orderId: order._id });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};