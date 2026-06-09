const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

router.get("/products", adminController.admin_get_products);
router.get("/products/all", adminController.admin_get_allProducts);
router.post("/products/add", adminController.admin_addProduct);
router.post("/products/update/:id", adminController.admin_updateProduct);
router.post("/products/toggle-stock/:id", adminController.admin_toggleStock);
router.post("/products/delete/:id", adminController.admin_deleteProduct);

module.exports = router;