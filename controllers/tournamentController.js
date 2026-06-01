// tournamentController.js (User-Facing Functions + Admin Tournament Logic)
const Tournament = require('../models/tournamentSchema');
const Registration = require('../models/registrationSchema');

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
        const { teamName, captainName, tournamentId, userId } = req.body;
        
        const registration = new Registration({
            userId,
            tournamentId,
            teamName,
            captainName
        });
        
        await registration.save();
        res.status(200).json({ success: true, message: "Registration submitted successfully!" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// --- ADMIN MANAGEMENT FUNCTIONS (Appended for your Dashboard) ---

exports.getAdminAllTournaments = async (req, res) => {
    try {
        const tournaments = await Tournament.find().sort({ createdAt: -1 });
        res.render('AdminPage/manage-tournaments', { tournaments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addTournament = async (req, res) => {
    try {
        const { name, type, status } = req.body;
        const tournament = new Tournament({ name, type, status });
        await tournament.save();
        res.status(201).json({ success: true, message: 'Tournament created successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateTournament = async (req, res) => {
    try {
        const { name, status, type } = req.body;
        const tournament = await Tournament.findByIdAndUpdate(
            req.params.id, 
            { name, status, type }, 
            { new: true }
        );
        res.json({ success: true, tournament });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteTournament = async (req, res) => {
    try {
        await Tournament.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Tournament deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};