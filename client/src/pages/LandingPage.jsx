import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, BarChart2, Code, FileText, Map, Shield, Zap } from 'lucide-react';
import { m, LazyMotion, domAnimation } from 'framer-motion';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white overflow-x-hidden">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-200"></div>
                            <div className="relative w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center border border-white/10">
                                <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-tr from-indigo-400 to-purple-400">P</span>
                            </div>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-100">Placement Saathi</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                        <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
                        <a href="#demo" className="hover:text-indigo-400 transition-colors">Live Demo</a>
                        <a href="#testimonials" className="hover:text-indigo-400 transition-colors">Stories</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-slate-300 hover:text-white font-medium text-sm transition-colors">Sign In</Link>
                        <Link to="/signup">
                            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-full font-medium text-sm transition-all shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_-5px_rgba(99,102,241,0.6)] hover:-translate-y-0.5">
                                Get Started
                            </button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-40 pb-32 px-8 relative">
                {/* Background Blobs */}
                <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-8 animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        AI-Powered Resume ATS Scanner Live Now
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
                        Crack Your Dream <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">Placement Drive.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
                        The ultimate preparation platform designed by industry experts. Practice coding, check your resume score, and get a personalized study roadmap.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link to="/signup" className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-indigo-600 px-8 font-medium text-white transition-all duration-300 hover:bg-indigo-700 hover:scale-105 hover:ring-2 hover:ring-indigo-400 hover:ring-offset-2 hover:ring-offset-slate-900">
                            <span className="mr-2">Start Practicing Free</span>
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                        </Link>

                        <a href="#features" className="group inline-flex h-12 items-center justify-center rounded-full bg-white/5 px-8 font-medium text-white transition-colors hover:bg-white/10 border border-white/10 backdrop-blur-sm">
                            Explore Features
                        </a>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="mt-20 p-2 bg-gradient-to-b from-white/10 to-transparent rounded-2xl border border-white/10 backdrop-blur-sm shadow-2xl shadow-indigo-500/10 transform rotate-x-12 perspective-1000">
                        <div className="bg-slate-900 rounded-xl overflow-hidden aspect-[16/9] relative group">
                            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="grid grid-cols-2 gap-4 opacity-50 blur-sm scale-95 group-hover:blur-0 group-hover:scale-100 transition-all duration-500">
                                        <div className="bg-slate-800 p-4 rounded-lg w-64 h-32"></div>
                                        <div className="bg-slate-800 p-4 rounded-lg w-64 h-32"></div>
                                        <div className="bg-slate-800 p-4 rounded-lg w-64 h-32"></div>
                                        <div className="bg-slate-800 p-4 rounded-lg w-64 h-32"></div>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-indigo-400 font-mono text-sm bg-indigo-950/80 px-4 py-2 rounded-full border border-indigo-500/30">Dashboard Preview</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats/Social Proof */}
            <section className="py-10 border-y border-white/5 bg-white/[0.02]">
                <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <Stat number="10k+" label="Questions" />
                    <Stat number="500+" label="Tests Taken" />
                    <Stat number="95%" label="Placement Rate" />
                    <Stat number="24/7" label="AI Support" />
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 bg-slate-950 relative">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything you need to <span className="text-indigo-400">succeed</span></h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">Don't rely on luck. Our platform provides the data-driven tools you need to clear technical rounds.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard
                            icon={<Code className="w-6 h-6" />}
                            title="Pro Coding Environment"
                            desc="Write, compile, and debug code in our integrated Monaco Editor. Supports multiple languages with Syntax Highlighting."
                        />
                        <FeatureCard
                            icon={<BarChart2 className="w-6 h-6" />}
                            title="Performance Analytics"
                            desc="Go beyond scores. Analyze your accuracy per topic using advanced chart visualizations."
                        />
                        <FeatureCard
                            icon={<FileText className="w-6 h-6" />}
                            title="AI Resume Scanner"
                            desc="Upload your resume and get an instant ATS score. Find missing keywords before the recruiter does."
                            highlight
                        />
                        <FeatureCard
                            icon={<Map className="w-6 h-6" />}
                            title="Personalized Roadmap"
                            desc="Our AI identifies your weak subjects and builds a week-by-week study plan just for you."
                        />
                        <FeatureCard
                            icon={<Zap className="w-6 h-6" />}
                            title="Real-time Mock Tests"
                            desc="Experience the pressure of real exams with timed tests, full-screen security mode, and instant results."
                        />
                        <FeatureCard
                            icon={<Shield className="w-6 h-6" />}
                            title="Verified Content"
                            desc="Questions curated from actual placement papers of top product-based and service-based companies."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10 bg-slate-950">
                <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-sm">© 2024 Placement Saathi. Built for greatness.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">Terms</a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const Stat = ({ number, label }) => (
    <div>
        <h4 className="text-3xl font-bold text-white mb-1">{number}</h4>
        <p className="text-indigo-200/50 text-sm uppercase tracking-wider font-medium">{label}</p>
    </div>
);

const FeatureCard = ({ icon, title, desc, highlight }) => (
    <div className={`p-8 rounded-2xl border transition-all duration-300 hover:-translate-y-1 group ${highlight ? 'bg-indigo-900/10 border-indigo-500/30 hover:bg-indigo-900/20' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'}`}>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${highlight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-300 group-hover:text-white group-hover:bg-indigo-600 transition-colors'}`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed text-sm">
            {desc}
        </p>
    </div>
);

export default LandingPage;
