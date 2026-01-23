import React, { useState } from 'react';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import { Upload, FileText, CheckCircle, AlertCircle, FileCheck } from 'lucide-react';

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
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">ATS Resume Scanner</h1>
                    <p className="text-gray-500 mt-2">Check your resume against ATS algorithms and job descriptions</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Input Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Upload className="w-5 h-5 text-primary" /> Upload Resume
                        </h2>

                        <div className="space-y-6">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors relative">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                {file ? (
                                    <div className="text-primary font-medium flex flex-col items-center">
                                        <FileCheck className="w-10 h-10 mb-2" />
                                        {file.name}
                                    </div>
                                ) : (
                                    <div className="text-gray-400 flex flex-col items-center">
                                        <Upload className="w-10 h-10 mb-2" />
                                        <span>Click to upload PDF</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description (Optional)</label>
                                <textarea
                                    className="w-full p-3 border rounded-lg bg-gray-50 text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                    rows="6"
                                    placeholder="Paste the job description here to check for specific keywords..."
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                ></textarea>
                            </div>

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <Button onClick={handleScan} disabled={loading} className="w-full py-3">
                                {loading ? 'Scanning...' : 'Scan Resume'}
                            </Button>
                        </div>
                    </div>

                    {/* Right: Results */}
                    {result ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" /> Analysis Report
                            </h2>

                            <div className="text-center mb-8">
                                <div className="text-gray-500 text-sm mb-2">ATS Match Score</div>
                                <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                                    <div className={`text-3xl font-bold ${result.score >= 80 ? 'text-green-600' :
                                        result.score >= 50 ? 'text-yellow-600' : 'text-red-500'
                                        }`}>
                                        {result.score}%
                                    </div>
                                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                        <circle cx="64" cy="64" r="60" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                                        <circle
                                            cx="64" cy="64" r="60" fill="none"
                                            stroke={result.score >= 80 ? '#059669' : result.score >= 50 ? '#d97706' : '#ef4444'}
                                            strokeWidth="8"
                                            strokeDasharray="377"
                                            strokeDashoffset={377 - (377 * result.score) / 100}
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-gray-700 mt-4 px-4">{result.feedback}</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold text-green-700 mb-2 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" /> Matched Keywords
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.matchedKeywords.length > 0 ? (
                                            result.matchedKeywords.map((k, i) => (
                                                <span key={i} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-100 uppercase font-medium">
                                                    {k}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">No keywords matched</span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-red-600 mb-2 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4" /> Missing Keywords
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {result.missingKeywords.length > 0 ? (
                                            result.missingKeywords.map((k, i) => (
                                                <span key={i} className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded-full border border-red-100 uppercase font-medium">
                                                    {k}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-xs text-green-600 italic">No missing keywords!</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-100 rounded-xl border-2 border-dashed border-gray-200 p-6 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p>Result will appear here after scanning</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeScan;
