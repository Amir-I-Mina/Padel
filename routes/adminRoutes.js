const { isAdmin } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

router.get("/dashboard", adminController.admin_get_dashboard);

router.get("/home-management", adminController.admin_get_homeManagement);

router.get("/users", adminController.admin_get_users);


module.exports = router;