const Coach = require("../models/CoachModels");
const Booking = require("../models/BookingAcademy");


// ======================================
// GET PRIVATE TRAINING PAGE DATA
// ======================================

const user_getPrivateTrainingPage = async (req, res) => {
    try {
        // Render the EJS page for private training
        res.render("pages/academy/PrivateTraining", {
            trainingType: "private"
        });
    } catch (err) {
        res.status(500).render("error", {
            error: err.message
        });
    }
};



// ======================================
// GET GROUP TRAINING PAGE DATA
// ======================================

const user_getGroupTrainingPage = async (req, res) => {
    try {

        res.render("pages/academy/GroupTraining", {
            trainingType: "group"
        });
        

    } catch (err) {

        res.status(500).render("error", {
            error: err.message
        });
        
    }
};


// ======================================
// GET USER DASHBOARD
// ======================================

const user_getUserDashboard = async (req, res) => {
    try {
        
        const bookings = await Booking.find({
            userId: "6a25bc7c1c87f19f94201020"
        }).populate("coachId");

        res.render("pages/academy/UserDashboard", { bookings });
    } catch (err) {
        
        res.status(500).json({ 
            success: false, 
            message: err.message 
        });
    }
};



// ======================================
// FIND PRIVATE COACHES
// ======================================

const user_findPrivateCoaches = async (req, res) => {
    try {
        const { location, day, time } = req.body;

        const coaches = await Coach.find({
            location,
            availableDays: day,
            availableTimes: time,
            trainingType: "private"
        });

        // Render the EJS page and inject the coaches data
        res.render("pages/academy/DisplayCoaches", { coaches, location, day, time });
    } catch (err) {
        res.status(500).render("error", { error: err.message });
    }
};


// ======================================
// FIND GROUP COACHES
// ======================================

const user_findGroupCoaches = async (req, res) => {
    try {
        const { location, day, time } = req.body;

        const coaches = await Coach.find({
            location,
            availableDays: day,
            availableTimes: time,
            trainingType: "group"
        });

        // Render the EJS page and inject the coaches data
        res.render("pages/academy/DisplayCoaches", { coaches, location, day, time });
    } catch (err) {
        res.status(500).render("error", { error: err.message });
    }
};


// ======================================
// BOOK TRAINING
// ======================================

const user_bookTraining = async (req, res) => {
    try {
        const { coachId } = req.body;

        // Find the coach by ID
        const coach = await Coach.findById(coachId);
        if (!coach) {
            return res.status(404).json({ error: "Coach not found" });
        }
         // Normalize trainingType to always be a string
    
         let normalizedType = Array.isArray(coach.trainingType)
            ? coach.trainingType[0]   // take the first value
            : coach.trainingType;

        // Enforce only "private" or "group"
        if (!["private", "group"].includes(normalizedType)) {
            return res.status(400).json({ error: "Invalid training type in coach record" });
        }

        // Use coach's own data for day, time, location
        const booking = await Booking.create({
             userId: "6a25bc7c1c87f19f94201020", // test userId
            coachId: coach._id,
            trainingType: normalizedType, // required field
            day: Array.isArray(coach.availableDays) 
                 ? coach.availableDays.join(", ") 
                 : coach.availableDays,
            time: Array.isArray(coach.availableTimes) 
                  ? coach.availableTimes.join(", ") 
                  : coach.availableTimes,
            location: coach.location
        });

        res.status(201).json({ success: true, booking });
    } catch (err) {
        console.error("Booking error:", err);
        res.status(500).json({ error: err.message });
    }
};



// ======================================
// CANCEL BOOKING
// ======================================

const user_cancelBooking = async (req, res) => {
    try {

        const booking = await Booking.findByIdAndDelete(req.params.id);

        if (!booking) {

            return res.status(404).json({
                error: "Booking not found"
            });
        }

        res.json({
            success: true,
            message: "Booking cancelled successfully"
        });

    } catch (err) {

        res.status(500).json({
            error: err.message
        });
    }
};
const user_showPaymentPage = async (req, res) => {
  try {
    const { coachId } = req.body;
    const coach = await Coach.findById(coachId);

    if (!coach) {
      return res.status(404).render("error", { error: "Coach not found" });
    }

    // Normalize training type
    let normalizedType = Array.isArray(coach.trainingType)
      ? coach.trainingType[0]
      : coach.trainingType;

    // Decide price
    const amount = normalizedType === "private" ? 6000 : 3000;

    // Store booking data temporarily in session
    req.session.bookingData = {
      userId: "6a25bc7c1c87f19f94201020", // test user
      coachId: coach._id,
      trainingType: normalizedType,
      day: coach.availableDays,
      time: coach.availableTimes,
      location: coach.location,
      amount
    };

    // Render payment page
    res.render("pages/academy/paymentAcademy", { type: normalizedType, amount });
  } catch (err) {
    res.status(500).render("error", { error: err.message });
  }
};

// Process payment
const user_processPayment = async (req, res) => {
  try {
    const { cardNumber, expiry, cvv } = req.body;

    // Dummy validation (replace with Stripe/PayPal later)
    if (cardNumber.length !== 16) {
      return res.status(400).json({ success: false, message: "Invalid card number" });
    }

    // Retrieve booking data stored in session
    const bookingData = req.session.bookingData;
    if (!bookingData) {
      return res.status(400).json({ success: false, message: "No booking data found" });
    }

    // Save booking in DB after payment success
    const booking = await Booking.create({
      bookingData,
      status: "confirmed"
    });

    // Clear session
    req.session.bookingData = null;

    // Respond with success JSON
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


module.exports = {
    user_getPrivateTrainingPage,
    user_getGroupTrainingPage,
    user_getUserDashboard,
    user_findPrivateCoaches,
    user_findGroupCoaches,
    user_bookTraining,
    user_cancelBooking,
    user_showPaymentPage,
    user_processPayment
};