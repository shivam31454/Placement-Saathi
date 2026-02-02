const Groq = require('groq-sdk');
const Topic = require('../models/Topic');
const Subject = require('../models/Subject');
const PracticeQuestion = require('../models/PracticeQuestion');
const TestAttempt = require('../models/TestAttempt');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// @desc    Generate MCQs for a topic using Grok
// @route   POST /api/practice/generate
// @access  Private
exports.generatePracticeTest = async (req, res) => {
    try {
        const { topicId, difficulty } = req.body;

        // 1. Check if we have enough cached questions for this topic & difficulty
        // (Optimization: In a real app, we'd prefer cached ones first. For this feature, let's fetch new ones or mix)
        // For now, let's try to fetch 10 questions from DB first.
        let questions = await PracticeQuestion.find({
            topic: topicId,
            difficulty: difficulty || 'Medium'
        }).limit(10);

        if (questions.length >= 10) {
            // Shuffle them
            questions = questions.sort(() => 0.5 - Math.random());
            return res.status(200).json({ success: true, data: questions, source: 'cache' });
        }

        // 2. If not enough, generate via Grok
        const topic = await Topic.findById(topicId).populate('subject');
        if (!topic) return res.status(404).json({ error: 'Topic not found' });

        const prompt = `Generate 10 multiple-choice questions (MCQs) on the topic "${topic.title}" (Subject: ${topic.subject.name}) at ${difficulty || 'Medium'} level.
    Return ONLY a raw JSON array (no markdown formatting). Each object must have:
    - questionText (string)
    - options (array of 4 strings)
    - correctAnswer (string, must exactly match one of the options)
    - explanation (string)
    
    Ensure questions are conceptual and suitable for placement exams.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama3-8b-8192', // or any available model
        });

        let generatedContent = chatCompletion.choices[0]?.message?.content || '[]';
        // Clean up if Grok wraps in code blocks
        generatedContent = generatedContent.replace(/```json/g, '').replace(/```/g, '').trim();

        const parsedQuestions = JSON.parse(generatedContent);

        // 3. Save to DB
        const savedQuestions = [];
        for (const q of parsedQuestions) {
            // Validate structure
            if (!q.questionText || !q.options || !q.correctAnswer) continue;

            const newQ = await PracticeQuestion.create({
                topic: topicId,
                subject: topic.subject._id,
                questionText: q.questionText,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                difficulty: difficulty || 'Medium',
                generatedByAI: true
            });
            savedQuestions.push(newQ);
        }

        res.status(200).json({ success: true, data: savedQuestions, source: 'ai' });

    } catch (error) {
        console.error('Gen AI Error:', error);
        res.status(500).json({ success: false, error: 'Failed to generate questions' });
    }
};

// @desc    Submit test attempt
// @route   POST /api/practice/submit
// @access  Private
exports.submitTest = async (req, res) => {
    try {
        const { topicId, answers, timeTaken } = req.body; // answers: [{ questionId, userAnswer }]
        const userId = req.user.id;

        let score = 0;
        const questionsAttempted = [];

        for (const ans of answers) {
            const question = await PracticeQuestion.findById(ans.questionId);
            if (question) {
                const isCorrect = question.correctAnswer === ans.userAnswer;
                if (isCorrect) score++;

                questionsAttempted.push({
                    question: question._id,
                    userAnswer: ans.userAnswer,
                    isCorrect
                });
            }
        }

        const testAttempt = await TestAttempt.create({
            user: userId,
            topic: topicId,
            score,
            totalQuestions: answers.length,
            timeTaken,
            questionsAttempted
        });

        res.status(200).json({ success: true, data: testAttempt });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
