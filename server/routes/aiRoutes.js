const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { generateInterviewResponse, generateChatResponse, generateInsights } = require('../controllers/aiController');

// Rate limiter for AI insights (saves Groq API tokens)
const insightsLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 1, // 1 request per user per 5 minutes
    message: { success: false, error: "AI insights can be generated once every 5 minutes. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

// Route for Mock Interview
router.post('/interview', generateInterviewResponse);

// Route for Global Chat
router.post('/chat', generateChatResponse);

// Route for Dashboard Insights (rate limited)
router.post('/insights', insightsLimiter, generateInsights);

module.exports = router;
