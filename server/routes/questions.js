const express = require('express');
const {
    getQuestions,
    getQuestion
} = require('../controllers/questions');

const router = express.Router();

const { protect } = require('../middleware/auth');

router
    .route('/')
    .get(getQuestions);

router
    .route('/:id')
    .get(getQuestion);

module.exports = router;
