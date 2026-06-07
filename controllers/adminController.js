const Coach = require("../models/CoachModels");
const Product = require('../models/ProductSchema');
const Booking = require('../models/courtBooking');
const Tournament = require('../models/tournamentSchema');   
const Registration = require('../models/registrationSchema'); 
const mongoose = require('mongoose');



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

const sampleTournaments = [
    { id: 'sample-0', name: 'Spring Doubles', type: '2v2', status: 'CLOSED', registrations: 24 },
    { id: 'sample-1', name: 'Net Masters', type: '2v2', status: 'OPEN', registrations: 18 },
    { id: 'sample-2', name: 'Padel Cup', type: '2v2', status: 'OPEN', registrations: 32 }
];

const fallbackTournaments = [...sampleTournaments];

const isMongoReady = () => mongoose.connection.readyState === 1;

const getAdminAllTournaments = async (req, res) => {
    try {
        if (!isMongoReady()) {
            return res.render('tournaments_admin', { tournaments: fallbackTournaments });
        }

        let tournaments = await Tournament.find().sort({ createdAt: -1 });
        if (!tournaments || tournaments.length === 0) {
            tournaments = fallbackTournaments;
        }

        res.render('tournaments_admin', { tournaments });
    } catch (error) {
        res.render('tournaments_admin', { tournaments: fallbackTournaments });
    }
};

const admin_get_approvals = async (req, res) => {
    try {
        if (!isMongoReady()) {
            return res.render('approvals', { registrations: [] });
        }

        let registrations = await Registration.find({ status: 'PENDING' }).sort({ createdAt: -1 });
        res.render('approvals', { registrations });
    } catch (error) {
        res.render('approvals', { registrations: [] });
    }
};

const admin_get_treeEditor = async (req, res) => {
    try {
        if (!isMongoReady()) {
            return res.render('tree_editor', { registrations: [], approvedTeams: [] });
        }

        // Only show APPROVED teams in the bracket
        let registrations = await Registration.find({ status: 'APPROVED' }).sort({ createdAt: 1 });
        let approvedTeams = await Registration.find({ status: 'APPROVED' });
        res.render('tree_editor', { registrations, approvedTeams });
    } catch (error) {
        res.render('tree_editor', { registrations: [], approvedTeams: [] });
    }
};

const addTournament = async (req, res) => {
    try {
        const { name, type, status } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: 'Tournament name is required.' });
        }

        if (!isMongoReady()) {
            const newTournament = {
                id: `new-${Date.now()}`,
                name,
                type: type || '2v2',
                status: status || 'OPEN',
                registrations: 0
            };
            fallbackTournaments.push(newTournament);
            return res.status(201).json({ success: true, message: 'Tournament created successfully', tournament: newTournament });
        }

        const tournament = new Tournament({
            name,
            type,
            status: status || 'OPEN'
        });
        await tournament.save();
        res.status(201).json({ success: true, message: 'Tournament created successfully', tournament });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateTournament = async (req, res) => {
    try {
        const { name, status, type } = req.body;
        const id = req.params.id;

        if (!isMongoReady() || typeof id === 'string' && (id.startsWith('sample-') || id.startsWith('new-'))) {
            const tournament = fallbackTournaments.find(t => t.id === id);
            if (!tournament) {
                return res.status(404).json({ success: false, message: 'Tournament not found.' });
            }

            if (name) tournament.name = name;
            if (status) tournament.status = status;
            if (type) tournament.type = type;

            return res.json({ success: true, tournament });
        }

        const tournament = await Tournament.findByIdAndUpdate(
            id,
            { name, status, type },
            { new: true }
        );

        if (!tournament) {
            return res.status(404).json({ success: false, message: 'Tournament not found.' });
        }

        res.json({ success: true, tournament });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const deleteTournament = async (req, res) => {
    try {
        const id = req.params.id;

        if (!isMongoReady() || typeof id === 'string' && (id.startsWith('sample-') || id.startsWith('new-'))) {
            const index = fallbackTournaments.findIndex(t => t.id === id);
            if (index === -1) {
                return res.status(404).json({ success: false, message: 'Tournament not found.' });
            }
            fallbackTournaments.splice(index, 1);
            return res.json({ success: true, message: 'Tournament deleted' });
        }

        await Tournament.findByIdAndDelete(id);
        res.json({ success: true, message: 'Tournament deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
//  bookings admin
const showBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.render('admin/bookings', { bookings });
    } catch (err) {
        console.log(err);
        res.status(500).send('Something went wrong');
    }
};

const getBookings = async (req, res) => {
    try {
        let filter = {};
        
        if (req.query.status && req.query.status !== 'all') {
            filter.status = req.query.status;
        }
        if (req.query.club && req.query.club !== 'all') {
            filter.club = req.query.club;
        }
        if (req.query.startDate && req.query.endDate) {
            filter.date = { $gte: req.query.startDate, $lte: req.query.endDate };
        }
        if (req.query.search) {
            filter.$or = [
                { customerName: { $regex: req.query.search, $options: 'i' } },
                { club: { $regex: req.query.search, $options: 'i' } }
            ];
        }
        
        const bookings = await Booking.find(filter).sort({ createdAt: -1 });
        res.json({ bookings });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

const getBookingDetails = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'No booking found' });
        }
        res.json({ booking });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

const updateBooking = async (req, res) => {
    try {
        const { status, price, paymentMethod, promoCode, customerName } = req.body;
        
        let dataToUpdate = {};
        if (status) dataToUpdate.status = status;
        if (price) dataToUpdate.price = price;
        if (paymentMethod) dataToUpdate.paymentMethod = paymentMethod;
        if (promoCode) dataToUpdate.promoCode = promoCode;
        if (customerName) dataToUpdate.customerName = customerName;
        
        const booking = await Booking.findByIdAndUpdate(req.params.id, dataToUpdate, { new: true });
        res.json({ success: true, booking });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        booking.status = 'cancelled';
        await booking.save();
        res.json({ success: true, msg: 'Booking cancelled' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

const deleteBooking = async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.json({ success: true, msg: 'Deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

const bulkCancelBookings = async (req, res) => {
    try {
        const { ids } = req.body;
        const result = await Booking.updateMany(
            { _id: { $in: ids } },
            { status: 'cancelled' }
        );
        res.json({ success: true, msg: result.modifiedCount + ' bookings cancelled' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

const getStats = async (req, res) => {
    try {
        const total = await Booking.countDocuments();
        const confirmed = await Booking.countDocuments({ status: 'confirmed' });
        const cancelled = await Booking.countDocuments({ status: 'cancelled' });
        
        const today = new Date().toISOString().split('T')[0];
        const todayBookings = await Booking.countDocuments({ date: today });
        
        const revenueData = await Booking.aggregate([
            { $match: { status: 'confirmed' } },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);
        
        const revenue = revenueData[0]?.total || 0;
        
        const byClub = await Booking.aggregate([
            { $group: { _id: '$club', count: { $sum: 1 } } }
        ]);
        
        res.json({
            total,
            confirmed,
            cancelled,
            todayBookings,
            revenue,
            byClub
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

const createBooking = async (req, res) => {
    try {
        const { club, court, date, time, price, paymentMethod, customerName, promoCode } = req.body;
        
        const alreadyBooked = await Booking.findOne({ 
            club, 
            court, 
            date, 
            time, 
            status: 'confirmed' 
        });
        
        if (alreadyBooked) {
            return res.status(400).json({ error: 'This time slot is already taken' });
        }
        
        const newBooking = new Booking({
            club,
            court,
            date,
            time,
            price: price || 450,
            paymentMethod: paymentMethod || 'Cash',
            promoCode: promoCode || '',
            status: 'confirmed',
            customerName: customerName || 'Walk-in Customer'
        });
        
        await newBooking.save();
        res.json({ success: true, booking: newBooking });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err.message });
    }
};

const getAvailableSlots = async (req, res) => {
    try {
        const { club, court, date } = req.query;
        
        
        const bookedSlots = await Booking.find({ 
            club, 
            court, 
            date,
            status: 'confirmed'
        });
        
        const bookedTimes = [];
        for(let i = 0; i < bookedSlots.length; i++) {
            bookedTimes.push(bookedSlots[i].time);
        }
        
        const allSlots = ['10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', 
                          '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM'];
        
        const freeSlots = [];
        for(let i = 0; i < allSlots.length; i++) {
            if(!bookedTimes.includes(allSlots[i])) {
                freeSlots.push(allSlots[i]);
            }
        }
        
        res.json({ availableSlots: freeSlots, bookedTimes: bookedTimes });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

const exportBookings = async (req, res) => {
    try {
        let filter = {};
        if (req.query.status && req.query.status !== 'all') {
            filter.status = req.query.status;
        }
        if (req.query.startDate && req.query.endDate) {
            filter.date = { $gte: req.query.startDate, $lte: req.query.endDate };
        }
        
        const bookings = await Booking.find(filter).sort({ date: -1 });
        
        let csvText = 'ID,Club,Court,Date,Time,Price,Payment,Promo Code,Status,Customer\n';
        
        for(let i = 0; i < bookings.length; i++) {
            const b = bookings[i];
            csvText += b._id + ',' + b.club + ',' + b.court + ',' + b.date + ',' + b.time + ',' + b.price + ',' + b.paymentMethod + ',' + (b.promoCode || '-') + ',' + b.status + ',' + (b.customerName || '-') + '\n';
        }
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=bookings_export.csv');
        res.send(csvText);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
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
    showBookings,
    getBookings,
    getBookingDetails,
    updateBooking,
    cancelBooking,
    deleteBooking,
    bulkCancelBookings,
    getStats,
    createBooking,
    getAvailableSlots,
    exportBookings,
    getAdminAllTournaments,
    admin_get_approvals,
    admin_get_treeEditor,
    addTournament,
    updateTournament,
    deleteTournament
};

