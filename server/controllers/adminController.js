const Subject = require('../models/Subject');
const Topic = require('../models/Topic');

// @desc    Create a new subject
// @route   POST /api/admin/subjects
// @access  Private/Admin
exports.createSubject = async (req, res) => {
    try {
        const subject = await Subject.create(req.body);
        res.status(201).json({ success: true, data: subject });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Create a new topic
// @route   POST /api/admin/topics
// @access  Private/Admin
exports.createTopic = async (req, res) => {
    try {
        const topic = await Topic.create(req.body);
        res.status(201).json({ success: true, data: topic });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Update topic notes
// @route   PUT /api/admin/topics/:id
// @access  Private/Admin
exports.updateTopic = async (req, res) => {
    try {
        const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: topic });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete subject
// @route   DELETE /api/admin/subjects/:id
// @access  Private/Admin
exports.deleteSubject = async (req, res) => {
    try {
        await Subject.findByIdAndDelete(req.params.id);
        // Optional: Cascade delete topics? For now, keep it simple.
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Delete topic
// @route   DELETE /api/admin/topics/:id
// @access  Private/Admin
exports.deleteTopic = async (req, res) => {
    try {
        await Topic.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
