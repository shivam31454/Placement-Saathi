const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Progress = require('../models/Progress');

// @desc    Get all subjects
// @route   GET /api/learning/subjects
// @access  Public/Private
exports.getSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find().sort({ name: 1 });
        res.status(200).json({ success: true, data: subjects });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get topics by subject ID
// @route   GET /api/learning/subjects/:subjectId/topics
// @access  Public/Private
exports.getTopicsBySubject = async (req, res) => {
    try {
        const topics = await Topic.find({ subject: req.params.subjectId }).sort({ order: 1 });
        res.status(200).json({ success: true, count: topics.length, data: topics });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get single topic with details
// @route   GET /api/learning/topics/:topicId
// @access  Public/Private
exports.getTopic = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.topicId).populate('subject', 'name icon');
        if (!topic) {
            return res.status(404).json({ success: false, error: 'Topic not found' });
        }
        res.status(200).json({ success: true, data: topic });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Mark topic as completed/update progress
// @route   PUT /api/learning/topics/:topicId/progress
// @access  Private
exports.updateProgress = async (req, res) => {
    try {
        const { status } = req.body;
        const userId = req.user.id; // Assuming auth middleware adds user to req

        let progress = await Progress.findOne({ user: userId, topic: req.params.topicId });

        if (!progress) {
            progress = await Progress.create({
                user: userId,
                topic: req.params.topicId,
                status: status || 'In Progress',
                lastAccessed: Date.now()
            });
        } else {
            progress.status = status || progress.status;
            progress.lastAccessed = Date.now();
            if (status === 'Completed' && !progress.completedAt) {
                progress.completedAt = Date.now();
            }
            await progress.save();
        }

        res.status(200).json({ success: true, data: progress });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get user progress for a subject
// @route   GET /api/learning/progress/:subjectId
// @access  Private
exports.getUserProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        // Find all topics for this subject
        const topics = await Topic.find({ subject: req.params.subjectId }).select('_id');
        const topicIds = topics.map(t => t._id);

        // Find progress for these topics
        const progress = await Progress.find({ user: userId, topic: { $in: topicIds } });

        res.status(200).json({ success: true, count: progress.length, data: progress });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
