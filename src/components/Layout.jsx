import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
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
            <main className="pl-64 min-h-screen">
                <div className="max-w-5xl mx-auto p-8 lg:p-12">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
