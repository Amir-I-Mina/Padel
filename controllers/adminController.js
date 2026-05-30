const admin_get_dashboard = (req, res) => {
    res.render("admin/dashboard");
};

const admin_get_homeManagement = (req, res) => {
    res.render("admin/homeManagement");
};

const admin_get_users = (req, res) => {
    res.render("admin/users");
};

module.exports = {
    admin_get_dashboard,
    admin_get_homeManagement,
    admin_get_users
};
const Product = require('../models/productSchema');

// ─── PRODUCT MANAGEMENT ───

const admin_get_products = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.render('admin/products', { products, currentPage: 'products' });
    } catch (err) {
        console.log(err);
        res.status(500).send('Error loading products');
    }
};

const admin_get_allProducts = async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name:     { $regex: search, $options: 'i' } },
                { desc:     { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        res.json({ success: true, products });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const admin_addProduct = async (req, res) => {
    try {
        const { name, price, desc, category, hasOptions, sizes, colors, image } = req.body;

        if (!name || !price) {
            return res.status(400).json({ success: false, message: 'Name and price are required' });
        }

        const product = new Product({
            name,
            price:      parseFloat(price),
            desc:       desc       || '',
            category:   category   || 'general',
            hasOptions: hasOptions || false,
            sizes:      hasOptions ? (sizes  || ['S','M','L','XL']) : [],
            colors:     hasOptions ? (colors || ['White','Black','Navy']) : [],
            image:      image      || 'placeholder.png',
            inStock:    true
        });

        await product.save();
        res.status(201).json({ success: true, product, message: 'Product added successfully' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

const admin_updateProduct = async (req, res) => {
    try {
        const { name, price, desc, category, hasOptions, sizes, colors, image } = req.body;

        const updateData = {};
        if (name)                    updateData.name       = name;
        if (price)                   updateData.price      = parseFloat(price);
        if (desc)                    updateData.desc       = desc;
        if (category)                updateData.category   = category;
        if (hasOptions !== undefined) updateData.hasOptions = hasOptions;
        if (sizes)                   updateData.sizes      = sizes;
        if (colors)                  updateData.colors     = colors;
        if (image)                   updateData.image      = image;

        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        res.json({ success: true, product, message: 'Product updated successfully' });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

const admin_toggleStock = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        product.inStock = !product.inStock;
        await product.save();

        res.json({
            success: true,
            product,
            message: `Product marked as ${product.inStock ? 'in stock' : 'out of stock'}`
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const admin_deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

module.exports = {
    admin_get_products,
    admin_get_allProducts,
    admin_addProduct,
    admin_updateProduct,
    admin_toggleStock,
    admin_deleteProduct
};