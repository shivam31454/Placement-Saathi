const Question = require('../models/Question');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all questions (with filtering)
// @route   GET /api/v1/questions
// @access  Public/Private (depending on use case)
exports.getQuestions = async (req, res, next) => {
    try {
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];

        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Finding resource
        query = Question.find(JSON.parse(queryStr));

        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Question.countDocuments();

        query = query.skip(startIndex).limit(limit);

        // Executing query
        const questions = await query;

        // Pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        res.status(200).json({
            success: true,
            count: questions.length,
            pagination,
            data: questions
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single question
// @route   GET /api/v1/questions/:id
// @access  Public
exports.getQuestion = async (req, res, next) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return next(new ErrorResponse(`Question not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({ success: true, data: question });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new question
// @route   POST /api/v1/questions
// @access  Private (Admin)
exports.createQuestion = async (req, res, next) => {
    try {
        const question = await Question.create(req.body);

        res.status(201).json({
            success: true,
            data: question
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update question
// @route   PUT /api/v1/questions/:id
// @access  Private (Admin)
exports.updateQuestion = async (req, res, next) => {
    try {
        let question = await Question.findById(req.params.id);

        if (!question) {
            return next(new ErrorResponse(`Question not found with id of ${req.params.id}`, 404));
        }

        question = await Question.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: question });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete question
// @route   DELETE /api/v1/questions/:id
// @access  Private (Admin)
exports.deleteQuestion = async (req, res, next) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return next(new ErrorResponse(`Question not found with id of ${req.params.id}`, 404));
        }

        await question.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
