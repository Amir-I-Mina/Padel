// tournamentController.js (User-Facing Functions)
const Tournament = require('../models/tournamentSchema');

// 1. Get all OPEN tournaments (Public landing/list page)
exports.getAllTournaments = async (req, res) => {
    try {
        const { search } = req.query;
        // Only show tournaments that are currently OPEN
        let query = { status: "OPEN" };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { type: { $regex: search, $options: 'i' } }
            ];
        }

        const tournaments = await Tournament.find(query).sort({ createdAt: -1 });
        
        // This renders the public-facing view
        res.render('tournaments', { tournaments, cssFile: 'tournament.css' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. View details of a specific tournament
exports.getTournamentById = async (req, res) => {
    try {
        const tournament = await Tournament.findById(req.params.id);
        if (!tournament) {
            return res.status(404).json({ success: false, message: 'Tournament not found' });
        }
        res.render('tournament_details', { tournament });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Handle Team Registration (User submits a form)
exports.handleTeamRegistration = async (req, res) => {
    try {
        // Logic to save a registration request (pending admin approval)
        const { teamName, player1, player2, tournamentId } = req.body;
        
        // Add your logic to save to a Registration model here
        res.status(200).json({ success: true, message: "Registration submitted successfully!" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};