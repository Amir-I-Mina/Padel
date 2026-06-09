const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");

router.get("/courts", bookingController.showClubs);

// Club routes
router.post("/createbooking", bookingController.createBooking);
router.post("/confirm-booking", bookingController.confirmBooking);

module.exports = router;