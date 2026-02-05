import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import useAuthStore from '../../store/useAuthStore';
import Button from '../../components/ui/Button';
import { Play, Clock, FileText, TrendingUp, Award, Activity, Map, Search, Bell, BarChart2, Briefcase, Bot, Sparkles, BookOpen, Lightbulb } from 'lucide-react';
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
    BarElement,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingTour from '../../components/guide/OnboardingTour';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Dashboard = () => {
    const { user, logout } = useAuthStore();
    const [tests, setTests] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [graphType, setGraphType] = useState('tests'); // 'tests' or 'leetcode'
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [insights, setInsights] = useState(null);

    useEffect(() => {
        // Check for onboarding
        const hasSeenOnboarding = localStorage.getItem('onboarding_completed');
        if (!hasSeenOnboarding) {
            // Small delay to ensure render is complete
            setTimeout(() => setShowOnboarding(true), 1000);
        }

        const fetchData = async () => {
            try {
                // Fetch recommended tests
                const testsRes = await api.get('/tests');
                setTests(testsRes.data?.data || []);

                // Fetch Analytics (Existing)
                const analyticsRes = await api.get('/analytics/student');
                let analyticsData = analyticsRes.data?.data || {};

                // Fetch LeetCode Analytics
                try {
                    const leetcodeRes = await api.get('/leetcode/analytics');
                    analyticsData.leetcode = leetcodeRes.data.data;
                } catch (lcErr) { /* Ignore */ }

                setAnalytics(analyticsData);

                // Fetch AI Insights
                try {
                    const insightsRes = await api.post('/ai/insights', {
                        testPerformance: analyticsData.history || [],
                        leetCodeStats: analyticsData.leetcode || {}
                    });
                    if (insightsRes.data.success) {
                        setInsights(insightsRes.data);
                    }
                } catch (aiErr) {
                    console.error("Failed to fetch AI insights", aiErr);
                    // Fallback static insights if API fails
                    setInsights({
                        short_summary: "Keep practicing! We're analyzing your data to provide better tips.",
                        action_item: "Try taking a Mock Test to get more data points."
                    });
                }

            } catch (err) {
                console.error("Error fetching dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Prepare Chart Data
    const performanceData = graphType === 'tests' ? {
        labels: analytics?.history?.map((h, i) => `Test ${i + 1}`) || [],
        datasets: [
            {
                label: 'Accuracy (%)',
                data: analytics?.history?.map(h => h.accuracy) || [],
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#6366f1',
                pointBorderWidth: 2,
            },
        ],
    } : {
        labels: analytics?.leetcode?.submissionHistory?.map(h => {
            const date = new Date(h.date);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        }) || [],
        datasets: [
            {
                label: 'Problems Solved',
                data: analytics?.leetcode?.submissionHistory?.map(h => h.count) || [],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#10b981',
                pointBorderWidth: 2,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)',
                },
                ticks: {
                    color: '#94a3b8',
                }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#94a3b8',
                }
            }
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-gray-100 transition-colors duration-300">
            {showOnboarding && <OnboardingTour onComplete={() => setShowOnboarding(false)} />}
            {/* Navbar */}
            <nav className="glass-panel border-x-0 border-t-0 sticky top-0 z-50 px-6 py-4 flex justify-between items-center rounded-none">
                <div className="flex items-center gap-3">
                    <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="w-9 h-9 bg-gradient-to-tr from-primary-600 to-primary-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-primary-500/30 cursor-pointer"
                    >
                        P
                    </motion.div>
                    <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">Placement Saathi</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-white transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-800"></span>
                        </button>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700"></div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-secondary-400 to-secondary-600 flex items-center justify-center text-white font-semibold text-sm">
                            {(user?.name || "U").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium hidden md:block">{user?.name || "User"}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={logout} className="ml-2 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-900/20">
                        Logout
                    </Button>
                </div>
            </nav>

            <motion.div
                className="max-w-7xl mx-auto p-6 md:p-8 space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Greeting & LeetCode Connect */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                            Hello, {user?.name?.split(' ')[0] || 'Student'}! 👋
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your progress overview for today.</p>
                    </div>

                    <div className="flex gap-2 items-center">
                        {analytics?.leetcode?.username ? (
                            <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-xl">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                    Connected: <span className="text-primary-600 font-bold">{analytics.leetcode.username}</span>
                                </span>
                                <button
                                    onClick={() => {
                                        if (confirm("Unlink current LeetCode account?")) {
                                            api.post('/leetcode/username', { username: null }).then(() => window.location.reload());
                                        }
                                    }}
                                    className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline"
                                >
                                    Change
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="LeetCode Username"
                                    id="lc-username"
                                    className="px-4 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-primary-500/50"
                                />
                                <Button onClick={async () => {
                                    const username = document.getElementById('lc-username').value;
                                    if (!username) return;
                                    try {
                                        await api.post('/leetcode/username', { username });
                                        window.location.reload();
                                    } catch (e) { alert("Failed to link LeetCode"); }
                                }}>Link LeetCode</Button>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* AI Insights Widget */}
                <motion.div variants={itemVariants} className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-[1px]">
                    <div className="bg-white dark:bg-slate-900 rounded-[15px] p-6 h-full backdrop-blur-3xl bg-opacity-90 dark:bg-opacity-90 relative overflow-hidden">
                        {/* Shimmer effect if loading insights (optional, but insights might come later) */}
                        <div className="flex items-start gap-4 relative z-10">
                            <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                                <Lightbulb className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                                    AI Performance Insights <span className="text-[10px] bg-primary-500 text-white px-1.5 py-0.5 rounded-full">BETA</span>
                                </h3>
                                {insights ? (
                                    <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed space-y-2">
                                        <p>{insights.short_summary}</p>
                                        <p className="font-semibold text-primary-600 dark:text-primary-400">
                                            💡 Recommendation: {insights.action_item}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="animate-pulse space-y-2 w-full">
                                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Hero Stats */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={Activity}
                        label="Tests Taken"
                        value={analytics?.stats?.totalTests || 0}
                        color="text-primary-600"
                        bg="bg-primary-50 dark:bg-primary-900/20"
                    />
                    <div className="glass-card bg-white dark:bg-slate-800 p-6 rounded-2xl flex flex-col justify-between group">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 group-hover:scale-110 transition-transform">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">LeetCode Solved</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{analytics?.leetcode?.totalSolved?.all || "N/A"}</h3>
                            </div>
                        </div>
                        {analytics?.leetcode?.totalSolved && (
                            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 pt-4">
                                <div className="text-center">
                                    <span className="block font-bold text-green-500">{analytics.leetcode.totalSolved.easy}</span>
                                    <span>Easy</span>
                                </div>
                                <div className="text-center border-x border-slate-100 dark:border-slate-700 px-4">
                                    <span className="block font-bold text-yellow-500">{analytics.leetcode.totalSolved.medium}</span>
                                    <span>Med</span>
                                </div>
                                <div className="text-center">
                                    <span className="block font-bold text-red-500">{analytics.leetcode.totalSolved.hard}</span>
                                    <span>Hard</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <StatCard
                        icon={Award}
                        label="Tests Passed"
                        value={analytics?.stats?.totalPass || 0}
                        color="text-amber-600"
                        bg="bg-amber-50 dark:bg-amber-900/20"
                    />

                    <motion.div
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-2xl p-6 shadow-xl shadow-primary-500/20 text-white relative overflow-hidden group cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-all duration-500 rotate-12 group-hover:rotate-45">
                            <Award className="w-24 h-24" />
                        </div>
                        <p className="text-indigo-100 text-sm font-medium mb-1 relative z-10">Your Rank</p>
                        <h3 className="text-3xl font-bold mb-2 relative z-10">Top 10%</h3>
                        <div className="w-full bg-white/20 rounded-full h-1.5 mb-2 relative z-10">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "90%" }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="bg-white h-1.5 rounded-full"
                            ></motion.div>
                        </div>
                        <p className="text-xs text-indigo-100/80 relative z-10">You're doing great! Keep it up.</p>
                    </motion.div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <QuickActionCard
                        to="/scan-resume"
                        icon={FileText}
                        title="ATS Resume Scanner"
                        desc="Check your resume score."
                        color="text-blue-600"
                        bg="bg-blue-50 dark:bg-blue-900/20"
                        gradient="from-blue-500/10 to-blue-600/5 dark:from-blue-900/20 dark:to-blue-800/10"
                    />
                    <QuickActionCard
                        to="/roadmap"
                        icon={Map}
                        title="Study Roadmap"
                        desc="Your personalized plan."
                        color="text-purple-600"
                        bg="bg-purple-50 dark:bg-purple-900/20"
                        gradient="from-purple-500/10 to-purple-600/5 dark:from-purple-900/20 dark:to-purple-800/10"
                    />
                    <QuickActionCard
                        to="/mock-interview"
                        icon={Bot}
                        title="AI Mock Interview"
                        desc="Practice with AI voice."
                        color="text-emerald-600"
                        bg="bg-emerald-50 dark:bg-emerald-900/20"
                        gradient="from-emerald-500/10 to-emerald-600/5 dark:from-emerald-900/20 dark:to-emerald-800/10"
                    />
                    <QuickActionCard
                        to="/learning"
                        icon={BookOpen}
                        title="Structured Learning"
                        desc="Master CS subjects."
                        color="text-teal-600"
                        bg="bg-teal-50 dark:bg-teal-900/20"
                        gradient="from-teal-500/10 to-teal-600/5 dark:from-teal-900/20 dark:to-teal-800/10"
                    />
                </motion.div>

                {/* LeetCode Analysis Section */}
                {analytics?.leetcode && (
                    <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="glass-card p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-primary-500" />
                                Topic Strength Analysis
                            </h3>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {analytics.leetcode.analyzedTags.map((tag, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <div className="w-24 text-sm font-medium truncate" title={tag.tagName}>{tag.tagName}</div>
                                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${tag.score * 10}%` }}
                                                transition={{ duration: 1, delay: 0.2 + idx * 0.05 }}
                                                className={`h-full rounded-full ${tag.status === 'Strong' ? 'bg-green-500' :
                                                    tag.status === 'Average' ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                            ></motion.div>
                                        </div>
                                        <div className="w-12 text-xs font-bold text-right">{tag.score}/10</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Question Recommendations */}
                        <div className="glass-card p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Bot className="w-5 h-5 text-indigo-500" />
                                Recommended Practice
                            </h3>
                            {analytics.leetcode.recommendations?.length > 0 ? (
                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {analytics.leetcode.recommendations.map((rec, i) => (
                                        <div key={i}>
                                            <p className="text-xs font-bold text-slate-500 uppercase mb-2">
                                                Weak Topic: <span className="text-red-500">{rec.topic}</span>
                                            </p>
                                            <div className="space-y-2">
                                                {rec.problems.map((prob, j) => (
                                                    <a
                                                        key={j}
                                                        href={`https://leetcode.com/problems/${prob.titleSlug}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block p-3 bg-white dark:bg-slate-900 rounded-lg hover:shadow-md transition-all border border-slate-100 dark:border-slate-800 group"
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-medium group-hover:text-primary-600 transition-colors">{prob.title}</span>
                                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${prob.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                                                prob.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                                }`}>{prob.difficulty}</span>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <Sparkles className="w-8 h-8 mb-2 text-yellow-500" />
                                    <p>Great job! No weak topics detected.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Charts Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Performance Chart */}
                        <div className="glass-card p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-800 dark:text-white">Performance History</h3>
                                <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                                    <button
                                        onClick={() => setGraphType('tests')}
                                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${graphType === 'tests' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'}`}
                                    >
                                        Tests
                                    </button>
                                    <button
                                        onClick={() => setGraphType('leetcode')}
                                        disabled={!analytics?.leetcode}
                                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${graphType === 'leetcode' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'} ${!analytics?.leetcode && 'opacity-50 cursor-not-allowed'}`}
                                    >
                                        LeetCode
                                    </button>
                                </div>
                            </div>

                            {(graphType === 'tests' && analytics?.history?.length > 0) || (graphType === 'leetcode' && analytics?.leetcode?.submissionHistory?.length > 0) ? (
                                <div className="h-64">
                                    <Line options={chartOptions} data={performanceData} />
                                </div>
                            ) : (
                                <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                    <Activity className="w-8 h-8 mb-2 opacity-50" />
                                    <p>No data available for this view</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: Recommended Tests */}
                    <div className="lg:col-span-1">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Recommended Tests</h2>
                            <Link to="/practice" className="text-primary-600 hover:text-primary-700 text-sm font-medium hover:underline">View All</Link>
                        </div>
                        <div className="space-y-4">
                            {tests.slice(0, 3).map(test => (
                                <div key={test._id} className="glass-card p-5 rounded-2xl border-l-4 border-l-primary-500 group cursor-pointer hover:bg-white dark:hover:bg-slate-800 transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${test.difficulty === 'Easy' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            test.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {test.difficulty}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-slate-800 dark:text-white mb-1 group-hover:text-primary-600 transition-colors">{test.title}</h4>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-4">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {test.duration}m</span>
                                        <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {test.questions.length} Qs</span>
                                    </div>
                                    <Link to={`/test/${test._id}/instructions`}>
                                        <Button variant="secondary" size="sm" className="w-full">
                                            Start Test
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
    <div className="glass-card bg-white dark:bg-slate-800 p-6 rounded-2xl flex items-center gap-4 group">
        <div className={`p-3 rounded-xl ${bg} ${color} group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
        </div>
    </div>
);

const QuickActionCard = ({ to, icon: Icon, title, desc, color, bg, gradient }) => (
    <Link to={to}>
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className={`glass-card bg-white dark:bg-slate-800 p-6 rounded-2xl relative overflow-hidden group h-full flex items-center gap-5`}
        >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-50 group-hover:opacity-100 transition-opacity`}></div>

            <div className={`p-4 rounded-xl ${bg} ${color} relative z-10 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-8 h-8" />
            </div>
            <div className="relative z-10 flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
            </div>
            <div className="relative z-10">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm group-hover:translate-x-1 transition-transform">
                    <Play className="w-4 h-4 text-slate-400 group-hover:text-primary-600" />
                </div>
            </div>
        </motion.div>
    </Link>
);

export default Dashboard;
