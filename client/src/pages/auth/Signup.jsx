import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student' // Default role
    });
    const { register, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const { name, email, password, role } = formData;

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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            >
                <div className="flex justify-center mb-6">
                    <div className="bg-secondary p-3 rounded-full">
                        <UserPlus className="text-white w-8 h-8" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form onSubmit={onSubmit}>
                    <Input
                        label="Full Name"
                        type="text"
                        placeholder="John Doe"
                        name="name"
                        value={name}
                        onChange={onChange}
                        required
                    />
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

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">I am a</label>
                        <div className="flex gap-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={role === 'student'}
                                    onChange={onChange}
                                    className="mr-2 text-primary focus:ring-primary"
                                />
                                <span className="text-gray-700">Student</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={role === 'admin'}
                                    onChange={onChange}
                                    className="mr-2 text-primary focus:ring-primary"
                                />
                                <span className="text-gray-700">Admin (Demo)</span>
                            </label>
                        </div>
                    </div>

                    <Button type="submit" variant="secondary" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </Button>
                </form>

                <p className="mt-4 text-center text-gray-600 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:text-indigo-800 font-bold">
                        Login
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
