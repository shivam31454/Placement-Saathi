const express = require('express');
const router = express.Router();
const { createSubject, createTopic, updateTopic, deleteSubject, deleteTopic } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.post('/subjects', protect, authorize('admin'), createSubject);
router.post('/topics', protect, authorize('admin'), createTopic);
router.put('/topics/:id', protect, authorize('admin'), updateTopic);
router.delete('/subjects/:id', protect, authorize('admin'), deleteSubject);
router.delete('/topics/:id', protect, authorize('admin'), deleteTopic);

module.exports = router;
