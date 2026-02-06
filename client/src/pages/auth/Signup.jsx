import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const { register, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const { name, email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        const result = await register(formData);
        if (result.success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg relative overflow-hidden p-4">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -bottom-[20%] -left-[10%] w-[700px] h-[700px] bg-secondary-500/20 rounded-full blur-[120px] animate-pulse-glow"></div>
                <div className="absolute top-[10%] -right-[10%] w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[100px] animate-float"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="mb-6 text-center">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                        <div className="w-10 h-10 bg-gradient-to-tr from-secondary-500 to-rose-500 rounded-lg flex items-center justify-center shadow-lg shadow-secondary-500/20 group-hover:scale-110 transition-transform duration-300">
                            <span className="font-bold text-white text-xl">P</span>
                        </div>
                        <span className="font-bold text-2xl text-slate-900 dark:text-white tracking-tight">Placement Saathi</span>
                    </Link>
                </div>

                <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-2xl">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h2>
                        <p className="text-slate-600 dark:text-slate-400">Join thousands of students achieving their dreams</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg flex items-center mb-6 text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-4">
                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            name="name"
                            value={name}
                            onChange={onChange}
                            required
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="name@example.com"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            name="password"
                            value={password}
                            onChange={onChange}
                            required
                        />



                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="w-full text-lg py-6 mt-4 bg-gradient-to-r from-secondary-600 to-rose-600 hover:from-rose-600 hover:to-secondary-600 shadow-secondary-500/25"
                            icon={UserPlus}
                        >
                            Create Account
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-slate-600 dark:text-slate-400 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-secondary-600 hover:text-secondary-500 dark:text-secondary-400 font-bold transition-colors">
                            Sign In
                        </Link>
                    </p>
                </Card>
            </motion.div>
        </div>
    );
};

export default Signup;
