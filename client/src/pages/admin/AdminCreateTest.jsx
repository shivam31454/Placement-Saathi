import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Search, Plus, X, ArrowLeft } from 'lucide-react';

const AdminCreateTest = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [testData, setTestData] = useState({
        title: '',
        description: '',
        duration: 60,
        passingMarks: 40,
        difficulty: 'Medium',
        questions: [] // Array of { questionId, marks }
    });

    // Question Selection State
    const [availableQuestions, setAvailableQuestions] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedQuestions, setSelectedQuestions] = useState([]);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await api.get('/questions?limit=100'); // Fetch enough to select from
            setAvailableQuestions(res.data.data);
        } catch (err) {
            console.error("Failed to fetch questions", err);
        }
    };

    const calculateTotalMarks = () => {
        return selectedQuestions.reduce((acc, q) => acc + (q.type === 'CODING' ? 10 : 5), 0); // Default marks: 5 for MCQ, 10 for Coding
    };

    const handleAddQuestion = (question) => {
        if (selectedQuestions.find(q => q._id === question._id)) return;
        setSelectedQuestions([...selectedQuestions, question]);
    };

    const handleRemoveQuestion = (questionId) => {
        setSelectedQuestions(selectedQuestions.filter(q => q._id !== questionId));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedQuestions.length === 0) {
            setError('Please select at least one question');
            return;
        }

        setLoading(true);

        // Format payload
        const payload = {
            ...testData,
            totalMarks: calculateTotalMarks(),
            questions: selectedQuestions.map(q => ({
                questionId: q._id,
                marks: q.type === 'CODING' ? 10 : 5
            }))
        };

        try {
            await api.post('/tests', payload);
            navigate('/admin/tests');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create test');
        } finally {
            setLoading(false);
        }
    };

    // Filter available questions
    const filteredAvailable = availableQuestions.filter(q =>
        !selectedQuestions.find(sq => sq._id === q._id) &&
        (q.content.text.toLowerCase().includes(search.toLowerCase()) ||
            q.topic.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/admin/tests')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Create New Test</h1>
                    <p className="text-gray-500 text-sm">Configure test settings and select questions</p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-200">
                    {error}
                </div>
            )}

            <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
                {/* Left Panel: Test Settings & Selected Questions */}
                <div className="col-span-7 flex flex-col gap-6 overflow-y-auto pr-2">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="font-bold text-gray-800 mb-4 border-b pb-2">Test Configuration</h2>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <Input
                                label="Test Title"
                                value={testData.title}
                                onChange={(e) => setTestData({ ...testData, title: e.target.value })}
                                required
                            />
                            <Input
                                label="Duration (mins)"
                                type="number"
                                value={testData.duration}
                                onChange={(e) => setTestData({ ...testData, duration: e.target.value })}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                            <textarea
                                className="w-full p-2 border rounded resize-none"
                                rows="3"
                                value={testData.description}
                                onChange={(e) => setTestData({ ...testData, description: e.target.value })}
                            ></textarea>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                            <div>
                                <span className="text-gray-600 text-sm font-medium">Total Questions:</span>
                                <span className="ml-2 font-bold text-lg">{selectedQuestions.length}</span>
                            </div>
                            <div>
                                <span className="text-gray-600 text-sm font-medium">Total Marks:</span>
                                <span className="ml-2 font-bold text-lg text-primary">{calculateTotalMarks()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex-1">
                        <h2 className="font-bold text-gray-800 mb-4 border-b pb-2">Selected Questions</h2>
                        {selectedQuestions.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-lg">
                                Select questions from the right panel
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {selectedQuestions.map((q, idx) => (
                                    <div key={q._id} className="flex justify-between items-start p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-xs bg-white px-2 py-0.5 rounded text-primary">Q{idx + 1}</span>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${q.type === 'CODING' ? 'bg-purple-200 text-purple-800' : 'bg-green-200 text-green-800'
                                                    }`}>{q.type}</span>
                                            </div>
                                            <p className="text-sm text-gray-800 line-clamp-1">{q.content.text}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveQuestion(q._id)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Button onClick={handleSubmit} disabled={loading} className="py-3 text-lg">
                        {loading ? 'Creating Test...' : 'Create Test'}
                    </Button>
                </div>

                {/* Right Panel: Question Bank Search */}
                <div className="col-span-5 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h2 className="font-bold text-gray-800 mb-3">Add Questions</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search questions..."
                                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {filteredAvailable.map(q => (
                            <div key={q._id} className="p-3 border border-gray-200 rounded-lg hover:border-primary transition-colors cursor-pointer group" onClick={() => handleAddQuestion(q)}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${q.type === 'CODING' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                                        }`}>{q.type}</span>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                        }`}>{q.difficulty}</span>
                                </div>
                                <p className="text-sm text-gray-700 mb-2 line-clamp-2">{q.content.text}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-gray-400">{q.topic}</span>
                                    <Plus className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCreateTest;
