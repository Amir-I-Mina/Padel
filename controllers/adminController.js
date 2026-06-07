const Coach = require("../models/CoachModels");
const Product = require('../models/ProductSchema');
const Tournament = require('../models/tournamentSchema');
const Booking = require('../models/courtBooking');




const admin_get_dashboard = (req, res) => {
    res.render("admin/dashboard");
};

const admin_get_homeManagement = (req, res) => {
    res.render("admin/homeManagement");
};

const admin_get_users = (req, res) => {
    res.render("admin/users");
};




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



const admin_getCoachListpage = async (req, res) => {
    try {
        const coaches = await Coach.find();
        res.render("pages/academy/listOfCoaches", { coaches });
    } catch (err) {
        console.error("Error rendering coach list page:", err);
        res.status(500).send("Error loading page");
    }
};

const admin_getCoaches = async (req, res) => {
    try {
        const coaches = await Coach.find();

        // ✅ Validation: check if we got data
        if (!coaches || coaches.length === 0) {
            return res.json({ success: false, message: "No coaches found" });
        }

        res.json({ success: true, coaches });
    } catch (err) {
        console.error("Error fetching coaches:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const admin_getManageCoaches = async (req, res) => {
    try {
        const coaches = await Coach.find();

        // Render the Manage Coaches EJS page
        res.render("pages/academy/ManageCoaches", { coaches });
    } catch (err) {
        // Render an error page if something goes wrong
        res.status(500).render("error", { error: err.message });
    }
};



const admin_getCoachById = async (req, res) => {
    try {

        const coach = await Coach.findById(req.params.id);

        if (!coach) {

            return res.status(404).json({
                success: false,
                message: "Coach not found"
            });
        }

        res.status(200).json({
            success: true,
            coach
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};



const admin_addCoach = async (req, res) => {
    try {

        const coach = await Coach.create(req.body);

        res.status(201).json({
            success: true,
            coach
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};


const admin_updateCoach = async (req, res) => {
    try {

        const coach = await Coach.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!coach) {

            return res.status(404).json({
                success: false,
                message: "Coach not found"
            });
        }

        res.status(200).json({
            success: true,
            coach
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};


const admin_deleteCoach = async (req, res) => {
    try {

        const coach = await Coach.findByIdAndDelete(req.params.id);

        if (!coach) {

            return res.status(404).json({
                success: false,
                message: "Coach not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Coach deleted successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// ======================================
// Tournament & Registration Admin
// ======================================

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

exports.addTournament = async (req, res) => {
    try {
        const { name, type, status } = req.body;
        const tournament = new Tournament({ name, type, status });
        await tournament.save();
        res.status(201).json({ success: true, message: 'Tournament created successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateTournament = async (req, res) => {
    try {
        const { name, status, type } = req.body;
        const tournament = await Tournament.findByIdAndUpdate(
            req.params.id, 
            { name, status, type }, 
            { new: true }
        );
        res.json({ success: true, tournament });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteTournament = async (req, res) => {
    try {
        await Tournament.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Tournament deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// MODERATION: Approve or Reject
exports.apiProcessApproval = async (req, res) => {
    try {
        const { id, action } = req.body; // action: 'APPROVED' or 'REJECTED'
        await Registration.findByIdAndUpdate(id, { status: action });
        res.status(200).json({ success: true, message: `Registration ${action}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//  bookings admin
let clubs = [
    { id: 1, name: 'Shams Club', price: 450 },
    { id: 2, name: 'Wadi Degla', price: 450 },
    { id: 3, name: 'HPark', price: 450 },
    { id: 4, name: 'Cairo Stadium', price: 450 },
    { id: 5, name: 'Smash Club', price: 450 }
];

let disabledSlots = [];

let promoCodes = [
    { id: 1, code: 'DISCOUNT10', discount: 10 },
    { id: 2, code: 'SUMMER20', discount: 20 }
];

let settings = { defaultPrice: 450 };




const getMapUrl = (clubName) => {
    const maps = {
        'Shams Club': 'https://maps.google.com/maps?q=Shams%20Club%20Cairo&t=&z=15&output=embed',
        'Wadi Degla': 'https://maps.google.com/maps?q=Wadi%20Degla%20Club%20Cairo&t=&z=15&output=embed',
        'HPark': 'https://maps.google.com/maps?q=HPark%20Cairo&t=&z=15&output=embed',
        'Cairo Stadium': 'https://maps.google.com/maps?q=Cairo%20International%20Stadium&t=&z=15&output=embed',
        'Smash Club': 'https://maps.google.com/maps?q=Smash%20Sporting%20Club%20Cairo&t=&z=15&output=embed'
    };
    return maps[clubName] || 'https://maps.google.com/maps?q=Cairo&t=&z=15&output=embed';
};




const getClubsPage = async (req, res) => {
    res.render('clubs', { clubs, currentPage: 'clubs' });
};

const selectClub = async (req, res) => {
    const { clubName } = req.body;

    if (!clubName) {
        return res.render('clubs', {
            clubs,
            error: 'Please select a club',
            currentPage: 'clubs'
        });
    }

    req.session.selectedClub = clubName;

    res.render('booking', {
        club: clubName,
        mapUrl: getMapUrl(clubName),
        currentPage: 'booking'
    });
};

const getBookingPage = async (req, res) => {
    const club = req.session.selectedClub;
    if (!club) return res.redirect('/clubs');

    res.render('booking', { club, currentPage: 'booking' });
};

const getCheckoutPage = async (req, res) => {
    const booking = req.session.currentBooking;
    if (!booking) return res.redirect('/clubs');

    res.render('checkout', { booking, currentPage: 'checkout' });
};



const getMyBookings = async (req, res) => {
    const customerName = req.session.user?.name || 'Guest';

    const bookings = await Booking.find({ customerName })
        .sort({ createdAt: -1 });

    res.render('myBookings', { bookings, currentPage: 'myBookings' });
};



const createBooking = async (req, res) => {
    try {
        const { club, court, date, time, paymentMethod, promoCode, customerName } = req.body;

        const existing = await Booking.findOne({
            club, court, date, time, status: 'confirmed'
        });

        if (existing) {
            return res.status(400).json({ error: 'Time slot already taken' });
        }

        // FIXED: use club price instead of default only
        const selectedClub = clubs.find(c => c.name === club);
        let price = selectedClub ? selectedClub.price : settings.defaultPrice;

        const promo = promoCodes.find(p => p.code === promoCode);

        // FIXED: apply discount ONLY ONCE here
        if (promo) {
            price = price * (1 - promo.discount / 100);
        }

        const booking = new Booking({
            club,
            court,
            date,
            time,
            price: Math.round(price),
            paymentMethod: paymentMethod || 'Cash',
            promoCode: promoCode || '',
            status: 'confirmed',
            customerName: customerName || 'Guest'
        });

        await booking.save();
        req.session.currentBooking = booking;

        res.json({ success: true, booking });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


const confirmBooking = async (req, res) => {
    try {
        const { bookingId, paymentMethod } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.render('error', { message: 'Booking not found' });
        }

        booking.paymentMethod = paymentMethod || booking.paymentMethod;

        await booking.save();

        req.session.currentBooking = null;

        res.render('success', {
            booking,
            finalPrice: booking.price,
            currentPage: 'success'
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
};









const admin_get_allBookings = async (req, res) => {
    try {
        let filter = {};

        if (req.query.status && req.query.status !== 'all') {
            filter.status = req.query.status;
        }

        if (req.query.club && req.query.club !== 'all') {
            filter.club = req.query.club;
        }

        if (req.query.search) {
            filter.$or = [
                { customerName: { $regex: req.query.search, $options: 'i' } },
                { club: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const bookings = await Booking.find(filter).sort({ createdAt: -1 });

        res.json({ success: true, bookings });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};



const admin_updateBooking = async (req, res) => {
    try {
        const updates = {};
        const fields = ['status', 'price', 'paymentMethod', 'promoCode', 'customerName'];

        fields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        );

        res.json({ success: true, booking });

    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
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
    admin_getCoachListpage,
    admin_getCoaches,
    admin_getManageCoaches,
    admin_getCoachById,
    admin_addCoach,
    admin_updateCoach,
    admin_deleteCoach,
   getClubsPage,
    selectClub,
    getBookingPage,
    getCheckoutPage,
    getMyBookings,
    createBooking,
    confirmBooking,
    admin_get_allBookings,
    admin_updateBooking
};

