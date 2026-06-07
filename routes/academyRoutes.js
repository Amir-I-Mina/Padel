const express = require("express");
const router = express.Router();

const academyController = require("../controllers/academyController");
const {isLoggedIn} = require("../middleware/authMiddleware");


// GET DATA
router.get(
    "/private-training",
    academyController.user_getPrivateTrainingPage
);

router.get(
    "/group-training",
    academyController.user_getGroupTrainingPage
);

router.get(
    "/dashboard",
    academyController.user_getDashboard
);


// FIND COACHES
router.post(
    "/private-coaches",
    academyController.user_findPrivateCoaches
);

router.post(
    "/group-coaches",
    academyController.user_findGroupCoaches
);


// BOOKINGS
router.post(
    "/bookings",
    isLoggedIn,
    academyController.user_bookTraining
);

router.delete(
    "/bookings/:id",
    isLoggedIn,
    academyController.user_cancelBooking
);

module.exports = router;