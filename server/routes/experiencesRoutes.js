const express = require('express');
const router = express.Router();
const { getExperiences, createExperience } = require('../controllers/experiencesController');

router.route('/')
    .get(getExperiences)
    .post(createExperience); // Add auth middleware later if needed

module.exports = router;
