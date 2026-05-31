const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

router.get("/dashboard", adminController.admin_get_dashboard);

router.get("/home-management", adminController.admin_get_homeManagement);

router.get("/users", adminController.admin_get_users);

// Tournament Management
router.get("/tournaments", adminController.getAdminAllTournaments);
router.post("/tournaments/add", adminController.addTournament);
router.post("/tournaments/update/:id", adminController.updateTournament);
router.post("/tournaments/delete/:id", adminController.deleteTournament);
router.post("/tournaments/approve", adminController.apiProcessApproval);

module.exports = router;