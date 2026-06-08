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
    
    // ✅ Use the session user’s _id
    const bookings = await Booking.find({
      userId: req.session.user._id
    }).populate("coachId", "name phone");

    // ✅ Render dashboard with user’s bookings
    res.render("pages/academy/UserDashboard", { bookings });

  } catch (err) {
    console.error("Dashboard error:", err);
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

    // ✅ Create booking tied to session user
    const booking = await Booking.create({
      userId: req.session.user._id,   // use logged-in user
      coachId: coach._id,
      coachName: coach.name,
      trainingType: normalizedType,
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
      return res.status(404).send("Coach not found");
    }

    // Pass coach and type into the EJS template
    res.render("pages/academy/paymentAcademy", {
      coach,
      type: Array.isArray(coach.trainingType) ? coach.trainingType[0] : coach.trainingType
    });
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
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
  
};