const User = require("../models/UserModel");

const getLogin = (req, res) => {
    res.render("login");
};

const getSignup = (req, res) => {
    res.render("signup");
};

const getOTP = (req, res) => {
    res.render("otp");
};

const signupUser = async (req, res) => {
    try {

        const { username, phone, password } = req.body;

        const existingUser = await User.findOne({ phone });

        if (existingUser) {
            return res.status(400).send("Phone number already exists");
        }

        const newUser = new User({
            username,
            phone,
            password,
            isVerified: false,
            role: "user"
        });

        await newUser.save();

        res.redirect("/otp");

    } catch (error) {

        console.log(error);
        res.status(500).send("Signup failed");

    }
};

const verifyOTP = async (req, res) => {
    try {

        const { phone } = req.body;

        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(404).send("User not found");
        }

        user.isVerified = true;

        await user.save();

        res.redirect("/login");

    } catch (error) {

        console.log(error);
        res.status(500).send("OTP verification failed");

    }
};

const loginUser = async (req, res) => {
    try {

        const { phone, password } = req.body;

        const user = await User.findOne({
            phone,
            password
        });

        if (!user) {
            return res.status(400).send("Invalid phone or password");
        }

        if (!user.isVerified) {
            return res.status(400).send("Please verify your account first");
        }

        if (user.role === "admin") {
            return res.redirect("/admin/dashboard");
        }
        req.session.user = {
     id: user._id,
     role: user.role,
     username: user.username
};

        res.redirect("/home");

    } catch (error) {

        console.log(error);
        res.status(500).send("Login failed");

    }
};

const logoutUser = (req, res) => {

    req.session.destroy((err) => {

        if (err) {
            return res.status(500).send("Logout failed");
        }

        res.redirect("/login");
    });
};

module.exports = {
    getLogin,
    getSignup,
    getOTP,
    signupUser,
    verifyOTP,
    loginUser,
    logoutUser
};