const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const path = require('path');
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
//app.use(fileUpload());
const session = require("express-session");

app.use(session({
    secret: "academy_secret_key",
    resave: false,
    saveUninitialized: false
}));

const Coach = require('./models/CoachModels');
const User = require('./models/UserModel');
const BookingAcademy = require('./models/BookingAcademy');
const courts = require('./models/courtBooking');


const productRoutes = require('./routes/ProductsRoutes');
app.use('/products', productRoutes);
const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);
const adminProductRoutes = require('./routes/AdminProductRoutes');
app.use('/admin', adminProductRoutes);

const orderRoutes = require('./routes/orders');
app.use('/orders', orderRoutes);
const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);

const tournamentRoutes = require('./routes/tournamentRoutes');
app.use('/', tournamentRoutes);

const homeRoutes = require('./routes/homeRoutes');
app.use('/', homeRoutes);

const academyRoutes = require("./routes/academyRoutes");
const academyAdminRoutes = require("./routes/academyAdminRoutes");

app.use("/academy", academyRoutes);
app.use("/academy/admin", academyAdminRoutes);

const admincourt = require("./routes/admincourt");
const CourtRoutes = require("./routes/CourtRoutes");

app.use("/court", CourtRoutes);
app.use("/court/admin", admincourt)

const dbURI = 'mongodb://Padelweb:padel12345@ac-tgk4oui-shard-00-00.dfnd8so.mongodb.net:27017,ac-tgk4oui-shard-00-01.dfnd8so.mongodb.net:27017,ac-tgk4oui-shard-00-02.dfnd8so.mongodb.net:27017/?ssl=true&replicaSet=atlas-57qqm7-shard-0&authSource=admin&appName=PadelWebDatabase';

mongoose.connect(dbURI)
    .then(async () => {
        console.log('Connected to MongoDB');
        app.listen(8080, () => {
            console.log("Server running");
        });
    })
    .catch(err => {
        console.log(err);
    });