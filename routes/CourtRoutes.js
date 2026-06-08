const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");


router.post("/select-club", bookingController.selectClub);


router.get("/booking", bookingController.getBookingPage);


router.post("/booking", bookingController.createBooking);


router.get("/checkout", bookingController.getCheckoutPage);


router.post("/confirm-booking", bookingController.confirmBooking);

module.exports = router;