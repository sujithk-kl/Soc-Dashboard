// client/src/pages/HomePage.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBootstrapStatus } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
    const [hasAdmin, setHasAdmin] = useState(null);
    const { user, isAuthenticated, ROLES } = useAuth();
    const isAdmin = user?.role === ROLES.ADMIN;

    useEffect(() => {
        const load = async () => {
            try {
                const { hasAdmin } = await getBootstrapStatus();
                setHasAdmin(hasAdmin);
            } catch (_) {
                setHasAdmin(true);
            }
        };
        load();
    }, []);

    return (
        <div className="bg-homepage text-light min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-xl bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-10 text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                    SOC Dashboard
                </h1>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors"
                            >
                                Go to Dashboard
                            </Link>
                            {isAdmin && (
                                <Link
                                    to="/dashboard/rbac"
                                    className="bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Admin Panel
                                </Link>
                            )}
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors"
                            >
                                Login
                            </Link>
                            {hasAdmin === false && (
                                <Link
                                    to="/register"
                                    className="bg-transparent border border-white/20 text-light font-semibold py-3 px-6 rounded-lg hover:border-white/40 transition-colors"
                                >
                                    Register
                                </Link>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;