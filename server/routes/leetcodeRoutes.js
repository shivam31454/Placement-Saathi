const express = require('express');
const { updateUsername, getAnalytics } = require('../controllers/leetcodeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/username', updateUsername);
router.get('/analytics', getAnalytics);

module.exports = router;
