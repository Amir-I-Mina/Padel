const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");

router.get("/clubs", bookingController.getClubsPage);
router.post("/select-club", bookingController.selectClub);
router.get("/booking", bookingController.getBookingPage);
router.get("/available-slots", bookingController.getAvailableSlots);
router.post("/create-booking", bookingController.createBooking);
router.get("/checkout", bookingController.getCheckoutPage);
router.post("/confirm-booking", bookingController.confirmBooking);
router.get("/my-bookings", bookingController.getMyBookings);
router.get('/my-bookings', bookingController.getMyBookings); 


module.exports = router;