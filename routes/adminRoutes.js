const { isAdmin } = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const storeController = require("../controllers/StoreController");

router.get("/dashboard", isAdmin, adminController.admin_get_dashboard);
router.get("/home-management", isAdmin, adminController.admin_get_homeManagement);
router.get("/users", isAdmin, adminController.admin_get_users);
router.post("/users/delete/:id", isAdmin, adminController.admin_deleteUser);
router.post("/users/make-admin/:id", isAdmin, adminController.admin_makeAdmin);
router.post("/users/remove-admin/:id", isAdmin, adminController.admin_removeAdmin);
router.get("/academy", isAdmin, adminController.admin_getAcademyMenu);
<<<<<<< Updated upstream
router.post("/home-management",isAdmin,adminController.admin_update_homeManagement);

router.get("/products", isAdmin, adminController.admin_get_products);
=======

router.get("/products", isAdmin, storeController.manage_get_products);
router.get("/products/all", isAdmin, storeController.getAdminAllProducts);
router.post("/products/add", isAdmin, storeController.addProduct);
router.post("/products/update/:id", isAdmin, storeController.updateProduct);
router.post("/products/toggle-stock/:id", isAdmin, storeController.toggleStock);
router.post("/products/delete/:id", isAdmin, storeController.deleteProduct);
>>>>>>> Stashed changes

module.exports = router;