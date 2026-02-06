const Result = require('../models/Result');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get student analytics
// @route   GET /api/v1/analytics/student
// @access  Private (Student)
exports.getStudentAnalytics = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // 1. Overall Stats
        const overallStats = await Result.aggregate([
            { $match: { user: userId } }, // Pass the ObjectId directly since aggregation usually expects ObjectId or does casting
            {
                $group: {
                    _id: null,
                    totalTests: { $sum: 1 },
                    avgScore: { $avg: '$accuracy' },
                    totalPass: {
                        $sum: { $cond: [{ $eq: ['$status', 'Pass'] }, 1, 0] }
                    }
                }
            }
        ]);

        // Note: If no results, overallStats is empty array
        const stats = overallStats.length > 0 ? overallStats[0] : { totalTests: 0, avgScore: 0, totalPass: 0 };


        // 2. Performance Over Time (Last 5 tests)
        const history = await Result.find({ user: userId })
            .sort({ completedAt: 1 })
            .limit(5)
            .select('score totalMarks accuracy completedAt');


        // 3. Subject-wise Analysis (Need to look up Questions)
        // This is complex because Answers array references Question ID. 
        // We can do a deep aggregation.

        const subjectAnalysis = await Result.aggregate([
            { $match: { user: userId } },
            { $unwind: '$answers' },
            {
                $lookup: {
                    from: 'questions',
                    localField: 'answers.questionId',
                    foreignField: '_id',
                    as: 'questionDetails'
                }
            },
            { $unwind: '$questionDetails' },
            {
                $group: {
                    _id: '$questionDetails.subject',
                    totalQuestions: { $sum: 1 },
                    correctCount: {
                        $sum: { $cond: [{ $eq: ['$answers.isCorrect', true] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    subject: '$_id',
                    accuracy: { $multiply: [{ $divide: ['$correctCount', '$totalQuestions'] }, 100] }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                stats,
                history,
                subjectAnalysis
            }
        });

    } catch (err) {
        // Mongoose aggregation can fail if User ID type mismatch, but req.user.id is usually string. 
        // Mongoose 6+ often handles casting, but safe to cast. 
        // For now assume it works, if not add mongoose.Types.ObjectId(userId)
        next(err);
    }
};

// @desc    Get Personalized Study Roadmap
// @route   GET /api/v1/analytics/roadmap
// @access  Private
exports.getStudyRoadmap = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // 1. Identify Weak Areas (Accuracy < 60%)
        const subjectPerformance = await Result.aggregate([
            { $match: { user: userId } },
            { $unwind: '$answers' },
            {
                $lookup: {
                    from: 'questions',
                    localField: 'answers.questionId',
                    foreignField: '_id',
                    as: 'questionDetails'
                }
            },
            { $unwind: '$questionDetails' },
            {
                $group: {
                    _id: '$questionDetails.subject',
                    totalQuestions: { $sum: 1 },
                    correctCount: {
                        $sum: { $cond: [{ $eq: ['$answers.isCorrect', true] }, 1, 0] }
                    }
                }
            },
            {
                $project: {
                    subject: '$_id',
                    accuracy: { $multiply: [{ $divide: ['$correctCount', '$totalQuestions'] }, 100] }
                }
            }
        ]);

        const weakSubjects = subjectPerformance.filter(s => s.accuracy < 60).map(s => s.subject);

        // 2. Generate Roadmap
        let roadmap = [];
        let weekCounter = 1;

        // Standard Resource Map
        const resources = {
            'DSA': ['LeetCode Top 100 Liked', 'Striver SDE Sheet', 'Practice Array/Linked List'],
            'DBMS': ['SQL 50 Questions (Hackerrank)', 'Learn Normalization (1NF to 3NF)', 'ACID Properties Deep Dive'],
            'OS': ['Process Scheduling Algorithms', 'Deadlock Prevention', 'Memory Management Paging'],
            'CN': ['OSI Model Layers', 'TCP vs UDP', 'Solve Subnetting Problems']
        };

        // If no data or all good, give a "Maintenance" plan
        if (weakSubjects.length === 0) {
            roadmap.push({
                week: 1,
                title: 'Advanced Practice & Mock Tests',
                focus: 'General',
                description: 'Your fundamentals are strong! Focus on speed and diverse problem solving.',
                tasks: [
                    'Take a Full-length Mock Test',
                    'Solve 2 Hard LeetCode problems',
                    'Review System Design basics'
                ]
            });
        } else {
            // Create a week for each weak subject
            weakSubjects.slice(0, 4).forEach(subject => { // Limit to 4 weeks
                roadmap.push({
                    week: weekCounter++,
                    title: `Mastering ${subject}`,
                    focus: subject,
                    description: `Your accuracy in ${subject} is below 60%. Let's improve this.`,
                    tasks: resources[subject] || ['Review Fundamentals', 'Solve 20 practice questions', 'Read documentation']
                });
            });
        }

        res.status(200).json({
            success: true,
            data: roadmap
        });

    } catch (err) {
        next(err);
    }
};


