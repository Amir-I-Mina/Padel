const express = require('express');
const app = express();
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const path = require('path');

const Coach = require('./models/CoachModels');
const User = require('./models/UserModel');
const BookingAcademy = require('./models/BookingAcademy');
const courts = require('./models/courtsBoking');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const productRoutes = require('./routes/productRoutes');
app.use('/products', productRoutes);

const adminRoutes = require('./routes/adminRoutes');
app.use('/admin', adminRoutes);

const dbURI = 'mongodb://Padelweb:padel12345@...';

const orderRoutes = require('./routes/orderRoutes');
app.use('/orders', orderRoutes);

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