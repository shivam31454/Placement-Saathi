const express = require('express');
const {
    getStudents,
    getStudentPerformance,
    createTest,
    getDashboardStats,
    getAllTests,
    deleteTest
} = require('../controllers/adminController');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Apply protection and admin authorization to all routes
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/students', getStudents);
router.get('/student/:id/performance', getStudentPerformance);
router.post('/test', createTest);
router.get('/tests', getAllTests);
router.delete('/test/:id', deleteTest);

module.exports = router;
