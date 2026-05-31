const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/tournamentController'); // Your user-facing controller

// --- PUBLIC ROUTES (Client Only) ---

// Retrieves a list of all open tournaments
router.get('/', userCtrl.getAllTournaments);

// Retrieves details for a specific tournament by ID
router.get('/:id', userCtrl.getTournamentById);

// Handles team registration for a tournament
router.post('/register', userCtrl.handleTeamRegistration);

module.exports = router;