const express = require("express");

const router = express.Router();

const authController = require("../controllers/AuthController");

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.get("/otp", authController.getOTP);

router.post("/signup", authController.signupUser);

router.post("/otp", authController.verifyOTP);

router.post("/login", authController.loginUser);

router.get("/logout", authController.logoutUser);

module.exports = router;