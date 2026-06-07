const express = require('express');
const router = express.Router();
const tournamentController = require('../controllers/tournamentController');
const TournamentRegistration = require('../models/registrationSchema');

router.get('/tournaments', tournamentController.getAllTournaments);
router.get('/matches', async (req, res) => {
    try {
       const Tournament = require('../models/tournamentSchema');
        const Registration = require('../models/registrationSchema');
        
        let tournaments = await Tournament.find().sort({ createdAt: -1 });
        let registrations = await Registration.find({ status: 'APPROVED' }).sort({ createdAt: 1 });
        
        if (!tournaments || tournaments.length === 0) {
            tournaments = [];
        }
        if (!registrations) {
            registrations = [];
        }
        
        res.render('pages/Matches', { tournaments, registrations });
    } catch (error) {
        res.render('pages/Matches', { tournaments: [], registrations: [] });
    }
});
router.get('/', (req, res) => {
    res.redirect('/tournaments');
});
router.post('/tournaments', tournamentController.handleTeamRegistration);
router.get('/leaderboard', async (req, res) => {
    try {
        const teams = await TournamentRegistration.find({ status: 'APPROVED' }).sort({ points: -1 });
        if (!teams || teams.length === 0) {
            const sample = [
                { teamName: 'Smash Kings', points: 1500 },
                { teamName: 'Net Ninjas', points: 1250 },
                { teamName: 'Padel Pros', points: 900 }
            ];
            return res.render('pages/leaderboard', { teams: sample });
        }
        res.render('pages/leaderboard', { teams });
    } catch (err) {
        const sample = [
            { teamName: 'Smash Kings', points: 1500 },
            { teamName: 'Net Ninjas', points: 1250 },
            { teamName: 'Padel Pros', points: 900 }
        ];
        res.render('pages/leaderboard', { teams: sample });
    }
});

module.exports = router;
