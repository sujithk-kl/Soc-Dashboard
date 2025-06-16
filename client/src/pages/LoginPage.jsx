// client/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Navigate, Link } from 'react-router-dom'; // <-- IMPORT Link
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {
    const [email, setEmail] = useState('analyst@soc.com');
    const [password, setPassword] = useState('password123');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await login(email, password);
        if (success) {
            navigate('/dashboard');
        } else {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-dark">
            <div className="w-full max-w-md p-8 space-y-6 bg-card-bg rounded-lg shadow-lg border border-border">
                {/* ... (login form header) */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* ... (email and password inputs) */}
                    <div>
                        <button type="submit" /* ... */ >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>
                {/* --- ADD LINK TO REGISTER PAGE --- */}
                <div className="text-center text-sm text-gray-text">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-primary hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;