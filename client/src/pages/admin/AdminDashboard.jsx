import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        testsCreated: 0,
        activeUsers: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            console.log('Fetching dashboard stats...');
            try {
                const response = await adminService.getDashboardStats();
                console.log('Stats fetched successfully:', response);
                if (response && response.data) {
                    setStats(response.data);
                } else {
                    console.error('Invalid response structure:', response);
                }
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="text-white text-center mt-10">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium">Total Students</h3>
                    <p className="text-3xl font-bold text-white mt-2">{stats.totalStudents}</p>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium">Tests Created</h3>
                    <p className="text-3xl font-bold text-white mt-2">{stats.testsCreated}</p>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium">Active Users</h3>
                    <p className="text-3xl font-bold text-white mt-2">{stats.activeUsers}</p>
                </div>
            </div>

            <div className="mt-8 bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
                <div className="text-gray-400">
                    {/* Placeholder for future activity log */}
                    No recent activity to show.
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
