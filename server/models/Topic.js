const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    content: {
        type: String, // Markdown content
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index to ensure topic titles are unique within a subject
topicSchema.index({ subject: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('Topic', topicSchema);
