import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus, Clock, FileText, Play } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const AdminTests = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const res = await api.get('/tests');
            setTests(res.data.data);
        } catch (err) {
            console.error("Failed to fetch tests", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Mock Tests</h1>
                    <p className="text-gray-500">Create and manage assessment modules</p>
                </div>
                <div className="w-40">
                    <Link to="/admin/tests/new">
                        <Button className="flex items-center gap-2 justify-center">
                            <Plus className="w-4 h-4" /> Create Test
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p>Loading tests...</p>
                ) : tests.length === 0 ? (
                    <p className="text-gray-500">No tests created yet.</p>
                ) : (
                    tests.map(test => (
                        <div key={test._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-indigo-50 p-3 rounded-lg">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${test.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                        test.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                    }`}>
                                    {test.difficulty}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-gray-800 mb-2">{test.title}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{test.description}</p>

                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{test.duration} mins</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FileText className="w-4 h-4" />
                                    <span>{test.questions.length} Qs</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button variant="outline" className="text-sm py-1">Edit</Button>
                                <Button className="text-sm py-1">Details</Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminTests;
