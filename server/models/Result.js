const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    test: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    totalMarks: {
        type: Number,
        required: true,
    },
    accuracy: {
        type: Number, // Percentage
        required: true,
    },
    status: {
        type: String,
        enum: ['Pass', 'Fail'],
        required: true,
    },
    timeTaken: {
        type: Number, // In seconds
        default: 0,
    },
    answers: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
        },
        selectedOption: String, // For MCQ
        codeSubmitted: String, // For Coding
        isCorrect: Boolean,
        marksObtained: Number,
    }],
    completedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Result', ResultSchema);
