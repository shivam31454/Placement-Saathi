import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import practiceService from '../../services/practiceService';

const PracticeArena = () => {
    const { topicId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: answer }
    const [testSubmitted, setTestSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [startTime, setStartTime] = useState(Date.now());
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const generateTest = async () => {
            try {
                // Default to Medium difficulty for now
                const res = await practiceService.generatePracticeTest(topicId, 'Medium');
                if (res.success) {
                    setQuestions(res.data);
                    setStartTime(Date.now());
                }
            } catch (error) {
                console.error("Failed to generate test", error);
            } finally {
                setLoading(false);
            }
        };
        generateTest();
    }, [topicId]);

    const handleOptionSelect = (questionId, option) => {
        if (testSubmitted) return;
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const timeTaken = Math.floor((Date.now() - startTime) / 1000);
            const answersPayload = Object.keys(selectedAnswers).map(qId => ({
                questionId: qId,
                userAnswer: selectedAnswers[qId]
            }));

            const res = await practiceService.submitTest(topicId, answersPayload, timeTaken);
            if (res.success) {
                setScore(res.data.score);
                setTestSubmitted(true);
            }
        } catch (error) {
            console.error("Failed to submit test", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-xl">Generating customized questions...</p>
        </div>
    );

    if (questions.length === 0) return <div className="text-white text-center mt-20">No questions available.</div>;

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {!testSubmitted ? (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Top 10 Practice Questions</h2>
                        <div className="text-gray-400">
                            Question {currentQuestionIndex + 1} / {questions.length}
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-8 shadow-lg mb-8">
                        <p className="text-xl text-white mb-6 font-medium">{currentQuestion.questionText}</p>

                        <div className="space-y-4">
                            {currentQuestion.options.map((option, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleOptionSelect(currentQuestion._id, option)}
                                    className={`p-4 rounded-lg cursor-pointer border transition-all ${selectedAnswers[currentQuestion._id] === option
                                            ? 'bg-blue-900 border-blue-500 text-white'
                                            : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                                        }`}
                                >
                                    <span className="font-bold mr-3">{String.fromCharCode(65 + idx)}.</span>
                                    {option}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <button
                            disabled={currentQuestionIndex === 0}
                            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                            className={`px-6 py-2 rounded-lg font-medium ${currentQuestionIndex === 0 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-500 text-white'
                                }`}
                        >
                            Previous
                        </button>

                        {isLastQuestion ? (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-lg"
                            >
                                {submitting ? 'Submitting...' : 'Submit Test'}
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                            >
                                Next
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <div className="bg-gray-800 rounded-xl p-8 shadow-lg text-center animate-fadeIn">
                    <h2 className="text-3xl font-bold text-white mb-4">Test Completed! 🎉</h2>
                    <div className="text-6xl font-black text-blue-500 mb-6">
                        {score} <span className="text-2xl text-gray-400">/ {questions.length}</span>
                    </div>

                    <p className="text-gray-300 mb-8 max-w-lg mx-auto">
                        Great job completing the practice session. Review your answers below to check what you got right (and where you made silly mistakes!).
                    </p>

                    <div className="flex justify-center gap-4 mb-10">
                        <button
                            onClick={() => navigate('/learning')}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
                        >
                            Back to Dashboard
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                        >
                            Retake Practice
                        </button>
                    </div>

                    <div className="text-left space-y-8">
                        {questions.map((q, idx) => {
                            const userAns = selectedAnswers[q._id];
                            const isCorrect = userAns === q.correctAnswer;

                            return (
                                <div key={q._id} className={`p-6 rounded-lg border ${isCorrect ? 'border-green-800 bg-green-900/20' : 'border-red-800 bg-red-900/20'}`}>
                                    <p className="text-white font-medium mb-3">{idx + 1}. {q.questionText}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div className={`${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                            Your Answer: {userAns || 'Not Answered'}
                                        </div>
                                        <div className="text-green-400">
                                            Correct Answer: {q.correctAnswer}
                                        </div>
                                    </div>
                                    {q.explanation && (
                                        <div className="mt-3 text-gray-400 text-sm italic border-t border-gray-700 pt-2">
                                            💡 {q.explanation}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PracticeArena;
