const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const getLogin = (req, res) => {
    res.render("pages/login");
};

const getSignup = (req, res) => {
    res.render("pages/signup");
};



const signupUser = async (req, res) => {
    try {

        const { username, phone, password } = req.body;

        const existingUser = await User.findOne({ phone });

        if (existingUser) {
            return res.status(400).send("Phone number already exists");
        }

       const hashedPassword = await bcrypt.hash(password, 10);

   const newUser = new User({
    username,
    phone,
    password: hashedPassword,
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



const loginUser = async (req, res) => {
    try {

        const { phone, password } = req.body;

       const user = await User.findOne({ phone });

if (!user) {
    return res.status(400).send("Invalid phone or password");
}

const validPassword =
    await bcrypt.compare(password, user.password);

if (!validPassword) {
    return res.status(400).send("Invalid phone or password");
}

        if (!user) {
            return res.status(400).send("Invalid phone or password");
        }

        if (!user.isVerified) {
            return res.status(400).send("Please verify your account first");
        }

        req.session.user = {
            id: user._id,
            username: user.username,
            role: user.role
        };

        if (user.role === "admin") {
            return res.redirect("/admin/dashboard");
        }

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
   
    signupUser,
   
    loginUser,
    logoutUser
};