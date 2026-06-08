const express = require("express");

const router = express.Router();

const authController = require("../controllers/AuthController");

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.get("/forgot-password", authController.getForgotPassword);

router.post("/forgot-password", authController.resetPassword);

router.post("/signup", authController.signupUser);



router.post("/login", authController.loginUser);

router.get("/logout", authController.logoutUser);

module.exports = router;