const express = require('express');
const router = express.Router();
const { getSubjects, getTopicsBySubject, getTopic, updateProgress, getUserProgress } = require('../controllers/learningController');
const { protect } = require('../middleware/auth');

router.get('/subjects', getSubjects);
router.get('/subjects/:subjectId/topics', getTopicsBySubject);
router.get('/topics/:topicId', protect, getTopic); // Protect to ensure user is logged in for viewing
router.put('/topics/:topicId/progress', protect, updateProgress);
router.get('/progress/:subjectId', protect, getUserProgress);

module.exports = router;
