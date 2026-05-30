const Coach = require("../models/Coach");
const Product = require('../models/productSchema');
const Tournament = require('../models/tournamentSchema');



const admin_get_dashboard = (req, res) => {
    res.render("admin/dashboard");
};

const admin_get_homeManagement = (req, res) => {
    res.render("admin/homeManagement");
};

const admin_get_users = (req, res) => {
    res.render("admin/users");
};



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

// ======================================
// Academy Admin
// ======================================

const admin_getCoachList = async (req, res) => {

    try {

        const coaches = await Coach.find();

        res.render("academy/admin/coachList", {
            coaches
        });

    } catch (err) {

        console.log(err);

        res.status(500).send("Error loading coaches");
    }
};


const admin_getAddCoachPage = async (req, res) => {

    try {

        res.render("academy/admin/addCoach");

    } catch (err) {

        console.log(err);

        res.status(500).send("Error loading add coach page");
    }
};


const admin_addCoach = async (req, res) => {

    try {

        const {
            name,
            age,
            phone,
            location,
            experience,
            availableDays,
            availableTimes,
            trainingType
        } = req.body;

        const coach = new Coach({

            name,
            age,
            phone,
            location,
            experience,
            availableDays,
            availableTimes,
            trainingType

        });

        await coach.save();

        res.redirect("/academy/admin/coaches");

    } catch (err) {

        console.log(err);

        res.status(500).send("Error adding coach");
    }
};


const admin_getEditCoachPage = async (req, res) => {

    try {

        const coach = await Coach.findById(req.params.id);

        if (!coach) {

            return res.status(404).send("Coach not found");
        }

        res.render("academy/admin/editCoach", {
            coach
        });

    } catch (err) {

        console.log(err);

        res.status(500).send("Error loading coach");
    }
};



const admin_updateCoach = async (req, res) => {

    try {

        const {
            name,
            age,
            phone,
            location,
            experience,
            availableDays,
            availableTimes,
            trainingType
        } = req.body;

        await Coach.findByIdAndUpdate(
            req.params.id,
            {
                name,
                age,
                phone,
                location,
                experience,
                availableDays,
                availableTimes,
                trainingType
            }
        );

        res.redirect("/academy/admin/coaches");

    } catch (err) {

        console.log(err);

        res.status(500).send("Error updating coach");
    }
};



const admin_deleteCoach = async (req, res) => {

    try {

        await Coach.findByIdAndDelete(req.params.id);

        res.redirect("/academy/admin/coaches");

    } catch (err) {

        console.log(err);

        res.status(500).send("Error deleting coach");
    }
};
// 1. Get ALL tournaments
exports.getAdminAllTournaments = async (req, res) => {
    try {
        const tournaments = await Tournament.find().sort({ createdAt: -1 });
        res.render('AdminPage/manage-tournaments', { 
            tournaments, 
            currentPage: 'tournaments' 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Add a new tournament
exports.addTournament = async (req, res) => {
    try {
        const { name, type, status } = req.body;
        const tournament = new Tournament({ name, type, status });
        await tournament.save();
        res.status(201).json({ success: true, message: 'Tournament created' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 3. Update an existing tournament
exports.updateTournament = async (req, res) => {
    try {
        const { name, status, type } = req.body;
        const tournament = await Tournament.findByIdAndUpdate(
            req.params.id, 
            { name, status, type }, 
            { new: true }
        );
        if (!tournament) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, tournament });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 4. Delete a tournament
exports.deleteTournament = async (req, res) => {
    try {
        const tournament = await Tournament.findByIdAndDelete(req.params.id);
        if (!tournament) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, message: 'Tournament deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Process Team Registrations (Moderation)
exports.apiProcessApproval = async (req, res) => {
    try {
        const { id, action } = req.body;
        res.status(200).json({ success: true, message: `Action ${action} performed on ${id}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    admin_get_products,
    admin_get_allProducts,
    admin_addProduct,
    admin_updateProduct,
    admin_toggleStock,
    admin_deleteProduct,
    admin_get_dashboard,
    admin_get_homeManagement,
    admin_get_users,
    admin_getCoachList,
    admin_getAddCoachPage,
    admin_addCoach,
    admin_getEditCoachPage,
    admin_updateCoach,
    admin_deleteCoach,
    getAdminAllTournaments,
    addTournament,
    updateTournament,
    deleteTournament,
    apiProcessApproval
};

