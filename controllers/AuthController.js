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

  const profilePicture = req.file
    ? "/uploads/" + req.file.filename
    : "/images/default-user.png";

const newUser = new User({
    username,
    phone,
    password: hashedPassword,
    profilePicture,
    isVerified: true,
    role: "user"
});

        await newUser.save();

        res.redirect("/login");

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

        res.redirect("/home");
    });

};
const getForgotPassword = (req, res) => {
    res.render("pages/forgotPassword");
};

const resetPassword = async (req, res) => {
    try {

        const { phone, password } = req.body;

        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(400).send("Phone number not found");
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        user.password = hashedPassword;

        await user.save();

        res.redirect("/login");

    } catch (error) {

        console.log(error);
        res.status(500).send("Password reset failed");
    }
};

module.exports = {
    getLogin,
    getSignup,
    getForgotPassword,
    resetPassword,
    signupUser,
    loginUser,
    logoutUser
};