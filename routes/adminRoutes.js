const { isAdmin } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

router.get("/dashboard", isAdmin, adminController.admin_get_dashboard);

router.get("/home-management", isAdmin, adminController.admin_get_homeManagement);

router.get("/users", isAdmin, adminController.admin_get_users);

//router.get("/tree-editor", adminController.admin_get_treeEditor);


module.exports = router;