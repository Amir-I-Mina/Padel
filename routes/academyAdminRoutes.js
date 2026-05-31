const express = require("express");
const router = express.Router();

const academyAdminController =
    require("../controllers/academyAdminController");


router.get("/coach-list",academyAdminController.admin_getCoachList);

router.get("/manage-coaches",academyAdminController.admin_getManageCoaches);

router.post("/add-coach",academyAdminController.admin_addCoach);

router.post("/update-coach/:id",academyAdminController.admin_updateCoach);

router.post("/delete-coach/:id",academyAdminController.admin_deleteCoach);

module.exports = router;