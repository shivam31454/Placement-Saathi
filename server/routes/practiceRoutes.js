const express = require('express');
const router = express.Router();
const { generatePracticeTest, submitTest } = require('../controllers/practiceController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generatePracticeTest);
router.post('/submit', protect, submitTest);

module.exports = router;
