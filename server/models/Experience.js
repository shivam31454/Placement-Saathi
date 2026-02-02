const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please add a company name']
    },
    role: {
        type: String,
        required: [true, 'Please add a job role']
    },
    author: {
        type: String,
        required: [true, 'Please add author name']
    },
    batch: { // e.g., 2025
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    offerStatus: {
        type: String,
        enum: ['Selected', 'Rejected', 'Pending'],
        required: true
    },
    content: {
        type: String,
        required: [true, 'Please add the experience content']
    },
    tags: [String],
    likes: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false // For now, allow anonymous or manual entry
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Experience', experienceSchema);
