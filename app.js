const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const path = require('path');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const Coach = require('./models/CoachModels');
const User = require('./models/UserModel');
const BookingAcademy = require('./models/BookingAcademy');
const courts = require('./models/courtsBoking');



const productRoutes = require('./routes/ProductsRoutes');
app.use('/products', productRoutes);
const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);
const orderRoutes = require('./routes/order');
app.use('/orders', orderRoutes);


const academyRoutes = require("./routes/academyRoutes");
const academyAdminRoutes = require("./routes/academyAdminRoutes");

app.use("/academy", academyRoutes);
app.use("/academy/admin", academyAdminRoutes);





const dbURI = 'mongodb://Padelweb:<db_password>@ac-tgk4oui-shard-00-00.dfnd8so.mongodb.net:27017,ac-tgk4oui-shard-00-01.dfnd8so.mongodb.net:27017,ac-tgk4oui-shard-00-02.dfnd8so.mongodb.net:27017/?ssl=true&replicaSet=atlas-57qqm7-shard-0&authSource=admin&appName=PadelWebDatabase';

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