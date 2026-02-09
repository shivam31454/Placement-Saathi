import React, { useState } from 'react';
import adminService from '../../services/adminService';
import { Plus, Trash, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddTest = () => {
    const navigate = useNavigate();
    const [testDetails, setTestDetails] = useState({
        title: '',
        description: '',
        duration: 60,
        subject: 'DBMS', // Default
    });

    const [questions, setQuestions] = useState([
        {
            text: '',
            options: [
                { text: '', isCorrect: false },
                { text: '', isCorrect: false },
                { text: '', isCorrect: false },
                { text: '', isCorrect: false }
            ],
            correctOptionIndex: 0 // Helper to manage radio button state
        }
    ]);

    const handleTestChange = (e) => {
        setTestDetails({ ...testDetails, [e.target.name]: e.target.value });
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex].text = value;
        setQuestions(newQuestions);
    };

    const handleCorrectOptionChange = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        // Reset all to false
        newQuestions[qIndex].options.forEach(opt => opt.isCorrect = false);
        // Set selected to true
        newQuestions[qIndex].options[oIndex].isCorrect = true;
        newQuestions[qIndex].correctOptionIndex = oIndex;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                text: '',
                options: [
                    { text: '', isCorrect: true },
                    { text: '', isCorrect: false },
                    { text: '', isCorrect: false },
                    { text: '', isCorrect: false }
                ],
                correctOptionIndex: 0
            }
        ]);
    };

    const removeQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...testDetails,
                questions: questions.map(q => ({
                    text: q.text,
                    options: q.options.map(opt => ({ text: opt.text, isCorrect: opt.isCorrect }))
                }))
            };

            await adminService.createTest(payload);
            alert('Test Created Successfully!');
            navigate('/admin/dashboard');
        } catch (error) {
            console.error(error);
            alert('Failed to create test');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-white">Add New Test</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Test Details Section */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-4">
                    <h2 className="text-xl font-semibold text-white mb-4">Test Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={testDetails.title}
                                onChange={handleTestChange}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Subject</label>
                            <select
                                name="subject"
                                value={testDetails.subject}
                                onChange={handleTestChange}
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            >
                                <option value="DBMS">DBMS</option>
                                <option value="OS">Operating Systems</option>
                                <option value="CN">Computer Networks</option>
                                <option value="DSA">DSA</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-1">Description</label>
                        <textarea
                            name="description"
                            value={testDetails.description}
                            onChange={handleTestChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 h-24"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-1">Duration (minutes)</label>
                        <input
                            type="number"
                            name="duration"
                            value={testDetails.duration}
                            onChange={handleTestChange}
                            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                {/* Questions Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-white flex items-center justify-between">
                        Questions
                        <button
                            type="button"
                            onClick={addQuestion}
                            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus size={16} /> Add Question
                        </button>
                    </h2>

                    {questions.map((q, qIndex) => (
                        <div key={qIndex} className="bg-gray-800 p-6 rounded-xl border border-gray-700 relative">
                            <button
                                type="button"
                                onClick={() => removeQuestion(qIndex)}
                                className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors"
                            >
                                <Trash size={18} />
                            </button>

                            <div className="mb-4">
                                <label className="block text-gray-400 mb-1">Question {qIndex + 1}</label>
                                <input
                                    type="text"
                                    value={q.text}
                                    onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="Enter question text"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {q.options.map((opt, oIndex) => (
                                    <div key={oIndex} className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name={`correct-${qIndex}`}
                                            checked={q.correctOptionIndex === oIndex}
                                            onChange={() => handleCorrectOptionChange(qIndex, oIndex)}
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 bg-gray-700 border-gray-600"
                                        />
                                        <input
                                            type="text"
                                            value={opt.text}
                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                            className={`flex-1 bg-gray-900 border ${q.correctOptionIndex === oIndex ? 'border-green-500/50' : 'border-gray-700'} rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm`}
                                            placeholder={`Option ${oIndex + 1}`}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-green-900/20 flex items-center gap-2 transition-all transform hover:scale-105"
                    >
                        <Save size={20} />
                        Save Test
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddTest;
