const User = require('../models/User');
const Test = require('../models/Test');
const Question = require('../models/Question');
const Result = require('../models/Result');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get dashboard stats
// @route   GET /api/v1/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const testsCreated = await Test.countDocuments();
        // For active users, we can count users who have logged in recently, or just total users for now.
        // Let's use total users (including admins if any, or just students) for now as "Active" might need a 'lastLogin' field which we might not have populated yet.
        // Assuming "Active Users" means created accounts for now.
        const activeUsers = totalStudents;

        res.status(200).json({
            success: true,
            data: {
                totalStudents,
                testsCreated,
                activeUsers
            }
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all students
// @route   GET /api/v1/admin/students
// @access  Private/Admin
exports.getStudents = async (req, res, next) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single student performance
// @route   GET /api/v1/admin/student/:id/performance
// @access  Private/Admin
exports.getStudentPerformance = async (req, res, next) => {
    try {
        const student = await User.findById(req.params.id);

        if (!student) {
            return next(new ErrorResponse(`Student not found with id of ${req.params.id}`, 404));
        }

        const results = await Result.find({ user: req.params.id })
            .populate('test', 'title category difficulty')
            .sort('-completedAt');

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Create a new Test (with Questions)
// @route   POST /api/v1/admin/test
// @access  Private/Admin
exports.createTest = async (req, res, next) => {
    try {
        const { title, description, duration, subject, questions } = req.body;

        // 1. Create Questions
        const questionIds = [];
        let totalMarks = 0;

        for (const q of questions) {
            const newQuestion = await Question.create({
                type: 'MCQ', // Ensuring default type for now
                subject: subject,
                topic: q.topic || 'General',
                difficulty: q.difficulty || 'Medium',
                content: {
                    text: q.text,
                    options: q.options, // Expecting array of { text: string, isCorrect: boolean }
                }
            });
            questionIds.push({ questionId: newQuestion._id, marks: 1 }); // Default 1 mark per question
            totalMarks += 1;
        }

        // 2. Create Test linked to Questions
        const test = await Test.create({
            title,
            description,
            duration,
            totalMarks,
            passingMarks: Math.ceil(totalMarks * 0.4), // 40% passing
            category: subject, // Using subject as category (e.g., DBMS, OS)
            questions: questionIds
        });

        res.status(201).json({
            success: true,
            data: test
        });

    } catch (err) {
        next(err);
    }
};
// @desc    Get all tests (Admin)
// @route   GET /api/v1/admin/tests
// @access  Private/Admin
exports.getAllTests = async (req, res, next) => {
    try {
        const tests = await Test.find().sort('-createdAt');
        res.status(200).json({
            success: true,
            count: tests.length,
            data: tests
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a Test
// @route   DELETE /api/v1/admin/test/:id
// @access  Private/Admin
exports.deleteTest = async (req, res, next) => {
    try {
        const test = await Test.findById(req.params.id);

        if (!test) {
            return next(new ErrorResponse(`Test not found with id of ${req.params.id}`, 404));
        }

        // Delete associated questions ? 
        // Logic: Tests have questions. Questions might be reused? 
        // For now, let's assume questions are unique to tests or ok to keep. 
        // IF we want to delete questions, we need to loop through test.questions and delete them from Question model.
        // Let's safe delete: Delete Test, keep Questions (orphan questions) OR Delete both.
        // Given the "Add Test" logic creates questions *for* the test, it's cleaner to delete them too to clean DB.

        const questionIds = test.questions.map(q => q.questionId);
        await Question.deleteMany({ _id: { $in: questionIds } });

        await test.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (err) {
        next(err);
    }
};
