const express = require('express');
const router = express.Router();
const { generateInterviewResponse } = require('../controllers/aiController');

// Route for Mock Interview
router.post('/interview', generateInterviewResponse);

// Route for Global Chat
router.post('/chat', require('../controllers/aiController').generateChatResponse);

module.exports = router;
