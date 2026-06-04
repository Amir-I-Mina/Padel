const Product = require('../models/ProductSchema');

exports.getStorePage = (req, res) => {
    res.render('pages/padelllllll');
};

exports.getCheckoutPage = (req, res) => {
    res.render('pages/checkout');
};

exports.getAllProducts = async (req, res) => {
    try {
        const { search } = req.query;
        let query = { inStock: true };

        if (search) {
            query.$or = [
                { name:     { $regex: search, $options: 'i' } },
                { desc:     { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};