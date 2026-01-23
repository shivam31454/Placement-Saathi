import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Save, ArrowLeft, Plus, Trash2, CheckCircle } from 'lucide-react';
import Editor from '@monaco-editor/react';

const AdminAddQuestion = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        type: 'MCQ',
        subject: '',
        topic: '',
        difficulty: 'Easy',
        content: {
            text: '',
            image: '',
            // MCQ specific
            options: [
                { text: '', isCorrect: false },
                { text: '', isCorrect: false },
                { text: '', isCorrect: false },
                { text: '', isCorrect: false }
            ],
            // Coding specific
            codeStub: '',
            testCases: [{ input: '', output: '', isHidden: false }]
        }
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleContentChange = (e) => {
        setFormData({
            ...formData,
            content: { ...formData.content, [e.target.name]: e.target.value }
        });
    };

    // MCQ Options Handlers
    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.content.options];
        newOptions[index].text = value;
        setFormData({
            ...formData,
            content: { ...formData.content, options: newOptions }
        });
    };

    const markCorrectOption = (index) => {
        const newOptions = formData.content.options.map((opt, i) => ({
            ...opt,
            isCorrect: i === index
        }));
        setFormData({
            ...formData,
            content: { ...formData.content, options: newOptions }
        });
    };

    // Coding Test Case Handlers
    const addTestCase = () => {
        setFormData({
            ...formData,
            content: {
                ...formData.content,
                testCases: [...formData.content.testCases, { input: '', output: '', isHidden: false }]
            }
        });
    };

    const removeTestCase = (index) => {
        const newTestCases = formData.content.testCases.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            content: { ...formData.content, testCases: newTestCases }
        });
    };

    const handleTestCaseChange = (index, field, value) => {
        const newTestCases = [...formData.content.testCases];
        newTestCases[index][field] = value;
        setFormData({
            ...formData,
            content: { ...formData.content, testCases: newTestCases }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/questions', formData);
            navigate('/admin/questions');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to create question');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/admin/questions')}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Add New Question</h1>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-200">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                        <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 outline-none"
                            required
                        >
                            <option value="">Select Subject</option>
                            <option value="DSA">DSA</option>
                            <option value="DBMS">DBMS</option>
                            <option value="OS">Operating Systems</option>
                            <option value="CN">Computer Networks</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Topic</label>
                        <input
                            type="text"
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            placeholder="e.g. Arrays, Normalization"
                            className="w-full p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 outline-none"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Question Type</label>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'MCQ' })}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.type === 'MCQ' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Multiple Choice
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, type: 'CODING' })}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${formData.type === 'CODING' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                Coding Problem
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                        <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                            className="w-full p-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 outline-none"
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                </div>

                {/* Question Text */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Question Text</label>
                    <textarea
                        name="text"
                        value={formData.content.text}
                        onChange={handleContentChange}
                        rows="4"
                        className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                        placeholder="Enter the question statement..."
                        required
                    ></textarea>
                </div>

                {/* Dynamic Content based on Type */}
                {formData.type === 'MCQ' ? (
                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-gray-700">Options (Select correct answer)</label>
                        {formData.content.options.map((opt, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => markCorrectOption(idx)}
                                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${opt.isCorrect ? 'border-secondary bg-secondary text-white' : 'border-gray-300 text-transparent hover:border-secondary'
                                        }`}
                                >
                                    <CheckCircle className="w-4 h-4" />
                                </button>
                                <input
                                    type="text"
                                    value={opt.text}
                                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                                    placeholder={`Option ${idx + 1}`}
                                    className={`flex-1 p-2.5 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none ${opt.isCorrect ? 'border-secondary bg-emerald-50' : 'bg-gray-50'
                                        }`}
                                    required
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Initial Code Stub</label>
                            <textarea
                                className="hidden"
                                readOnly
                                value={formData.content.codeStub}
                            />
                            <div className="border border-gray-300 rounded-lg overflow-hidden">
                                <Editor
                                    height="200px"
                                    defaultLanguage="javascript"
                                    theme="vs-dark"
                                    value={formData.content.codeStub}
                                    onChange={(value) => handleContentChange({ target: { name: 'codeStub', value: value || '' } })}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 13,
                                        scrollBeyondLastLine: false,
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-sm font-semibold text-gray-700">Test Cases</label>
                                <button
                                    type="button"
                                    onClick={addTestCase}
                                    className="text-sm text-primary font-medium hover:text-indigo-700 flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" /> Add Test Case
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.content.testCases.map((tc, idx) => (
                                    <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group">
                                        <button
                                            type="button"
                                            onClick={() => removeTestCase(idx)}
                                            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-xs text-gray-500 mb-1 block">Input</label>
                                                <textarea
                                                    value={tc.input}
                                                    onChange={(e) => handleTestCaseChange(idx, 'input', e.target.value)}
                                                    className="w-full p-2 border rounded text-sm font-mono h-20"
                                                    placeholder="Input params..."
                                                ></textarea>
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 mb-1 block">Expected Output</label>
                                                <textarea
                                                    value={tc.output}
                                                    onChange={(e) => handleTestCaseChange(idx, 'output', e.target.value)}
                                                    className="w-full p-2 border rounded text-sm font-mono h-20"
                                                    placeholder="Return value..."
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <div className="w-48">
                        <Button type="submit" disabled={loading} className="flex items-center justify-center gap-2">
                            <Save className="w-4 h-4" />
                            {loading ? 'Saving...' : 'Save Question'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminAddQuestion;
