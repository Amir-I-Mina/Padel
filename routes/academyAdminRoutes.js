const express = require("express");
const router = express.Router();

const academyAdminController =
    require("../controllers/adminController");

    //const { isLoggedIn, isAdmin } =
//require("../middleware/authMiddleware");


// GET ALL COACHES (Coach Listing)
router.get(
    "/coaches-page",
    //isAdmin,
    academyAdminController.admin_getCoachListpage
);


router.get("/coaches-list", academyAdminController.admin_getCoaches);


// GET DATA FOR MANAGE COACHES PAGE
router.get(
    "/manage-coaches",
    //isAdmin,
    academyAdminController.admin_getManageCoaches
);


// GET ONE COACH
router.get(
    "/coaches/:id",
    //isAdmin,
    academyAdminController.admin_getCoachById
);


// ADD COACH
router.post(
    "/Add-coaches",
   // isAdmin,
    academyAdminController.admin_addCoach
);


// UPDATE COACH
router.put(
    "/editcoaches/:id",
    //isAdmin,
    academyAdminController.admin_updateCoach
);


// DELETE COACH
router.delete(
    "/delete-coach/:id",
    //isAdmin,
    academyAdminController.admin_deleteCoach
);

module.exports = router;