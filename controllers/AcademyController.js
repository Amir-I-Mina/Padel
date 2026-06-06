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

const user_getDashboard = async (req, res) => {
    try {
        const bookings = await Booking.find({
            userId: req.session.user._id
        }).populate("coachId");

        // Render the EJS dashboard view and pass bookings
        res.render("pages/academy/UserDashboard", { bookings });
    } catch (err) {
        res.status(500).render("error", { error: err.message });
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
        res.render("page/academy/DisplayCoaches", { coaches, location, day, time });
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
        res.render("page/academy/DisplayCoaches", { coaches, location, day, time });
    } catch (err) {
        res.status(500).render("error", { error: err.message });
    }
};


// ======================================
// BOOK TRAINING
// ======================================

const user_bookTraining = async (req, res) => {
    try {

        const {
            coachId,
            trainingType,
            day,
            time,
            location
        } = req.body;

        const booking = await Booking.create({
            userId: req.session.user._id,
            coachId,
            trainingType,
            day,
            time,
            location
        });

        res.status(201).json(booking);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });
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


module.exports = {
    user_getPrivateTrainingPage,
    user_getGroupTrainingPage,
    user_getDashboard,
    user_findPrivateCoaches,
    user_findGroupCoaches,
    user_bookTraining,
    user_cancelBooking
};