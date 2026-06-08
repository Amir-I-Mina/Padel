const Coach = require("../models/CoachModels");
const Product = require('../models/ProductSchema');
const Tournament = require('../models/tournamentSchema');
const Registration = require('../models/registrationSchema');
const Bookings = require('../models/courtBooking');




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

////////////////////////////////////
//      academy Admin management   ///
/////////////////////////////////////

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
exports.admin_get_treeEditor = async (req, res) => {
    try {
        const { tournamentId } = req.query;
        let approvedTeams = [];
        let tournament = null;

        if (tournamentId && mongoose.Types.ObjectId.isValid(tournamentId)) {
            tournament = await Tournament.findById(tournamentId);
            approvedTeams = await Registration.find({ status: 'APPROVED', tournamentId }).sort({ createdAt: 1 });
        }

        res.render('pages/tree_editor', { approvedTeams, tournament, tournamentId });
    } catch (error) {
        console.error('Tree editor load error:', error.message);
        res.render('pages/tree_editor', { approvedTeams: [], tournament: null, tournamentId: null });
    }
};

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
const Booking = require("../models/courtBooking");

// In-memory arrays (could later be moved to DB collections)
let clubs = [
  { id: 1, name: "Shams Club", price: 450 },
  { id: 2, name: "Wadi Degla", price: 450 },
  { id: 3, name: "HPark", price: 450 },
  { id: 4, name: "Cairo Stadium", price: 450 },
  { id: 5, name: "Smash Club", price: 450 }
];

let promoCodes = [
  { code: "DISCOUNT10", discount: 10 },
  { code: "SUMMER20", discount: 20 }
];

let settings = { defaultPrice: 450 };

let slots = {
  "Court 1": {},
  "Court 2": {},
  "Court 3": {}
};
const times = ["10 AM","11 AM","12 PM","1 PM","2 PM","3 PM","4 PM","5 PM","6 PM","7 PM","8 PM","9 PM","10 PM"];
for (let c in slots) {
  for (let t of times) slots[c][t] = true;
}

// ========== ADMIN DASHBOARD ==========
const adminDashboard = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.render("admin", {
      clubs,
      promoCodes,
      bookings,
      settings,
      currentPage: "admin"
    });
  } catch (err) {
    res.status(500).send("Error loading admin dashboard");
  }
};

// ========== CLUBS ==========
const addClub = (req, res) => {
  const { name, price } = req.body;
  clubs.push({ id: clubs.length + 1, name, price });
  res.json({ success: true, clubs });
};

const updateClubPrice = (req, res) => {
  const { name, price } = req.body;
  const club = clubs.find(c => c.name === name);
  if (club) club.price = price;
  res.json({ success: true, clubs });
};

const removeClub = (req, res) => {
  const { name } = req.body;
  clubs = clubs.filter(c => c.name !== name);
  res.json({ success: true, clubs });
};

// ========== SLOTS ==========
const disableSlot = (req, res) => {
  const { court, time } = req.body;
  if (slots[court] && slots[court][time] !== undefined) {
    slots[court][time] = false;
    return res.json({ success: true, slots });
  }
  res.status(400).json({ success: false, message: "Invalid slot" });
};

const enableSlot = (req, res) => {
  const { court, time } = req.body;
  if (slots[court] && slots[court][time] !== undefined) {
    slots[court][time] = true;
    return res.json({ success: true, slots });
  }
  res.status(400).json({ success: false, message: "Invalid slot" });
};

const resetCourtSlots = (req, res) => {
  const { court } = req.body;
  if (slots[court]) {
    for (let t of times) slots[court][t] = true;
    return res.json({ success: true, slots });
  }
  res.status(400).json({ success: false, message: "Invalid court" });
};

const resetAllSlots = (req, res) => {
  for (let c in slots) {
    for (let t of times) slots[c][t] = true;
  }
  res.json({ success: true, slots });
};

// ========== PROMOS ==========
const addPromoCode = (req, res) => {
  const { code, discount } = req.body;
  promoCodes.push({ code, discount });
  res.json({ success: true, promoCodes });
};

const removePromoCode = (req, res) => {
  const { code } = req.body;
  promoCodes = promoCodes.filter(p => p.code !== code);
  res.json({ success: true, promoCodes });
};

const updateGlobalRate = (req, res) => {
  const { rate } = req.body;
  settings.defaultPrice = rate;
  res.json({ success: true, settings });
};

// ========== BOOKINGS ==========
const cancelBooking = async (req, res) => {
  try {
    await Booking.findByIdAndUpdate(req.params.id, { status: "cancelled" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const clearAllBookings = async (req, res) => {
  try {
    await Booking.updateMany({}, { status: "cancelled" });
    res.json({ success: true });
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
   adminDashboard,
  addClub,
  updateClubPrice,
  removeClub,
  disableSlot,
  enableSlot,
  resetCourtSlots,
  resetAllSlots,
  addPromoCode,
  removePromoCode,
  updateGlobalRate,
  cancelBooking,
  clearAllBookings
};

