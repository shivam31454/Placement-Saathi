import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { ArrowLeft } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const StudentPerformance = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [performanceData, setPerformanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                const response = await adminService.getStudentPerformance(id);
                setPerformanceData(response.data);
            } catch (error) {
                console.error("Error fetching performance:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPerformance();
    }, [id]);

    if (loading) return <div className="text-white text-center mt-10">Loading performance data...</div>;

    // Process data for Chart
    // Assuming performanceData is sorted by date ascending (or we assume the API did it)
    // The API returns most recent first, so we might want to reverse for the graph
    const sortedData = [...performanceData].reverse();

    const chartData = {
        labels: sortedData.map(result => new Date(result.completedAt).toLocaleDateString()),
        datasets: [
            {
                label: 'Test Score (%)',
                data: sortedData.map(result => result.accuracy), // Using accuracy as the comparative metric
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: 'white' }
            },
            title: {
                display: true,
                text: 'Student Performance History',
                color: 'white',
                font: { size: 16 }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: 'gray' }
            },
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                ticks: { color: 'gray' }
            }
        }
    };

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate('/admin/students')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Students
            </button>

            <h1 className="text-3xl font-bold text-white">Student Performance</h1>

            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                {performanceData.length > 0 ? (
                    <div className="h-[400px]">
                        <Line options={options} data={chartData} />
                    </div>
                ) : (
                    <div className="text-center text-gray-400 py-10">
                        This student has not taken any tests yet.
                    </div>
                )}
            </div>

            {/* Detailed Table */}
            {performanceData.length > 0 && (
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden mt-6">
                    <h2 className="text-xl font-bold text-white p-6 border-b border-gray-700">Test History</h2>
                    <table className="w-full text-left">
                        <thead className="bg-gray-750 border-b border-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-gray-400 font-medium">Test Name</th>
                                <th className="px-6 py-3 text-gray-400 font-medium">Date</th>
                                <th className="px-6 py-3 text-gray-400 font-medium">Score</th>
                                <th className="px-6 py-3 text-gray-400 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {performanceData.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-700/50">
                                    <td className="px-6 py-4 text-white">{item.test?.title || 'Unknown Test'}</td>
                                    <td className="px-6 py-4 text-gray-400">{new Date(item.completedAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-white font-mono">
                                        {item.score}/{item.totalMarks} <span className="text-gray-500 text-sm">({item.accuracy}%)</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${item.status === 'Pass' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default StudentPerformance;
