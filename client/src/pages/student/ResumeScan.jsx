import React, { useState } from 'react';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { Upload, FileText, CheckCircle, AlertCircle, FileCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ResumeScan = () => {
    const [file, setFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected && selected.type === 'application/pdf') {
            setFile(selected);
            setError('');
        } else {
            console.error(e.target.files)
            setError('Please select a valid PDF file.');
        }
    };

    const handleScan = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Resume file is required');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('resume', file);
        if (jobDescription) formData.append('jobDescription', jobDescription);

        try {
            const res = await api.post('/resume/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(res.data.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to analyze resume. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg transition-colors duration-300 p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                <Link to="/dashboard" className="inline-flex items-center text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors mb-6 group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </Link>

                <div className="mb-8 text-center max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center justify-center p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl mb-4 text-primary-600 dark:text-primary-400"
                    >
                        <FileText className="w-8 h-8" />
                    </motion.div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">ATS Resume Scanner</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                        Optimize your resume for Applicant Tracking Systems. Get instant feedback on keywords and formatting.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left: Input Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="p-6 md:p-8 h-full">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                <Upload className="w-5 h-5 text-primary-600" /> Upload Resume
                            </h2>

                            <div className="space-y-6">
                                <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 relative group ${file
                                        ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/10'
                                        : 'border-slate-300 dark:border-slate-700 hover:border-primary-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                    }`}>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    {file ? (
                                        <div className="text-primary-600 dark:text-primary-400 font-medium flex flex-col items-center animate-fade-in-up">
                                            <div className="bg-white dark:bg-slate-800 p-3 rounded-full shadow-lg mb-3">
                                                <FileCheck className="w-8 h-8" />
                                            </div>
                                            <p className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{file.name}</p>
                                            <p className="text-sm opacity-80">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            <p className="text-xs text-slate-500 mt-2">Click to replace</p>
                                        </div>
                                    ) : (
                                        <div className="text-slate-400 dark:text-slate-500 flex flex-col items-center">
                                            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                                                <Upload className="w-8 h-8" />
                                            </div>
                                            <span className="font-medium text-slate-600 dark:text-slate-300">Click to upload PDF</span>
                                            <span className="text-xs mt-1">or drag and drop here</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                                        Job Description <span className="text-slate-400 font-normal">(Optional)</span>
                                    </label>
                                    <textarea
                                        className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none resize-none transition-all placeholder:text-slate-400"
                                        rows="6"
                                        placeholder="Paste the job description here to check for specific keyword matches..."
                                        value={jobDescription}
                                        onChange={(e) => setJobDescription(e.target.value)}
                                    ></textarea>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-2" />
                                        {error}
                                    </div>
                                )}

                                <Button
                                    onClick={handleScan}
                                    disabled={loading}
                                    className="w-full py-4 text-lg shadow-lg shadow-primary-500/20"
                                    isLoading={loading}
                                >
                                    {loading ? 'Analyzing with AI...' : 'Scan Resume'}
                                </Button>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Right: Results */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {result ? (
                            <Card className="h-full p-6 md:p-8 border-t-4 border-t-primary-500">
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary-600" /> Analysis Report
                                </h2>

                                <div className="text-center mb-10">
                                    <div className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider mb-4">ATS Match Score</div>
                                    <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                                        <div className={`text-4xl font-bold ${result.score >= 80 ? 'text-green-600 dark:text-green-400' :
                                            result.score >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500 dark:text-red-400'
                                            }`}>
                                            {result.score}%
                                        </div>
                                        <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                            <circle cx="80" cy="80" r="70" fill="none" stroke="currentColor" strokeWidth="12" className="text-slate-100 dark:text-slate-800" />
                                            <circle
                                                cx="80" cy="80" r="70" fill="none"
                                                stroke={result.score >= 80 ? '#059669' : result.score >= 50 ? '#d97706' : '#ef4444'}
                                                strokeWidth="12"
                                                strokeDasharray="440"
                                                strokeDashoffset={440 - (440 * result.score) / 100}
                                                strokeLinecap="round"
                                                className="transition-all duration-1000 ease-out"
                                            />
                                        </svg>
                                    </div>
                                    <p className="text-base font-medium text-slate-700 dark:text-slate-300 mt-6 px-4 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                                        "{result.feedback}"
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-sm font-bold text-green-700 dark:text-green-400 mb-3 flex items-center gap-2 uppercase tracking-wide">
                                            <CheckCircle className="w-4 h-4" /> Matched Keywords
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {result.matchedKeywords.length > 0 ? (
                                                result.matchedKeywords.map((k, i) => (
                                                    <span key={i} className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded-full border border-green-100 dark:border-green-900/30 uppercase font-bold">
                                                        {k}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-sm text-slate-400 italic pl-1">No specific keywords matched</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2 uppercase tracking-wide">
                                            <AlertCircle className="w-4 h-4" /> Missing Keywords
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {result.missingKeywords.length > 0 ? (
                                                result.missingKeywords.map((k, i) => (
                                                    <span key={i} className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-full border border-red-100 dark:border-red-900/30 uppercase font-bold">
                                                        {k}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-sm text-green-600 dark:text-green-400 italic pl-1">Great job! No important keywords missing.</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <Card className="h-full flex items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
                                <div className="text-center max-w-xs">
                                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <FileText className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Ready to Analyze</h3>
                                    <p className="text-slate-500 dark:text-slate-400">
                                        Upload your resume to see how well it matches the job description.
                                    </p>
                                </div>
                            </Card>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ResumeScan;
