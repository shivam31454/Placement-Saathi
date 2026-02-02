const mongoose = require('mongoose');

const testAttemptSchema = new mongoose.Schema({
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
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    timeTaken: {
        type: Number, // in seconds
        default: 0
    },
    questionsAttempted: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PracticeQuestion'
        },
        userAnswer: String,
        isCorrect: Boolean
    }],
    completedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TestAttempt', testAttemptSchema);
