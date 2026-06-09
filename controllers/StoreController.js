const Product = require('../models/ProductSchema');
const path = require('path');

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


// GET /api/admin/products  →  all products (including out-of-stock)
exports.getAdminAllProducts = async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.manage_get_products = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.render('pages/products', { products, currentPage: 'products' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Error loading products');
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { name, price, desc, category, hasOptions, sizes, colors } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Name and price are required' });
    }

    let imageName = 'placeholder.png';

    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      imageName = Date.now() + '_' + imageFile.name;
      const uploadPath = path.join(__dirname, '../public/images/', imageName);
      await imageFile.mv(uploadPath);
    }

    const product = new Product({
      name,
      price: parseFloat(price),
      desc:       desc       || '',
      category:   category   || 'general',
      hasOptions: hasOptions === 'true',
      sizes:      hasOptions === 'true' ? (sizes  || ['S','M','L','XL']) : [],
      colors:     hasOptions === 'true' ? (colors || ['White','Black','Navy']) : [],
      image:      imageName,
      inStock:    true
    });

    await product.save();
    res.status(201).json({ success: true, product, message: 'Product added successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const { name, price, desc, category, hasOptions, sizes, colors, image } = req.body;

    const updateData = {};
    if (name)       updateData.name       = name;
    if (price)      updateData.price      = parseFloat(price);
    if (desc)       updateData.desc       = desc;
    if (category)   updateData.category   = category;
    if (hasOptions !== undefined) updateData.hasOptions = hasOptions;
    if (sizes)      updateData.sizes      = sizes;
    if (colors)     updateData.colors     = colors;
    if (image)      updateData.image      = image;

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, product, message: 'Product updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.toggleStock = async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};