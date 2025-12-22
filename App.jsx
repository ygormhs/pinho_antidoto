import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CheckIn from './pages/CheckIn';
import Exercises from './pages/Exercises';

// Wrapper for protected routes
const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg">
      <div className="w-12 h-12 border-4 border-gray-100 border-t-brand-text rounded-full animate-spin" />
    </div>
  );

  if (!session) return <Navigate to="/login" replace />;

  return children;
};

const Blog = () => <div className="p-8 text-center"><h2 className="text-3xl font-bold">Blog</h2><p className="text-gray-500 mt-4">Funcionalidade em breve...</p></div>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="check-in" element={<CheckIn />} />
            <Route path="exercicios" element={<Exercises />} />
            <Route path="blog" element={<Blog />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
