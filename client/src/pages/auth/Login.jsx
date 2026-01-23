import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            >
                <div className="flex justify-center mb-6">
                    <div className="bg-primary p-3 rounded-full">
                        <LogIn className="text-white w-8 h-8" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={onSubmit}>
                    <Input
                        label="Email Address"
                        type="email"
                        placeholder="john@example.com"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="********"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                    />

                    <div className="flex items-center justify-between mb-6">
                        <Link to="/forgot-password" className="text-sm text-primary hover:text-indigo-800 font-semibold">
                            Forgot Password?
                        </Link>
                    </div>

                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>

                <p className="mt-4 text-center text-gray-600 text-sm">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary hover:text-indigo-800 font-bold">
                        Sign Up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
