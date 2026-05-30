const admin_get_dashboard = (req, res) => {
    res.render("admin/dashboard");
};

const admin_get_homeManagement = (req, res) => {
    res.render("admin/homeManagement");
};

const admin_get_users = (req, res) => {
    res.render("admin/users");
};

module.exports = {
    admin_get_dashboard,
    admin_get_homeManagement,
    admin_get_users
};