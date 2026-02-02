import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Search, Filter, ThumbsUp, MessageSquare, Briefcase, Calendar, User, ChevronRight, ArrowLeft, Tag, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const InterviewExperiences = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const [experiences, setExperiences] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchExperiences();
    }, [filter]); // Re-fetch when filter changes (if backend supports it, or filter locally)

    const fetchExperiences = async () => {
        setIsLoading(true);
        try {
            // Construct query params
            // Construct query params
            let url = '/experiences';
            if (filter !== 'All') {
                url += `?status=${filter}`;
            }

            const response = await api.get(url);
            setExperiences(response.data.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching experiences:", err);
            setError("Failed to load experiences. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    // Filter locally for search term (since backend search implementation might be simple)
    const filteredExperiences = experiences.filter(exp =>
        exp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg transition-colors duration-300 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <Link to="/dashboard" className="inline-flex items-center text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors mb-6 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3"
                        >
                            <Briefcase className="w-3 h-3" /> Community Insights
                        </motion.div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Interview Experiences</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">Learn from the community. Real stories, real questions, real success.</p>
                    </div>

                    <Button icon={Briefcase} className="shadow-lg shadow-primary-500/20" onClick={() => alert("Feature coming soon: Share your experience!")}>
                        Share Your Experience
                    </Button>
                </div>

                {/* Search & Filter */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="md:col-span-3 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by company (e.g., 'Amazon') or role..."
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none appearance-none cursor-pointer"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Selected">Selected</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                {/* Content Area */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                        <Button onClick={fetchExperiences} variant="outline" className="border-red-200 hover:bg-red-100">Try Again</Button>
                    </div>
                ) : (
                    <>
                        {/* Experiences Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AnimatePresence>
                                {filteredExperiences.map((exp, index) => (
                                    <motion.div
                                        key={exp._id} // Use MongoDB _id
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <ExperienceCard experience={exp} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {filteredExperiences.length === 0 && (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No experiences found</h3>
                                <p className="text-slate-500 dark:text-slate-400">Be the first to share your experience!</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const ExperienceCard = ({ experience }) => (
    <Card hover className="p-6 h-full flex flex-col group cursor-pointer border-t-4 border-t-transparent hover:border-t-primary-500 transition-all">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex items-center justify-center shadow-sm">
                    <span className="font-bold text-xl text-primary-600">{experience.company.charAt(0)}</span>
                </div>
                <div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">{experience.company}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{experience.role}</p>
                </div>
            </div>
            <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${experience.offerStatus === 'Selected'
                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                {experience.offerStatus}
            </span>
        </div>

        <div className="flex items-center gap-4 mb-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {experience.author}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(experience.date).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {experience.difficulty}</span>
        </div>

        <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 line-clamp-3">
            {experience.content.substring(0, 150)}...
        </p>

        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <div className="flex gap-4">
                <button className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-primary-600 transition-colors">
                    <ThumbsUp className="w-4 h-4" /> {experience.likes}
                </button>
                <button className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-primary-600 transition-colors">
                    <MessageSquare className="w-4 h-4" /> 0
                </button>
            </div>
            <button className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                Read Full Story <ChevronRight className="w-3 h-3" />
            </button>
        </div>
    </Card>
);

export default InterviewExperiences;
