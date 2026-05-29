const Product = require('../models/productSchema');

// GET /api/products  →  load all in-stock products for the store page
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

// GET /api/products/:id  →  single product details
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
