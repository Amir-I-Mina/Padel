const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/tournamentController'); // Client-facing functions
const adminCtrl = require('../controllers/adminController');     // Admin-facing functions

// --- PUBLIC ROUTES (Client-Facing) ---
router.get('/', userCtrl.getAllTournaments);
router.get('/:id', userCtrl.getTournamentById);
router.post('/register', userCtrl.handleTeamRegistration);

// --- ADMIN ROUTES (Tournament Management) ---
router.get('/admin/tournaments', adminCtrl.getAdminAllTournaments);
router.post('/admin/tournaments/add', adminCtrl.addTournament);
router.post('/admin/tournaments/update/:id', adminCtrl.updateTournament);
router.post('/admin/tournaments/delete/:id', adminCtrl.deleteTournament);
router.post('/admin/tournaments/approve', adminCtrl.apiProcessApproval);

module.exports = router;