const express = require('express');
const { getStudentAnalytics, getStudyRoadmap } = require('../controllers/analytics');

const router = express.Router();
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/student', getStudentAnalytics);
router.get('/roadmap', getStudyRoadmap);

module.exports = router;
