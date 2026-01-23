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
app.use('/api/v1/ai', require('./routes/ai'));

app.get('/', (req, res) => {
    res.send('API is running...');
});


// Error Handling Middleware
const errorHandler = require('./middleware/error');
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
