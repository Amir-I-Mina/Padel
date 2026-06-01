const express = require("express");
const router = express.Router();

const academyAdminController =
    require("../controllers/academyAdminController");


// GET ALL COACHES (Coach Listing)
router.get(
    "/coaches",
    academyAdminController.admin_getCoachList
);


// GET DATA FOR MANAGE COACHES PAGE
router.get(
    "/manage-coaches",
    academyAdminController.admin_getManageCoaches
);


// GET ONE COACH
router.get(
    "/coaches/:id",
    academyAdminController.admin_getCoachById
);


// ADD COACH
router.post(
    "/coaches",
    academyAdminController.admin_addCoach
);


// UPDATE COACH
router.put(
    "/coaches/:id",
    academyAdminController.admin_updateCoach
);


// DELETE COACH
router.delete(
    "/coaches/:id",
    academyAdminController.admin_deleteCoach
);

module.exports = router;