
const express = require('express');
const router = express.Router();

const homeController = require('../controllers/homeController');



router.get('/home', homeController.getHomePage);

router.get('/courts', homeController.getCourtsPage);

router.get('/tournaments', homeController.getTournamentsPage);

router.get('/matches', homeController.getMatchesPage);

router.get('/academy', homeController.getAcademyPage);


module.exports = router;
