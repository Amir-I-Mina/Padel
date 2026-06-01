const express = require ('express') ;

const app = express ();

const mongoose = require('mongoose' ) ;

const fileUpload = require('express-fileupload') ;

const path = require ('path') ;

const Coach = require ('./models/CoachModels') ;
const User = require ('./models/UserModel') ;
const BookingAcademy = require ('./models/BookingAcademy') ;
const courts = require('./models/courtsBoking') ;

const dbURI ='mongodb://Padelweb:padel12345@acgk4oui-shard-00-00.dfnd8so.mongodb.net:27017,ac-tgk4oui-shard-00-01.dfnd8so.mongodb.net:27017,ac-tgk4oui-shard-00-02.dfnd8so.mongodb.net:27017/?ssl=true&replicaSet=atlas-57qqm7-shard-0&authSource=admin&appName=PadelWebDatabase'

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