// client/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {
    const [email, setEmail] = useState('analyst@soc.com'); // Pre-fill for convenience
    const [password, setPassword] = useState('password123'); // Pre-fill for convenience
    const [isLoading, setIsLoading] = useState(false);
    
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // If user is already logged in, redirect them to the dashboard
    if (isAuthenticated) {
        return <Navigate to="/" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await login(email, password);
        if (success) {
            navigate('/'); // Redirect to dashboard on successful login
        } else {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-dark">
            <div className="w-full max-w-md p-8 space-y-6 bg-card-bg rounded-lg shadow-lg border border-border">
                <div className="text-center">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-primary text-4xl mb-2" />
                    <h1 className="text-2xl font-bold text-light">CyberShield SOC</h1>
                    <p className="text-gray-text">Please sign in to continue</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-text">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mt-2 text-light bg-dark border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-text">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 mt-2 text-light bg-dark border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-2 font-bold text-white bg-primary rounded-md hover:bg-primary-dark disabled:opacity-50"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                </form>
                <div className="text-center text-xs text-gray-text">
                    <p>Use: analyst@soc.com / viewer@soc.com / admin@soc.com</p>
                    <p>Password: password123</p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;