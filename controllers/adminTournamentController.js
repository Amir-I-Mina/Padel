const Tournament = require('../models/tournamentSchema');

// 1. Get ALL tournaments
exports.getAdminAllTournaments = async (req, res) => {
    try {
        const tournaments = await Tournament.find().sort({ createdAt: -1 });
        res.render('AdminPage/manage-tournaments', { 
            tournaments, 
            currentPage: 'tournaments' 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Add a new tournament
exports.addTournament = async (req, res) => {
    try {
        const { name, type, status } = req.body;
        const tournament = new Tournament({ name, type, status });
        await tournament.save();
        res.status(201).json({ success: true, message: 'Tournament created' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 3. Update an existing tournament
exports.updateTournament = async (req, res) => {
    try {
        const { name, status, type } = req.body;
        const tournament = await Tournament.findByIdAndUpdate(
            req.params.id, 
            { name, status, type }, 
            { new: true }
        );
        if (!tournament) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, tournament });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 4. Delete a tournament
exports.deleteTournament = async (req, res) => {
    try {
        const tournament = await Tournament.findByIdAndDelete(req.params.id);
        if (!tournament) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, message: 'Tournament deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 5. Process Team Registrations (Moderation)
exports.apiProcessApproval = async (req, res) => {
    try {
        const { id, action } = req.body;
        res.status(200).json({ success: true, message: `Action ${action} performed on ${id}` });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAdminAllTournaments,
    addTournament,
    updateTournament,
    deleteTournament,
    apiProcessApproval
};