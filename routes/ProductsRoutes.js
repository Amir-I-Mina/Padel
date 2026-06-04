const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

router.get("/store", productController.getStorePage);
router.get("/checkout", productController.getCheckoutPage);

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

module.exports = router;