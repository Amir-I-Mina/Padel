const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');


// HOME
router.get('/', homeController.getHomePage);


// COURTS
router.get('/courts', homeController.getCourtsPage);


// SINGLE COURT
router.get('/court/:id', homeController.getCourtDetails);


// TOURNAMENTS
router.get('/tournaments', homeController.getTournamentsPage);


// MATCHES
router.get('/matches', homeController.getMatchesPage);


// ACADEMY
router.get('/academy', homeController.getAcademyPage);


module.exports = router;