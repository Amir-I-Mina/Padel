const Court = require('../models/courtBooking');
const Tournament = require('../models/tournamentSchema');




const getHomePage = async (req, res) => {

    try {

       
        const featuredCourts = await Court.find({ available: true })
            .limit(4);

       
        const tournaments = await Tournament.find()
            .sort({ createdAt: -1 })
            .limit(3);

        
   res.render('pages/home', {
    featuredCourts,
    tournaments,
    user: req.session.user
});

    } catch (err) {

        console.log(err);

   res.render('pages/home', {
    featuredCourts: [],
    tournaments: [],
    user: req.session.user
});

    }
};




const getCourtsPage = async (req, res) => {

    try {

        const courts = await Court.find();

        res.render('pages/courts', { courts });

    } catch (err) {

        console.log(err);
        res.status(500).send('Error loading courts');

    }
};




const getCourtDetails = async (req, res) => {

    try {

        const court = await Court.findById(req.params.id);

        if (!court) {
            return res.status(404).send('Court not found');
        }

        res.render('pages/court-details', { court });

    } catch (err) {

        console.log(err);
        res.status(500).send('Error loading court details');

    }
};




const getTournamentsPage = async (req, res) => {

    try {

        const tournaments = await Tournament.find();

        res.render('pages/tournaments', { tournaments });

    } catch (err) {

        console.log(err);
        res.status(500).send('Error loading tournaments');

    }
};




const getMatchesPage = (req, res) => {

    res.render('pages/Matches');

};




const getAcademyPage = (req, res) => {

    res.render('pages/academy/academy');

};




module.exports = {

    getHomePage,
    getCourtsPage,
    getCourtDetails,
    getTournamentsPage,
    getMatchesPage,
    getAcademyPage

};