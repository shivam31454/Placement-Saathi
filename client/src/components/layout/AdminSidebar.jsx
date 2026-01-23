import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, FileText, BarChart2, Users, Settings } from 'lucide-react';
import { clsx } from 'clsx';
import useAuthStore from '../../store/useAuthStore';

const SidebarItem = ({ to, icon: Icon, label }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 mb-1",
                    isActive
                        ? "bg-primary text-white shadow-md"
                        : "text-gray-600 hover:bg-indigo-50 hover:text-primary"
                )
            }
        >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
        </NavLink>
    );
};

const AdminSidebar = () => {
    const { logout } = useAuthStore();

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 z-30">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Placement Saathi
                </h1>
                <p className="text-xs text-gray-500 font-semibold mt-1 uppercase tracking-wider">Admin Panel</p>
            </div>

            <nav className="flex-1 p-4 overflow-y-auto">
                <div className="mb-6">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Overview</p>
                    <SidebarItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <SidebarItem to="/admin/analytics" icon={BarChart2} label="Analytics" />
                </div>

                <div className="mb-6">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Content</p>
                    <SidebarItem to="/admin/questions" icon={BookOpen} label="Question Bank" />
                    <SidebarItem to="/admin/tests" icon={FileText} label="Mock Tests" />
                    <SidebarItem to="/admin/subjects" icon={FileText} label="Subjects & Topics" />
                </div>

                <div className="mb-6">
                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Users</p>
                    <SidebarItem to="/admin/users" icon={Users} label="Student Management" />
                </div>
            </nav>

            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 w-full transition-colors"
                >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
