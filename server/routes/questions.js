const express = require('express');
const {
    getQuestions,
    getQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion
} = require('../controllers/questions');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(getQuestions)
    .post(protect, authorize('admin'), createQuestion);

router
    .route('/:id')
    .get(getQuestion)
    .put(protect, authorize('admin'), updateQuestion)
    .delete(protect, authorize('admin'), deleteQuestion);

module.exports = router;
