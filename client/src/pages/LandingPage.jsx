import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Code, FileText, Map, Shield, Zap, Star, Users, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';

// Lazy load 3D scene for performance
const HeroScene = lazy(() => import('../components/Three/HeroScene'));

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-white transition-colors duration-300 font-sans selection:bg-primary-500/30">
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
                        <a href="#testimonials" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Stories</a>
                        <a href="#stats" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Stats</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost" size="sm">Sign In</Button>
                        </Link>
                        <Link to="/signup">
                            <Button variant="primary" size="sm" className="shadow-lg shadow-primary-500/20">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-48 pb-32 px-6 relative overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
                {/* 3D Background */}
                <Suspense fallback={null}>
                    <HeroScene />
                </Suspense>

                {/* Background Blobs (Fallback) */}
                <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse-glow -z-20"></div>
                <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-secondary-600/10 rounded-full blur-[120px] pointer-events-none animate-float -z-20"></div>

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10 text-balance">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-500/30 text-primary-700 dark:text-primary-300 text-xs font-medium mb-8 backdrop-blur-sm"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                        </span>
                        New: AI Resume ATS Scanner Live
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1] text-slate-900 dark:text-white"
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
                        The ultimate preparation platform designed by industry experts. <br className="hidden md:block" /> Practice coding, optimize your resume, and get a personalized path to your dream job.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                    >
                        <Link to="/signup">
                            <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-4 shadow-xl shadow-primary-500/20 hover:shadow-primary-500/40 transition-shadow">
                                Start Practicing Free <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <a href="#features">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-4 backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 hover:bg-white/80 dark:hover:bg-slate-800/80">
                                Explore Features
                            </Button>
                        </a>
                    </motion.div>


                </div>
            </section>

            {/* Partner/Trusted By Section (Visual Filler) */}
            <div className="py-10 border-y border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-6">Designed for aspirants targeting</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {['Google', 'Microsoft', 'Amazon', 'Adobe', 'Uber'].map((company) => (
                            <span key={company} className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200">{company}</span>
                        ))}
                    </div>
                </div>
            </div>


            {/* Stats/Social Proof */}
            <section id="stats" className="py-20 relative">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <Stat number="10k+" label="Active Questions" delay={0} />
                    <Stat number="500+" label="Mock Tests Taken" delay={0.1} />
                    <Stat number="95%" label="Placement Rate" delay={0.2} />
                    <Stat number="24/7" label="AI Support" delay={0.3} />
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 relative transition-colors duration-300 bg-slate-100/50 dark:bg-slate-900/50">
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

            {/* Testimonials */}
            <section id="testimonials" className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">Student Success Stories</h2>
                    <p className="text-slate-600 dark:text-slate-400">Join thousands of students who cracked their dream jobs.</p>
                </div>

                <div className="flex gap-6 animate-scroll hover:pause px-6">
                    {[1, 2, 3, 4].map((i) => (
                        <TestimonialCard
                            key={i}
                            name={i === 1 ? "Aditya Raj" : i === 2 ? "Sarah Chen" : i === 3 ? "Rahul Kumar" : "Priya Patel"}
                            role={i === 1 ? "SDE @ Amazon" : i === 2 ? "Frontend @ Google" : i === 3 ? "Analyst @ Goldman" : "SDE @ Microsoft"}
                            content={i === 1 ? "The AI mock interviews were a game changer. The feedback on my body language and answers helped me ace my real interview." : "The resume scanner helped me fix critical ATS errors I didn't even know existed. Got shortlisted immediately after."}
                            rating={5}
                        />
                    ))}
                    {[1, 2, 3, 4].map((i) => (
                        <TestimonialCard
                            key={`clone-${i}`}
                            name={i === 1 ? "Aditya Raj" : i === 2 ? "Sarah Chen" : i === 3 ? "Rahul Kumar" : "Priya Patel"}
                            role={i === 1 ? "SDE @ Amazon" : i === 2 ? "Frontend @ Google" : i === 3 ? "Analyst @ Goldman" : "SDE @ Microsoft"}
                            content={i === 1 ? "The AI mock interviews were a game changer. The feedback on my body language and answers helped me ace my real interview." : "The resume scanner helped me fix critical ATS errors I didn't even know existed. Got shortlisted immediately after."}
                            rating={5}
                        />
                    ))}
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
                    <p className="text-slate-500 text-sm">© 2026 Placement Saathi. Built for greatness.</p>
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
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay, type: "spring" }}
        className="p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-white/5 shadow-sm"
    >
        <h4 className="text-4xl font-black text-slate-900 dark:text-white mb-2 bg-clip-text text-transparent bg-gradient-to-br from-primary-600 to-purple-600">{number}</h4>
        <p className="text-slate-600 dark:text-slate-400 text-sm uppercase tracking-wider font-bold">{label}</p>
    </motion.div>
);

const FeatureCard = ({ icon, title, desc, highlight, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -5, scale: 1.02 }}
        className={`p-8 rounded-3xl border transition-all duration-300 group relative overflow-hidden flex flex-col ${highlight
            ? 'bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 border-primary-200 dark:border-primary-500/30 shadow-xl shadow-primary-500/10'
            : 'glass-panel border-slate-200 dark:border-white/5 hover:border-primary-200 dark:hover:border-primary-500/30'
            }`}
    >
        {highlight && <div className="absolute top-0 right-0 p-3 bg-primary-500/10 rounded-bl-2xl text-primary-600 dark:text-primary-400 text-xs font-bold">POPULAR</div>}

        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 shadow-lg ${highlight
            ? 'bg-primary-600 text-white shadow-primary-500/30'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-white group-hover:bg-primary-600 shadow-slate-200 dark:shadow-none rotate-0 group-hover:rotate-6'
            }`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm flex-grow">
            {desc}
        </p>
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/5 flex items-center text-primary-600 dark:text-primary-400 font-semibold text-sm cursor-pointer group-hover:gap-2 transition-all">
            Learn more <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </div>
    </motion.div>
);

const TestimonialCard = ({ name, role, content, rating }) => (
    <div className="flex-shrink-0 w-[350px] p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 shadow-lg mx-4">
        <div className="flex gap-1 mb-4 text-yellow-400">
            {[...Array(rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
        </div>
        <p className="text-slate-600 dark:text-slate-300 mb-6 italic">"{content}"</p>
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                {name[0]}
            </div>
            <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">{role}</p>
            </div>
        </div>
    </div>
);


export default LandingPage;
