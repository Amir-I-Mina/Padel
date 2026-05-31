const Coach = require("../models/CoachModels");
const Booking = require("../models/BookingAcademy");


// ======================================
// GET PRIVATE TRAINING PAGE
// ======================================

const user_getPrivateTrainingPage = async (req, res) => {

    try {

        res.render("academy/privateTraining");

    } catch (err) {

        console.log(err);

        res.status(500).send("Error loading private training page");
    }
};


// ======================================
// GET GROUP TRAINING PAGE
// ======================================

const user_getGroupTrainingPage = async (req, res) => {

    try {

        res.render("academy/groupTraining");

    } catch (err) {

        console.log(err);

        res.status(500).send("Error loading group training page");
    }
};


// ======================================
// GET USER DASHBOARD
// ======================================

const user_getDashboard = async (req, res) => {

    try {

        const userId = req.session.user._id;

        const bookings = await Booking.find({
            userId: userId
        }).populate("coachId");

        res.render("academy/dashboard", {
            bookings
        });

    } catch (err) {

        console.log(err);

        res.status(500).send("Error loading dashboard");
    }
};


// ======================================
// FIND PRIVATE COACHES
// ======================================

const user_findPrivateCoaches = async (req, res) => {

    try {

        const {
            location,
            day,
            time
        } = req.body;

        const coaches = await Coach.find({

            location: location,
            availableDays: day,
            availableTimes: time,
            trainingType: "private"

        });

        res.render("academy/availableCoaches", {
            coaches
        });

    } catch (err) {

        console.log(err);

        res.status(500).send("Error finding private coaches");
    }
};


// ======================================
// FIND GROUP COACHES
// ======================================

const user_findGroupCoaches = async (req, res) => {

    try {

        const {
            location,
            day,
            time
        } = req.body;

        const coaches = await Coach.find({

            location: location,
            availableDays: day,
            availableTimes: time,
            trainingType: "group"

        });

        res.render("academy/availableCoaches", {
            coaches
        });

    } catch (err) {

        console.log(err);

        res.status(500).send("Error finding group coaches");
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

        const userId = req.session.user._id;

        const newBooking = new Booking({

            userId,
            coachId,
            trainingType,
            day,
            time,
            location

        });

        await newBooking.save();

        res.redirect("/academy/dashboard");

    } catch (err) {

        console.log(err);

        res.status(500).send("Error booking training");
    }
};


// ======================================
// CANCEL BOOKING
// ======================================

const user_cancelBooking = async (req, res) => {

    try {

        const bookingId = req.params.id;

        await Booking.findByIdAndDelete(bookingId);

        res.redirect("/academy/dashboard");

    } catch (err) {

        console.log(err);

        res.status(500).send("Error canceling booking");
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