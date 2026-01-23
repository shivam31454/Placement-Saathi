import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus, Search, Filter, Trash2, Edit } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const AdminQuestions = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('');

    useEffect(() => {
        fetchQuestions();
    }, [subjectFilter, difficultyFilter]);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            let query = '/questions?sort=-createdAt';
            if (subjectFilter) query += `&subject=${subjectFilter}`;
            if (difficultyFilter) query += `&difficulty=${difficultyFilter}`;

            const res = await api.get(query);
            setQuestions(res.data.data);
        } catch (err) {
            console.error("Failed to fetch questions", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredQuestions = questions.filter(q =>
        q.content.text.toLowerCase().includes(search.toLowerCase()) ||
        q.topic.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Question Bank</h1>
                    <p className="text-gray-500">Manage all MCQ and Coding questions</p>
                </div>
                <div className="w-40">
                    <Button
                        onClick={() => window.location.href = '/admin/questions/new'}
                        className="flex items-center gap-2 justify-center"
                    >
                        <Plus className="w-4 h-4" /> Add Question
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Total Questions</h3>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{questions.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Coding Problems</h3>
                    <p className="text-3xl font-bold text-purple-600 mt-2">
                        {questions.filter(q => q.type === 'CODING').length}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">MCQs</h3>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">
                        {questions.filter(q => q.type === 'MCQ').length}
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by text or topic..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="border rounded-lg px-4 py-2 focus:outline-none text-gray-600"
                    value={subjectFilter}
                    onChange={(e) => setSubjectFilter(e.target.value)}
                >
                    <option value="">All Subjects</option>
                    <option value="DSA">DSA</option>
                    <option value="DBMS">DBMS</option>
                    <option value="OS">OS</option>
                    <option value="CN">Computer Networks</option>
                </select>
                <select
                    className="border rounded-lg px-4 py-2 focus:outline-none text-gray-600"
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                    <option value="">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>

            {/* Questions Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Question</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Subject / Topic</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Difficulty</th>
                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-8">Loading...</td></tr>
                        ) : filteredQuestions.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-8 text-gray-500">No questions found</td></tr>
                        ) : (
                            filteredQuestions.map((q) => (
                                <tr key={q._id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-800 line-clamp-1 max-w-sm">{q.content.text}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${q.type === 'CODING' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {q.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-600">{q.subject}</div>
                                        <div className="text-xs text-gray-400">{q.topic}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                            q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' :
                                                'bg-red-100 text-red-700 border border-red-200'
                                            }`}>
                                            {q.difficulty}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminQuestions;
