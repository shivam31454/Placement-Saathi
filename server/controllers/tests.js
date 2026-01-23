const Test = require('../models/Test');
const Question = require('../models/Question');
const Result = require('../models/Result');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create a new test
// @route   POST /api/v1/tests
// @access  Private (Admin)
exports.createTest = async (req, res, next) => {
    try {
        const test = await Test.create(req.body);
        res.status(201).json({ success: true, data: test });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all tests
// @route   GET /api/v1/tests
// @access  Private (Student)
exports.getTests = async (req, res, next) => {
    try {
        const tests = await Test.find().sort('-createdAt');
        res.status(200).json({ success: true, count: tests.length, data: tests });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single test (populate questions)
// @route   GET /api/v1/tests/:id
// @access  Private
exports.getTest = async (req, res, next) => {
    try {
        const test = await Test.findById(req.params.id).populate({
            path: 'questions.questionId',
            select: '-content.options.isCorrect -content.testCases.isHidden' // Hide answers
        });

        if (!test) {
            return next(new ErrorResponse(`Test not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({ success: true, data: test });
    } catch (err) {
        next(err);
    }
};

// @desc    Submit test and evaluate
// @route   POST /api/v1/tests/:id/submit
// @access  Private (Student)
exports.submitTest = async (req, res, next) => {
    try {
        const testId = req.params.id;
        const { answers, timeTaken } = req.body; // answers: [{ questionId, selectedOption, code... }]

        const test = await Test.findById(testId).populate('questions.questionId');

        if (!test) {
            return next(new ErrorResponse(`Test not found`, 404));
        }

        let score = 0;
        let correctCount = 0;
        const detailedAnswers = [];

        // Evaluation Logic
        for (let testQ of test.questions) {
            const question = testQ.questionId;
            const userAns = answers.find(a => a.questionId.toString() === question._id.toString());

            let isCorrect = false;
            let marksObtained = 0;

            if (userAns) {
                if (question.type === 'MCQ') {
                    const correctOpt = question.content.options.find(o => o.isCorrect);
                    // Simple string matching for now (assuming option text is unique or using indices)
                    // Ideally we should use option IDs, but for this simple version text comparison
                    if (correctOpt && userAns.selectedOption === correctOpt.text) {
                        isCorrect = true;
                    }
                } else if (question.type === 'CODING') {
                    // Placeholder: Auto-pass coding for now or integrate external judge later
                    // For MVP: If code is longer than 10 chars, consider "attempted" (Manual review needed really)
                    // Or strictly: Simple strict check is impossible without running code. 
                    // We will mark it as correct for demo if they typed something substantial.
                    if (userAns.codeSubmitted && userAns.codeSubmitted.length > 20) {
                        isCorrect = true;
                    }
                }
            }

            if (isCorrect) {
                score += testQ.marks;
                marksObtained = testQ.marks;
                correctCount++;
            }

            detailedAnswers.push({
                questionId: question._id,
                selectedOption: userAns?.selectedOption,
                codeSubmitted: userAns?.codeSubmitted,
                isCorrect,
                marksObtained
            });
        }

        const totalQuestions = test.questions.length;
        const accuracy = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
        const status = score >= test.passingMarks ? 'Pass' : 'Fail';

        const result = await Result.create({
            user: req.user.id,
            test: testId,
            score,
            totalMarks: test.totalMarks,
            accuracy,
            status,
            timeTaken,
            answers: detailedAnswers
        });

        res.status(200).json({ success: true, data: result });

    } catch (err) {
        next(err);
    }
};
