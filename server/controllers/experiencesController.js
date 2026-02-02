const Experience = require('../models/Experience');

// @desc    Get all experiences
// @route   GET /api/v1/experiences
// @access  Public
const getExperiences = async (req, res) => {
    try {
        const { company, role, status } = req.query;
        let query = {};

        if (company) {
            query.company = { $regex: company, $options: 'i' };
        }
        if (role) {
            query.role = { $regex: role, $options: 'i' };
        }
        if (status && status !== 'All') {
            query.offerStatus = status;
        }

        const experiences = await Experience.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: experiences.length,
            data: experiences
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

// @desc    Create new experience
// @route   POST /api/v1/experiences
// @access  Private
const createExperience = async (req, res) => {
    try {
        const experience = await Experience.create(req.body);

        res.status(201).json({
            success: true,
            data: experience
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        }
        res.status(500).json({
            success: false,
            error: 'Server Error'
        });
    }
};

module.exports = {
    getExperiences,
    createExperience
};
