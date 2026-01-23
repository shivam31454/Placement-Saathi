const express = require('express');
const { getStudentAnalytics, getStudyRoadmap, getAdminAnalytics } = require('../controllers/analytics');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/student', getStudentAnalytics);
router.get('/roadmap', getStudyRoadmap);
router.get('/admin', authorize('admin'), getAdminAnalytics);

module.exports = router;
