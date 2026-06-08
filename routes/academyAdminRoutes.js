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



// GET DATA FOR MANAGE COACHES PAGE
router.get(
    "/manage-coaches",
    //isAdmin,
    academyAdminController.admin_getManageCoaches
);



// ADD COACH
router.post(
    "/Add-coaches",
    //isAdmin,
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