import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,

    // Register User
    register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post('/auth/register', userData);
            const { token, data } = res.data;

            localStorage.setItem('token', token);
            set({
                user: data,
                token,
                isAuthenticated: true,
                isLoading: false
            });
            return { success: true };
        } catch (err) {
            set({
                error: err.response?.data?.error || 'Registration failed',
                isLoading: false
            });
            return { success: false, error: err.response?.data?.error };
        }
    },

    // Login User
    login: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await api.post('/auth/login', userData);
            const { token, data } = res.data;

            localStorage.setItem('token', token);
            set({
                user: data,
                token,
                isAuthenticated: true,
                isLoading: false
            });
            return { success: true };
        } catch (err) {
            set({
                error: err.response?.data?.error || 'Login failed',
                isLoading: false
            });
            return { success: false, error: err.response?.data?.error };
        }
    },

    // Logout User
    logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
    },

    // Load User (Check if token is valid)
    loadUser: async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        set({ isLoading: true });
        try {
            const res = await api.get('/auth/me');
            set({
                user: res.data.data,
                isAuthenticated: true,
                isLoading: false
            });
        } catch (err) {
            localStorage.removeItem('token');
            set({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false
            });
        }
    },
}));

export default useAuthStore;
