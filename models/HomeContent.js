const mongoose = require("mongoose");

const homeContentSchema = new mongoose.Schema({
    title: String,
    subtitle: String,
    announcement: String
});


module.exports = mongoose.model(
    "HomeContent",
    homeContentSchema
);