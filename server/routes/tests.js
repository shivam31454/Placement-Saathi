const express = require('express');
const {
    createTest,
    getTests,
    getTest,
    submitTest
} = require('../controllers/tests');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect); // All test routes are protected

router
    .route('/')
    .get(getTests)
    .post(authorize('admin'), createTest);

router
    .route('/:id')
    .get(getTest);

router
    .route('/:id/submit')
    .post(submitTest);

module.exports = router;
