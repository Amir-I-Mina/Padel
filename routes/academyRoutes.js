const express = require("express");
const router = express.Router();

const academyController = require("../controllers/academyController");


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


router.post(
    "/find-private-coaches",
    academyController.user_findPrivateCoaches
);

router.post(
    "/find-group-coaches",
    academyController.user_findGroupCoaches
);


router.post(
    "/book-training",
    academyController.user_bookTraining
);

router.post(
    "/cancel-booking/:id",
    academyController.user_cancelBooking
);

module.exports = router;