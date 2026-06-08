const bcrypt = require("bcrypt");
const isLoggedIn = (req, res, next) => {

    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "You must be logged in"
        });
    }

    next();
};
const isAdmin = (req, res, next) => {

    if (!req.session.user ||
        req.session.user.role !== "admin") {

        return res.status(403).json({
            success: false,
            message: "Admin only access"
        });
    }

    next();
};

   module.exports = {
     isLoggedIn,
    isAdmin
    };