import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import learningService from '../../services/learningService';

const LearningDashboard = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await learningService.getSubjects();
                if (res.success) {
                    setSubjects(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch subjects", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, []);

    if (loading) return <div className="text-white text-center mt-10">Loading subjects...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Learning Modules</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {subjects.map((subject) => (
                    <div
                        key={subject._id}
                        onClick={() => navigate(`/learning/${subject._id}`)}
                        className="bg-gray-800 rounded-xl p-6 cursor-pointer hover:bg-gray-700 transition-colors border border-gray-700 hover:border-blue-500 shadow-lg"
                    >
                        <div className="text-4xl mb-4">{subject.icon || '📚'}</div>
                        <h2 className="text-xl font-semibold text-white mb-2">{subject.name}</h2>
                        <p className="text-gray-400 text-sm line-clamp-3">{subject.description || 'Start learning ' + subject.name}</p>
                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-blue-400 text-sm font-medium">Start Learning →</span>
                        </div>
                    </div>
                ))}
            </div>
            {subjects.length === 0 && (
                <div className="text-center text-gray-500 mt-10">
                    No subjects found. Use Admin Panel to add subjects.
                </div>
            )}
        </div>
    );
};

export default LearningDashboard;
