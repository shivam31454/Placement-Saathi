import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { CheckCircle, Circle, ArrowRight, BookOpen, Map } from 'lucide-react';

const StudyRoadmap = () => {
    const [roadmap, setRoadmap] = useState([]);
    const [loading, setLoading] = useState(true);

    // Simple local state for checked items (non-persistent for MVP)
    const [completedTasks, setCompletedTasks] = useState({});

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const res = await api.get('/analytics/roadmap');
                setRoadmap(res.data.data);
            } catch (err) {
                console.error("Failed to fetch roadmap", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRoadmap();
    }, []);

    const toggleTask = (weekIndex, taskIndex) => {
        const key = `${weekIndex}-${taskIndex}`;
        setCompletedTasks(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Plan...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-3">
                        <Map className="w-8 h-8 text-primary" /> Personalized Study Plan
                    </h1>
                    <p className="text-gray-500 mt-2">A tailored roadmap based on your recent performance analysis</p>
                </div>

                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                    {roadmap.map((week, wIdx) => (
                        <div key={wIdx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            {/* Icon */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-slate-300 group-[.is-active]:bg-primary group-[.is-active]:text-white text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                <span className="font-bold">{week.week}</span>
                            </div>

                            {/* Card */}
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-lg text-gray-800">{week.title}</span>
                                    <span className="px-2 py-0.5 text-xs font-bold rounded bg-indigo-50 text-indigo-700 uppercase tracking-wider">{week.focus}</span>
                                </div>
                                <p className="text-gray-500 text-sm mb-4">{week.description}</p>

                                <div className="space-y-3">
                                    {week.tasks.map((task, tIdx) => {
                                        const isDone = completedTasks[`${wIdx}-${tIdx}`];
                                        return (
                                            <div
                                                key={tIdx}
                                                onClick={() => toggleTask(wIdx, tIdx)}
                                                className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${isDone ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-100 hover:border-indigo-200'
                                                    }`}
                                            >
                                                {isDone ? (
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <Circle className="w-5 h-5 text-gray-400" />
                                                )}
                                                <span className={`text-sm ${isDone ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                                                    {task}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StudyRoadmap;
