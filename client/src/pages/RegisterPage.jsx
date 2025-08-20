// client/src/pages/RegisterPage.jsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import toast from 'react-hot-toast';
import { getBootstrapStatus } from '../services/api';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api`;

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState('Viewer');
    const navigate = useNavigate();
    const [hasAdmin, setHasAdmin] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const { hasAdmin } = await getBootstrapStatus();
                setHasAdmin(hasAdmin);
                if (hasAdmin) {
                    // If admin exists and a non-admin is trying to access register directly, redirect to login
                    // Admins should create accounts via the Admin UI
                    navigate('/login', { replace: true });
                }
            } catch (_) {
                // Fail open: allow page if endpoint fails
                setHasAdmin(false);
            }
        };
        load();
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(`${API_URL}/auth/register`, { name, email, password, role });
            toast.success(response.data.message);
            // --- THIS IS THE REDIRECT LOGIC ---
            // On success, navigate the user to the login page.
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // If bootstrap status is loading, show nothing (quick flash prevention)
    if (hasAdmin === null) return null;

    return (
        <div className="flex items-center justify-center min-h-screen bg-dark">
             <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 space-y-6 bg-card-bg rounded-lg shadow-lg border border-border"
            >
                <div className="text-center">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-primary text-4xl mb-2" />
                    <h1 className="text-2xl font-bold text-light">Create Your CyberShield Account</h1>
                    <p className="text-gray-text">Join the team of security experts.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-text">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 mt-2 text-light bg-dark border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
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
                        <label className="text-sm font-medium text-gray-text">Role</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2 mt-2 text-light bg-dark border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="Viewer">Viewer</option>
                            <option value="Analyst">Analyst</option>
                            <option value="Admin">Admin</option>
                        </select>
                        <p className="text-xs text-gray-text mt-1">Only two Admins are allowed. If the limit is reached, you will be asked to choose another role.</p>
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-4 py-2 font-bold text-white bg-primary rounded-md hover:bg-primary-dark disabled:opacity-50"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </div>
                </form>
                <div className="text-center text-sm text-gray-text">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;