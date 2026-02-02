import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const { login, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        const result = await login(formData);
        if (result.success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-dark-bg relative overflow-hidden p-4">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[700px] h-[700px] bg-primary-500/20 rounded-full blur-[120px] animate-pulse-glow"></div>
                <div className="absolute top-[20%] -right-[10%] w-[600px] h-[600px] bg-secondary-500/10 rounded-full blur-[100px] animate-float"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="mb-8 text-center">
                    <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
                        <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-secondary-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
                            <span className="font-bold text-white text-xl">P</span>
                        </div>
                        <span className="font-bold text-2xl text-slate-900 dark:text-white tracking-tight">Placement Saathi</span>
                    </Link>
                </div>

                <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/60 border-white/20 dark:border-white/10 shadow-2xl">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome Back</h2>
                        <p className="text-slate-600 dark:text-slate-400">Sign in to access your dashboard</p>
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

                    <form onSubmit={onSubmit} className="space-y-5">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="name@example.com"
                            name="email"
                            value={email}
                            onChange={onChange}
                            required
                        />

                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">
                                    Password
                                </label>
                                <Link to="/forgot-password" className="text-xs font-semibold text-primary-600 hover:text-primary-500 dark:text-primary-400">
                                    Forgot Password?
                                </Link>
                            </div>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                name="password"
                                value={password}
                                onChange={onChange}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="w-full text-lg py-6 mt-2"
                            icon={LogIn}
                        >
                            Sign In
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-slate-600 dark:text-slate-400 text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-bold transition-colors">
                            Create Account
                        </Link>
                    </p>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;
