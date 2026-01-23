const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['MCQ', 'CODING'],
        required: true,
    },
    subject: {
        type: String,
        required: [true, 'Please add a subject'], // e.g., 'DSA', 'DBMS'
        trim: true,
    },
    topic: {
        type: String,
        required: [true, 'Please add a topic'], // e.g., 'Arrays', 'Indexing'
        trim: true,
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true,
    },
    companies: [{
        type: String, // Tags like 'Amazon', 'Google'
        trim: true,
    }],
    content: {
        text: {
            type: String,
            required: [true, 'Please add question text'],
        },
        image: String, // Optional URL
        // For MCQ
        options: [{
            text: { type: String },
            isCorrect: { type: Boolean, default: false }
        }],
        // For Coding
        codeStub: { type: String }, // Initial code provided to user
        testCases: [{
            input: String,
            output: String,
            isHidden: { type: Boolean, default: false }
        }]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Index for easier searching
QuestionSchema.index({ subject: 1, topic: 1, difficulty: 1 });

module.exports = mongoose.model('Question', QuestionSchema);
