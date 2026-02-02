const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Database Connection
connectDB();


// Route files
const auth = require('./routes/auth');
const questions = require('./routes/questions');
const tests = require('./routes/tests');
const analytics = require('./routes/analytics');
const resume = require('./routes/resume');

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/questions', questions);
app.use('/api/v1/tests', tests);
app.use('/api/v1/analytics', analytics);
app.use('/api/v1/resume', resume);
app.use('/api/v1/ai', require('./routes/aiRoutes'));
app.use('/api/v1/experiences', require('./routes/experiencesRoutes'));
app.use('/api/v1/leetcode', require('./routes/leetcodeRoutes'));
app.use('/api/v1/learning', require('./routes/learningRoutes'));
app.use('/api/v1/practice', require('./routes/practiceRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));




app.get('/', (req, res) => {
    res.send('API is running...');
});


// Error Handling Middleware
const errorHandler = require('./middleware/error');
app.use(errorHandler);

const startServer = (port) => {
    const server = app.listen(port, () => {
        console.log(`Server running on port ${server.address().port}`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is busy, trying a random port...`);
            startServer(0); // 0 means random available port
        } else {
            console.error(err);
        }
    });
};

const PORT = process.env.PORT || 5000;
startServer(PORT);
