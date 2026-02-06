const express = require('express');
const {
    getTests,
    getTest,
    submitTest
} = require('../controllers/tests');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.use(protect); // All test routes are protected

router
    .route('/')
    .get(getTests);

router
    .route('/:id')
    .get(getTest);

router
    .route('/:id/submit')
    .post(submitTest);

module.exports = router;
