import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import useAuthStore from '../../store/useAuthStore';
import { Play, Clock, FileText, TrendingUp, Award, Activity, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const { user, logout } = useAuthStore();
    const [tests, setTests] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch recommended tests
                const testsRes = await api.get('/tests');
                setTests(testsRes.data.data);

                // Fetch Analytics
                const analyticsRes = await api.get('/analytics/student');
                setAnalytics(analyticsRes.data.data);
            } catch (err) {
                console.error("Error fetching dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Prepare Chart Data
    const performanceData = {
        labels: analytics?.history?.map((h, i) => `Test ${i + 1}`) || [],
        datasets: [
            {
                label: 'Accuracy (%)',
                data: analytics?.history?.map(h => h.accuracy) || [],
                borderColor: 'rgb(79, 70, 229)',
                backgroundColor: 'rgba(79, 70, 229, 0.5)',
                tension: 0.3
            },
        ],
    };

    const subjectData = {
        labels: analytics?.subjectAnalysis?.map(s => s.subject) || [],
        datasets: [
            {
                label: 'Subject Proficiency (%)',
                data: analytics?.subjectAnalysis?.map(s => s.accuracy) || [],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                ],
            },
        ],
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center fixed w-full z-10 top-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
                    <span className="font-bold text-xl text-gray-800">Placement Saathi</span>
                </div>
                <div className="flex items-center gap-6">
                    <span className="text-gray-600 font-medium">Hello, {user?.name}</span>
                    <button onClick={logout} className="text-red-500 font-medium hover:text-red-700">Logout</button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-8 pt-24">
                {/* Hero Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 rounded-lg text-primary">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Tests Taken</p>
                            <h3 className="text-2xl font-bold text-gray-800">{analytics?.stats?.totalTests || 0}</h3>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-green-50 rounded-lg text-green-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Avg. Score</p>
                            <h3 className="text-2xl font-bold text-gray-800">{Math.round(analytics?.stats?.avgScore || 0)}%</h3>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Passed</p>
                            <h3 className="text-2xl font-bold text-gray-800">{analytics?.stats?.totalPass || 0}</h3>
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-primary to-indigo-600 rounded-xl p-6 shadow-lg text-white">
                        <p className="text-indigo-100 text-sm mb-1">Your Rank</p>
                        <h3 className="text-3xl font-bold">Top 10%</h3>
                        <p className="text-xs text-indigo-200 mt-2">Keep practicing to improve!</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all cursor-pointer">
                        <Link to="/scan-resume" className="flex items-center gap-4 w-full h-full">
                            <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">ATS Scanner</h3>
                                <p className="text-sm text-gray-500">Check Resume Score</p>
                            </div>
                        </Link>
                    </div>
                    {/* Roadmap Link */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-all cursor-pointer">
                        <Link to="/roadmap" className="flex items-center gap-4 w-full h-full">
                            <div className="p-3 bg-purple-50 rounded-lg text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                <Map className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Study Roadmap</h3>
                                <p className="text-sm text-gray-500">Personalized Plan</p>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Charts Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Performance Chart */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4">Performance History</h3>
                            {analytics?.history?.length > 0 ? (
                                <Line options={{ responsive: true, plugins: { legend: { display: false } } }} data={performanceData} />
                            ) : (
                                <div className="h-40 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
                                    Take a test to see analytics
                                </div>
                            )}
                        </div>

                        {/* Subject Breakdown */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4">Subject Strength</h3>
                            {analytics?.subjectAnalysis?.length > 0 ? (
                                <Bar options={{ responsive: true, plugins: { legend: { display: false } } }} data={subjectData} />
                            ) : (
                                <div className="h-40 flex items-center justify-center text-gray-400 bg-gray-50 rounded-lg">
                                    No subject data available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: Recommended Tests */}
                    <div className="lg:col-span-1">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Recommended Tests</h2>
                            <Link to="/practice" className="text-primary text-sm font-medium hover:underline">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {tests.slice(0, 3).map(test => (
                                <div key={test._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${test.difficulty === 'Easy' ? 'bg-green-50 text-green-700' :
                                            test.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-700' :
                                                'bg-red-50 text-red-700'
                                            }`}>
                                            {test.difficulty}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-gray-800 mb-1">{test.title}</h4>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {test.duration}m</span>
                                        <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {test.questions.length} Qs</span>
                                    </div>
                                    <Link to={`/test/${test._id}/instructions`}>
                                        <button className="w-full py-2 bg-gray-50 text-primary font-semibold rounded-lg text-sm group-hover:bg-primary group-hover:text-white transition-colors">
                                            Start Test
                                        </button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
