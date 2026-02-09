const express = require('express');
const { updateUsername, getAnalytics, initiateVerification, verifyLeetCode, unlinkLeetCode } = require('../controllers/leetcodeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.post('/username', updateUsername); // deprecated
router.get('/analytics', getAnalytics);
router.post('/initiate-verification', initiateVerification);
router.post('/verify', verifyLeetCode);
router.post('/unlink', unlinkLeetCode);

module.exports = router;
