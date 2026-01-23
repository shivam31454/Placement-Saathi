const mongoose = require('mongoose');

const TestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a test title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    duration: {
        type: Number,
        required: [true, 'Please add duration in minutes'],
        default: 60,
    },
    totalMarks: {
        type: Number,
        default: 0,
    },
    passingMarks: {
        type: Number,
        default: 0,
    },
    questions: [{
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
            required: true
        },
        marks: {
            type: Number,
            default: 1
        }
    }],
    category: {
        type: String, // e.g., 'Full Mock', 'Topic Wise', 'Company Specific'
        default: 'Mock Test'
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard', 'Mixed'],
        default: 'Mixed'
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Test', TestSchema);
