// client/src/pages/LoginPage.jsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { getBootstrapStatus } from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';

const LoginPage = () => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [hasAdmin, setHasAdmin] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const { hasAdmin } = await getBootstrapStatus();
                setHasAdmin(hasAdmin);
            } catch (_) {
                setHasAdmin(true); // default to hiding link if uncertain
            }
        };
        load();
    }, []);

    // If the user is already logged in, send them straight to the dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await login(email, password);
        
        // --- THIS IS THE REDIRECT LOGIC ---
        // If the login function returns `true`, navigate to the dashboard.
        if (success) {
            navigate('/dashboard');
        } else {
            // If login fails, re-enable the button
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
                {hasAdmin === false && (
                    <div className="text-center text-sm text-gray-text">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-primary hover:underline">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;