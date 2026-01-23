const express = require('express');
const multer = require('multer');
const { analyzeResume } = require('../controllers/resume');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const { protect } = require('../middleware/auth');

// Setup Uploads Directory
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

router.use(protect);
router.post('/analyze', upload.single('resume'), analyzeResume);

module.exports = router;
