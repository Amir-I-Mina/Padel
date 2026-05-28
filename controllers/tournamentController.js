// Replace with your actual Tournament Model
const Tournament = require('../models/tournamentSchema'); 

// 1. Get all tournaments (e.g., for the public view)
exports.getAllTournaments = async (req, res) => {
    try {
        const { search } = req.query;
        let query = { status: "OPEN" }; // Only showing open ones for players

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { type: { $regex: search, $options: 'i' } }
            ];
        }

        const tournaments = await Tournament.find(query).sort({ createdAt: -1 });
        res.json({ success: true, tournaments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Admin: Get ALL tournaments (including closed ones)
exports.getAdminAllTournaments = async (req, res) => {
    try {
        const tournaments = await Tournament.find().sort({ createdAt: -1 });
        res.json({ success: true, tournaments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Admin: Render Management Page
exports.manage_get_tournaments = async (req, res) => {
    try {
        const tournaments = await Tournament.find().sort({ createdAt: -1 });
        res.render('AdminPage/manage-tournaments', { tournaments, currentPage: 'tournaments' });
    } catch (err) {
        res.status(500).send('Error loading tournament dashboard');
    }
};

// 4. Admin: Create a new tournament
exports.addTournament = async (req, res) => {
    try {
        const { name, type, status } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Tournament name required' });

        const tournament = new Tournament({
            name,
            type: type || 'doubles',
            status: status || 'OPEN'
        });

        await tournament.save();
        res.status(201).json({ success: true, tournament });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 5. Admin: Update Tournament
exports.updateTournament = async (req, res) => {
    try {
        const { name, status } = req.body;
        const tournament = await Tournament.findByIdAndUpdate(
            req.params.id, 
            { name, status }, 
            { new: true }
        );
        if (!tournament) return res.status(404).json({ success: false, message: 'Not found' });
        
        res.json({ success: true, tournament });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 6. Admin: Delete Tournament
exports.deleteTournament = async (req, res) => {
    try {
        const tournament = await Tournament.findByIdAndDelete(req.params.id);
        if (!tournament) return res.status(404).json({ success: false, message: 'Not found' });
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};