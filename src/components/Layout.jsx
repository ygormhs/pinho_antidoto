import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-brand-bg">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-text rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-brand-bg">
            <Sidebar />
            <main className="lg:pl-64 min-h-screen pb-24 lg:pb-0">
                <div className="max-w-5xl mx-auto p-6 lg:p-12">
                    <Outlet />
                </div>
            </main>
            <MobileNav />
        </div>
    );
}
