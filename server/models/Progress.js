const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic',
        required: true
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started'
    },
    lastAccessed: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
});

// Ensure one progress record per user per topic
progressSchema.index({ user: 1, topic: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
