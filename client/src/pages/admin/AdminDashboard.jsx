import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users, FileText, CheckCircle, BarChart as BarChartIcon, TrendingUp, Activity } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/analytics/admin');
                setStats(res.data.data);
            } catch (err) {
                console.error("Failed to fetch admin stats", err);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-8">Loading Dashboard...</div>;
    if (error) return <div className="p-8 text-red-500">{error}</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">Platform Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Students"
                    value={stats?.users || 0}
                    icon={<Users className="w-6 h-6 text-blue-600" />}
                    color="bg-blue-50 border-blue-100"
                />
                <StatCard
                    title="Active Tests"
                    value={stats?.tests || 0}
                    icon={<FileText className="w-6 h-6 text-purple-600" />}
                    color="bg-purple-50 border-purple-100"
                />
                <StatCard
                    title="Total Attempts"
                    value={stats?.attempts || 0}
                    icon={<Activity className="w-6 h-6 text-orange-600" />}
                    color="bg-orange-50 border-orange-100"
                />
                <StatCard
                    title="Avg Pass Rate"
                    value={`${stats?.passRate || 0}%`}
                    icon={<TrendingUp className="w-6 h-6 text-green-600" />}
                    color="bg-green-50 border-green-100"
                />
            </div>

            {/* Detailed Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-lg text-gray-700 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-3">
                            <span className="p-2 bg-white rounded shadow-sm"><FileText className="w-4 h-4" /></span>
                            Create New Test
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 transition-colors flex items-center gap-3">
                            <span className="p-2 bg-white rounded shadow-sm"><CheckCircle className="w-4 h-4" /></span>
                            Add Question to Bank
                        </button>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-lg text-gray-700 mb-4">System Health</h3>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-gray-600">Database Connection: <strong>Stable</strong></span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-gray-600">API Server: <strong>Online</strong></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className={`p-6 rounded-xl border ${color} shadow-sm transition-all hover:shadow-md`}>
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
                <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
            </div>
            <div className="p-2 bg-white rounded-lg shadow-sm">
                {icon}
            </div>
        </div>
    </div>
);

export default AdminDashboard;
