import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Code, FileText, Map, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-white transition-colors duration-300">
            {/* Navbar */}
            <nav className="fixed w-full z-50 glass-panel border-b-0 rounded-none top-0">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-200"></div>
                            <div className="relative w-10 h-10 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center border border-slate-200 dark:border-white/10">
                                <span className="font-bold text-xl text-transparent bg-clip-text bg-gradient-to-tr from-primary-600 to-secondary-500">P</span>
                            </div>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-slate-100">Placement <span className="text-primary-600">Saathi</span></span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-400">
                        <a href="#features" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Features</a>
                        <a href="#demo" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Live Demo</a>
                        <a href="#stats" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Stats</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost" size="sm">Sign In</Button>
                        </Link>
                        <Link to="/signup">
                            <Button variant="primary" size="sm">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-48 pb-32 px-6 relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>
                <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-secondary-600/10 rounded-full blur-[120px] pointer-events-none animate-float"></div>

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-500/30 text-primary-700 dark:text-primary-300 text-xs font-medium mb-8"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                        </span>
                        AI-Powered Resume ATS Scanner Live Now
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.15] text-slate-900 dark:text-white"
                    >
                        Master Your Next <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-600 to-secondary-500 animate-gradient-x">Placement Drive.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mb-12 leading-relaxed"
                    >
                        The ultimate preparation platform designed by industry experts. Practice coding, optimize your resume, and get a personalized path to your dream job.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                    >
                        <Link to="/signup">
                            <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-4 shadow-xl shadow-primary-500/20">
                                Start Practicing Free <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <a href="#features">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50">
                                Explore Features
                            </Button>
                        </a>
                    </motion.div>


                </div>
            </section>

            {/* Stats/Social Proof */}
            <section id="stats" className="py-12 border-y border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <Stat number="10k+" label="Questions" delay={0} />
                    <Stat number="500+" label="Tests Taken" delay={0.1} />
                    <Stat number="95%" label="Placement Rate" delay={0.2} />
                    <Stat number="24/7" label="AI Support" delay={0.3} />
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 relative transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-primary-600 font-semibold tracking-wider uppercase text-sm">Why Choose Us</span>
                        <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-6 text-slate-900 dark:text-white">Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">succeed</span></h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">Don't leave your career to chance. We provide the professional tools you need to clear technical rounds.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Code className="w-6 h-6" />}
                            title="Pro Coding Environment"
                            desc="Write, compile, and debug code in our integrated Monaco Editor. Supports multiple languages with Syntax Highlighting."
                            delay={0}
                        />
                        <FeatureCard
                            icon={<BarChart2 className="w-6 h-6" />}
                            title="Performance Analytics"
                            desc="Go beyond scores. Analyze your accuracy per topic using advanced chart visualizations."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<FileText className="w-6 h-6" />}
                            title="AI Resume Scanner"
                            desc="Upload your resume and get an instant ATS score. Find missing keywords before the recruiter does."
                            highlight
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Map className="w-6 h-6" />}
                            title="Personalized Roadmap"
                            desc="Our AI identifies your weak subjects and builds a week-by-week study plan just for you."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={<Zap className="w-6 h-6" />}
                            title="Real-time Mock Tests"
                            desc="Experience the pressure of real exams with timed tests, full-screen security mode, and instant results."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={<Shield className="w-6 h-6" />}
                            title="Verified Content"
                            desc="Questions curated from actual placement papers of top product-based and service-based companies."
                            delay={0.5}
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-tr from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-white text-lg">P</span>
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">Placement Saathi</span>
                    </div>
                    <p className="text-slate-500 text-sm">© 2024 Placement Saathi. Built for greatness.</p>
                    <div className="flex gap-6">
                        <a href="#" className="text-slate-500 hover:text-primary-600 dark:hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="text-slate-500 hover:text-primary-600 dark:hover:text-white transition-colors">Terms</a>
                        <a href="#" className="text-slate-500 hover:text-primary-600 dark:hover:text-white transition-colors">Contact</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const Stat = ({ number, label, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
    >
        <h4 className="text-4xl font-bold text-slate-900 dark:text-white mb-2 bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">{number}</h4>
        <p className="text-primary-600 dark:text-primary-400 text-sm uppercase tracking-wider font-bold">{label}</p>
    </motion.div>
);

const FeatureCard = ({ icon, title, desc, highlight, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -5 }}
        className={`p-8 rounded-2xl border transition-all duration-300 group relative overflow-hidden ${highlight
            ? 'bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 border-primary-200 dark:border-primary-500/30'
            : 'glass-panel border-slate-200 dark:border-white/5 hover:border-primary-200 dark:hover:border-primary-500/30'
            }`}
    >
        {highlight && <div className="absolute top-0 right-0 p-3 bg-primary-500/10 rounded-bl-xl text-primary-600 dark:text-primary-400 text-xs font-bold">POPULAR</div>}

        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors shadow-lg ${highlight
            ? 'bg-primary-600 text-white shadow-primary-500/30'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-white group-hover:bg-primary-600 shadow-slate-200 dark:shadow-none'
            }`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
            {desc}
        </p>
    </motion.div>
);

export default LandingPage;
