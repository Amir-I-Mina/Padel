const mongoose = require('mongoose');
const Tournament = require('../models/tournamentSchema');
const Registration = require('../models/registrationSchema');

exports.getAllTournaments = async (req, res) => {
    const sampleTournaments = [
        { name: 'Spring Doubles Cup', type: '2v2', status: 'OPEN', image: '/images/Gemini_Generated_Image_g5b0p8g5b0p8g5b0.png' },
        { name: 'Solo Masters League', type: 'Solo', status: 'OPEN', image: '/images/Gemini_Generated_Image_ohnunohnunohnuno.png' }
    ];

    console.log('GET ALL TOURNAMENTS called; mongoose readyState =', mongoose.connection.readyState);

    try {
        if (mongoose.connection.readyState !== 1) {
            return res.render('pages/tournaments', { tournaments: sampleTournaments, cssFile: 'tournament.css' });
        }

        const { search } = req.query;
        let query = { status: 'OPEN' };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { type: { $regex: search, $options: 'i' } }
            ];
        }

        const tournaments = await Tournament.find(query).sort({ createdAt: -1 });
        res.render('pages/tournaments', { tournaments: tournaments.length ? tournaments : sampleTournaments, cssFile: 'tournament.css' });
    } catch (error) {
        console.error('Tournament load error:', error.message);
        res.render('pages/tournaments', { tournaments: sampleTournaments, cssFile: 'tournament.css' });
    }
};

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

exports.handleTeamRegistration = async (req, res) => {
    try {
         const { teamName } = req.body;
        if (!teamName) {
            return res.redirect('/tournaments');
        }
        const registration = new Registration({ teamName });
        await registration.save();
        res.redirect('/tournaments');
    } catch (error) {
        res.redirect('/tournaments');
    }
};

exports.approvePendingTeams = async (req, res) => {
    try {
        const teamsToApprove = await Registration.find({ status: 'PENDING' }).sort({ _id: 1 }).limit(2);
        const idsToApprove = teamsToApprove.map(team => team._id);

        const result = idsToApprove.length > 0
            ? await Registration.updateMany({ _id: { $in: idsToApprove } }, { status: 'APPROVED' })
            : { modifiedCount: 0 };

        const approvedTeams = await Registration.find({ status: 'APPROVED' });
        return res.json({
            success: true,
            modifiedCount: result.modifiedCount,
            approvedTeams
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.assignPointsToApprovedTeams = async (req, res) => {
    try {
        const approvedTeams = await Registration.find({ status: 'APPROVED' }).sort({ createdAt: 1 });
        const basePoints = [1500, 1200, 900, 600];

        for (let i = 0; i < approvedTeams.length; i++) {
            const extraPoints = Math.max(50, 300 - ((i - basePoints.length) * 50));
            approvedTeams[i].points = basePoints[i] ?? extraPoints;
            await approvedTeams[i].save();
        }

        const sortedTeams = await Registration.find({ status: 'APPROVED' }).sort({ points: -1 });
        return res.json({
            success: true,
            updatedCount: approvedTeams.length,
            teams: sortedTeams
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.clearRegistrations = async (req, res) => {
    try {
        const result = await Registration.deleteMany({});
        return res.json({ success: true, deletedCount: result.deletedCount });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
